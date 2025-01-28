import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uuid import UUID
import logging
from typing import List
from uuid import UUID
import logging
logging.basicConfig(level=logging.INFO)
import resend 

from src.lambda_generator import lambda_generator
from src.backend_types import OutputExecutionMessage, OutputSaveMessage, OutputLoadMessage, OutputGenerateLambdaMessage, OutputPosthogSetupMessage, ScheduledJob, NotebookDetails, ConnectorResponse
from src.helpers.notebook import notebook
from src.scheduler.notebook_scheduler import NotebookScheduler
from src.backend_types import ConnectorCredentials

from supabase import Client
from helpers.backend.supabase import job_status
from helpers.backend.supabase.connector_credentials import create_connector_credentials, get_connector_credentials, get_is_type_connected, delete_connector_credentials
from helpers.backend.supabase.client import get_supabase_client
supabase: Client = get_supabase_client()
resend.api_key = os.getenv('RESEND_API_KEY')

app = FastAPI()
# scheduler = NotebookScheduler()  # Single instance
# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Dictionary to manage kernels per session
notebook_sessions = {}

# TODO: This should only load in a notebook if it's not already loaded. It currently loads /dashboard/projects
@app.websocket("/ws/{notebook_id}")
async def websocket_endpoint(websocket: WebSocket, notebook_id: str):
    print(f"New connection with notebook ID: {notebook_id}")
    
    await websocket.accept()
    
    try:
        while True:
            if notebook_id not in notebook_sessions:
                nb = notebook.NotebookUtils(notebook_id, websocket)
                await websocket.send_json({"type": "init", "message": "Kernel initializing. Please wait."})
                kernel_manager, kernel_client = nb.initialize_kernel()
                notebook_sessions[notebook_id] = {'km': kernel_manager, 'kc': kernel_client, 'nb': nb}
            
            nb = notebook_sessions[notebook_id]['nb']
            data = await websocket.receive_json()
            
            if data['type'] == 'execute':
                code = data['code']
                output = await nb.execute_code(code=code)

                # print(f"Sending output: {output}, type: {type(output)}, cellId: {data['cellId']}\n\n")
                msgOutput = OutputExecutionMessage(type='output', cellId=data['cellId'], output=output)
                await websocket.send_json(msgOutput.model_dump())
            
            elif data['type'] == 'save_notebook':
                response = await nb.save_notebook(data)
                # print("response", response)
                response = OutputSaveMessage(type='notebook_saved', success=response['success'], message=response['message'])
                await websocket.send_json(response.model_dump())
                
            elif data['type'] == 'load_notebook':
                response = await nb.load_notebook_handler(data['filename'], data['notebook_id'], data['user_id'])
                # print("response", response)
                output = OutputLoadMessage(type='notebook_loaded', success=response['status'] == 'success', message=response['message'], cells=response['notebook'])
                await websocket.send_json(output.model_dump())
 
            elif data['type'] == 'create_connector':
                try:
                    print("Creating connector", data)
                    credentials: ConnectorCredentials = {
                        "connector_type": data['connector_type'],
                        "user_id": data['user_id'],
                        "notebook_id": data['notebook_id'],
                        "credentials": data['credentials']
                    }
                    # print("Installing dependencies")
                    dependency_list = ['cosmic-sdk', 'pydantic', 'requests']
                    dependencies = await nb.execute_code(code='!pip install ' + ' '.join(dependency_list))

                    # print("dependencies", dependencies)
                    output = await nb.handle_connector_request(credentials)
                    # print("Connector created response", output)
                    await websocket.send_json(output.model_dump())
                except Exception as e:
                    logging.error(f"Error creating connector: {e}")
                    await websocket.send_json({
                        'type': 'error',
                        'message': str(e)
                    })
                continue  # Continue listening for more messages
               
            elif data['type'] == 'deploy_lambda':
                # TODO: Better dependency management here.
                # TODO: Get status/msg directly from function.
                # TODO: Make a base lambda layer for basic dependencies.
                dependencies = await nb.execute_code(code='!pip list --format=freeze')
                lambda_handler = lambda_generator.LambdaGenerator(data['all_code'], data['user_id'], data['notebook_name'], data['notebook_id'], dependencies)
                status = False

                msg = "Processing the notebook"
                response = OutputGenerateLambdaMessage(type='lambda_generated', success=status, message=msg)
                await websocket.send_json(response.model_dump())
                lambda_handler.save_lambda_code()

                msg = "Preparing your code for prod"
                lambda_handler.prepare_container()
                response = OutputGenerateLambdaMessage(type='lambda_generated', success=status, message=msg)
                await websocket.send_json(response.model_dump())

                msg = "Shipping your code to the cloud"
                lambda_handler.build_and_push_container()
                response = OutputGenerateLambdaMessage(type='lambda_generated', success=status, message=msg)
                await websocket.send_json(response.model_dump())
                response = lambda_handler.create_lambda_fn()
                
                msg = "Creating an API for you"
                response = OutputGenerateLambdaMessage(type='lambda_generated', success=status, message=msg)
                await websocket.send_json(response.model_dump())
                
                status, message = lambda_handler.create_api_endpoint()
                response = OutputGenerateLambdaMessage(type='lambda_generated', success=status, message=message)
                await websocket.send_json(response.model_dump())

                api = message

                # Get user email from Supabase
                # TODO: Move this to a helper class.
                user_data = supabase.table('notebooks').select('user_id').eq('id', data['notebook_id']).execute()
                if user_data and user_data.data:
                    user_id = user_data.data[0]['user_id']
                
                user_obj = supabase.auth.admin.get_user_by_id(user_id)
                if user_obj and user_obj.user:
                    email = user_obj.user.email
                else:
                    raise Exception("User email not found for user_id: " + user_id)
                
                # Sending email with the attachment
                resend.Emails.send({
                    "from": "shikhar@agentkali.ai",
                    "to": email,
                    "subject": "Your API is ready",
                    "html": f"<p>Congrats on creating your <strong>first API</strong>!</p><p>You can find it here: {api}</p>",
                })

            msgOutput = ''
            
    except WebSocketDisconnect:
        logging.info(f"WebSocket disconnected for notebook ID: {notebook_id}")
    except Exception as e:
        logging.error(f"Error in websocket connection: {str(e)}")
        try:
            await websocket.send_json({
                'type': 'error',
                'message': str(e)
            })
        except:
            pass
    finally:
        if notebook_id in notebook_sessions:
            # Clean up kernel if needed
            pass

@app.get("/status/jobs/{user_id}")
async def status_endpoint_jobs_for_user(user_id: UUID):
    # TODO: Check if user has access to this data.
    return job_status.get_all_jobs_for_user(str(user_id))

@app.get("/status/jobs/{user_id}/{request_id}")
async def status_endpoint_job_by_request_id(user_id: int, request_id: str):
    return job_status.get_job_by_request_id(request_id, user_id)

@app.get("/status/notebook/jobs/{notebook_id}")
async def status_endpoint_jobs_for_notebook(notebook_id: UUID): 
    return job_status.get_all_jobs_for_notebook(notebook_id)

# @app.on_event("startup")
# async def start_scheduler():
#     scheduler.start()

# @app.on_event("shutdown")
# async def shutdown_scheduler():
#     scheduler.shutdown()

@app.on_event("shutdown")
async def cleanup():
    for session in notebook_sessions.values():
        if 'nb' in session:
            try:
                session['nb'].magic.cleanup_packages()
            except:
                pass

@app.get("/notebook_details/{notebook_id}")
async def get_notebook_details(notebook_id: str) -> NotebookDetails:
    nb = notebook.NotebookUtils(notebook_id, None)
    details = await nb.get_notebook_details()
    print("Notebook Details:", details)
    return NotebookDetails(**details)

@app.get("/notebook_job_schedule/{notebook_id}")
async def get_schedules(notebook_id: str) -> List[ScheduledJob]:
    schedules = await scheduler.get_schedules(notebook_id)
    return schedules

@app.post("/notebook_job_schedule/{notebook_id}")
async def create_schedule(notebook_id: str, schedule: dict):
    print(f"Creating schedule for notebook {notebook_id} with params {schedule}")
    scheduled_details = ScheduledJob(**schedule)
    try:
        job_details = await scheduler.create_or_update_schedule(
            notebook_id=notebook_id,
            schedule_details=scheduled_details
        )
        
        return job_details
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/notebook_job_schedule/{schedule_id}")
async def update_schedule(schedule_id: str, schedule: ScheduledJob):
    try:
        job_details = await scheduler.create_or_update_schedule(
            schedule_id=schedule_id,
            schedule_type=schedule.schedule,
            input_params=schedule.input_params,
        )
        
        return {
            "status": "success",
            "data": job_details
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/notebook_job_schedule/{schedule_id}")
async def delete_schedule(schedule_id: str):
    try:
        scheduler.remove_schedule(schedule_id)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


#----------------------------------
# Connectors
#----------------------------------
@app.post("/connectors/create")
async def create_connector(connector_data: ConnectorCredentials):
    return await create_connector_credentials(
        connector_data.org_id,
        connector_data.user_id,
        connector_data.connector_type,
        connector_data.credentials
    )

@app.delete("/connectors/delete/{connector_id}")
async def delete_connector(connector_id: str):
    return delete_connector_credentials(connector_id)
  
@app.get("/connectors/{user_id}/{notebook_id}")
async def get_connectors(user_id: UUID, notebook_id: UUID):
    print(f"Getting connectors for user {user_id} and notebook {notebook_id}")
    return get_connector_credentials(user_id, notebook_id)

@app.get("/connectors/{user_id}/{type}")
async def check_connector_connection(user_id: UUID, notebook_id: UUID, type: str):
    return get_is_type_connected(user_id, notebook_id, type)


if __name__ == "__main__":
    if not os.path.exists('notebooks'):
        os.makedirs('notebooks')

    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=47153,
        reload=True,
        reload_excludes=[
            "lambda_dumps/**",
            "**/lambda_dumps/**",
            "**/lambda_function.py",              # Exclude any lambda_function.py
            "**/requirements.txt"                 # Exclude any requirements.txt
        ],
        log_level="info",
        access_log=True
    )

