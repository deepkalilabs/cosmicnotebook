import os
import sys
import json
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
print(sys.path)

from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uuid import UUID
import logging
from typing import List
from uuid import UUID
import logging
logging.basicConfig(level=logging.INFO)
import resend 
from src.lambda_generator import lambda_generator
from src.backend_types import OutputGenerateLambdaMessage, ScheduledJob, NotebookDetails
from src.helpers.notebook import notebook
from src.scheduler.notebook_scheduler import NotebookScheduler
from src.backend_types import ConnectorCredentials
from supabase import Client
from helpers.backend.supabase.client import get_supabase_client
from helpers.backend.aws.s3 import s3
from helpers.backend.supabase import job_status
from helpers.backend.supabase.connector_credentials import get_connector_credentials, get_is_type_connected, delete_connector_credentials
from helpers.backend.supabase.integration_credentials import create_credentials, get_integration, update_credentials, delete_credentials, get_all_integrations
from helpers.backend.supabase.logs import SupabaseLogs
from src.logging.cloudwatch.deployment import DeploymentLogger

from src.lambda_generator import lambda_generator
from src.backend_types import ScheduledJob, NotebookDetails, ConnectorCredentials, ScheduledJobRequest
from src.helpers.notebook import notebook
from src.connectors.manager import ConnectorManager
from src.logging.runtime_logs import RuntimeLogger
supabase: Client = get_supabase_client()
resend.api_key = os.getenv('RESEND_API_KEY')
import traceback
from src.nb_import.ImportNotebook import ImportNotebook

app = FastAPI()
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
@app.websocket("/ws/{notebook_id}/{notebook_name}")
async def websocket_endpoint(websocket: WebSocket, notebook_id: str, notebook_name: str):
    logging.info(f"New connection with notebook ID: {notebook_id}")    
        
    await websocket.accept()

    logging.info("Accepted connection from websocket", websocket)
    try:
        while True:
            logging.info("Waiting for message")
            data = await websocket.receive_json()
            logging.info(f"data received {data}")
            if data['type'] == 'deploy_notebook':
                

                # TODO: Better dependency management here.
                # TODO: Get status/msg directly from function.
                # TODO: Make a base lambda layer for basic dependencies.
                # dependencies = await nb.execute_code(code='!pip list --format=freeze')
                # logging.info(f"Received message in the block 2: {data}")

                python_script, requirements = s3.get_python_deets_from_s3(
                    notebook_id=notebook_id,
                    user_id=data['user_id'],
                    project_name=notebook_name
                )

                logging.info(f"python_script {python_script}")
                logging.info(f"requirements {requirements}")
                #deployment_logger.log(f"python_script {python_script}", "info", {})
                #deployment_logger.log(f"requirements {requirements}", "info", {})

                lambda_handler = lambda_generator.LambdaGenerator(python_script, data['user_id'], data['notebook_name'], data['notebook_id'], requirements)
                status = False

                msg = "Processing the notebook"
                response = OutputGenerateLambdaMessage(type='deploying_notebook', success=status, message=msg)
                
                await websocket.send_json(response.model_dump())
                #deployment_logger.log(f"response {response}", "info", {})
                lambda_handler.save_lambda_code()
                #deployment_logger.log("Saved lambda code", "info", {})

                msg = "Preparing your code for prod"
                lambda_handler.prepare_container()
                response = OutputGenerateLambdaMessage(type='deploying_notebook', success=status, message=msg)
                await websocket.send_json(response.model_dump())
                #deployment_logger.log(f"response {response}", "info", {})

                msg = "Shipping your code to the cloud"
                lambda_handler.build_and_push_container()
                response = OutputGenerateLambdaMessage(type='deploying_notebook', success=status, message=msg)
                await websocket.send_json(response.model_dump())
                #deployment_logger.log(f"response {response}", "info", {})
                response = lambda_handler.create_lambda_fn()
                #deployment_logger.log(f"response {response}", "info", {})

                msg = "Creating an API for you"
                response = OutputGenerateLambdaMessage(type='deploying_notebook', success=status, message=msg)
                await websocket.send_json(response.model_dump())
                #deployment_logger.log(f"response {response}", "info", {})
                status, message = lambda_handler.create_api_endpoint()
                response = OutputGenerateLambdaMessage(type='deploying_notebook', success=status, message=message)
                await websocket.send_json(response.model_dump())
                #deployment_logger.log(f"response {response}", "info", {})

                api = message

                # Get user email from Supabase
                # TODO: Move this to a helper class.
                # user_data = supabase.table('notebooks').select('user_id').eq('id', data['notebook_id']).execute()
                # if user_data and user_data.data:
                #     user_id = user_data.data[0]['user_id']
                
                # user_obj = supabase.auth.admin.get_user_by_id(user_id)
                # if user_obj and user_obj.user:
                #     email = user_obj.user.email
                # else:
                #     raise Exception("User email not found for user_id: " + user_id)
                
                # # Sending email with the attachment
                # resend.Emails.send({
                #     "from": "shikhar@agentkali.ai",
                #     "to": email,
                #     "subject": "Your API is ready",
                #     "html": f"<p>Congrats on creating your <strong>first API</strong>!</p><p>You can find it here: {api}</p>",
                # })

            msgOutput = ''
            
    except Exception as e:
        logging.info(f"WebSocket disconnected for notebook ID: {notebook_id}")
        logging.info(f"WebSocket disconnect code: {str(e)}")
        # logging.info(f"WebSocket disconnect reason: {e.reason}")
        # logging.error(f"Error in websocket connection: {str(e)}")
        logging.error(f"Traceback:\n{traceback.format_exc()}")
        # logging.error(f"Error in websocket connection: {str(e)}")
        # logging.error(f"Traceback:\n{traceback.format_exc()}")
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

@app.post("/jobs/job_logs/{job_id}")
async def get_logs_for_notebook_job(job_id: str, job_details: dict):
    notebook_id = job_details['notebook_id']
    aws_log_group = job_details['aws_log_group']
    aws_log_stream = job_details['aws_log_stream']

    logger = RuntimeLogger(aws_log_group, aws_log_stream, notebook_id)
    return logger.get_logs_from_cloudwatch()

@app.post("/notebook_import/{user_id}")
async def import_notebook(user_id: str, notebook_data: dict) -> dict:
    import_notebook_details = ImportNotebook(notebook_data, user_id).save_to_cloud()
    if import_notebook_details['status'] == 200:
        return {
            'success': True,
            'message': 'Notebook imported successfully',
            'status': 200,
            'notebook_id': import_notebook_details['notebook_id']
        }
    else:
        return {
            'success': False,
            'message': 'Failed to import notebook',
            'status': 500,
            'notebook_id': None
        }

@app.on_event("shutdown")
async def cleanup():
    for session in notebook_sessions.values():
        if 'nb' in session:
            try:
                session['nb'].magic.cleanup_packages()
            except:
                pass

@app.get("/notebook_details/{notebook_id}")
async def get_notebook_data(notebook_id: str) -> NotebookDetails:
    notebook_details = supabase.table('notebooks').select('*').eq('id', notebook_id).execute()
    logging.info(f"notebook_details {notebook_details.data[0]}")
    return NotebookDetails(**notebook_details.data[0])

@app.get("/notebook_job_schedule/{notebook_id}")
async def get_schedules(notebook_id: str) -> List[ScheduledJob]:
    scheduler = NotebookScheduler(notebook_id)
    schedules = await scheduler.get_schedules()
    return schedules

@app.post("/notebook_job_schedule/{notebook_id}")
async def create_schedule(notebook_id: str, schedule: dict):
    print(f"Creating schedule for notebook {notebook_id} with params {schedule}")
    scheduler = NotebookScheduler(notebook_id)
    scheduled_details = ScheduledJob(**schedule)
    print("scheduled_details", scheduled_details)
    try:
        job_details = await scheduler.create_schedule(
            notebook_job_schedule=scheduled_details
        )
        
        return job_details
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/notebook_job_schedule/{notebook_id}/{schedule_id}")
async def delete_schedule(notebook_id: str, schedule_id: str):
    scheduler = NotebookScheduler(notebook_id)
    return await scheduler.delete_schedule(schedule_id)

#----------------------------------
# Connectors
#----------------------------------
@app.post("/connectors/create")
async def create_connector(connector_data: dict):
    print(f"Creating connector {connector_data}")
    try:
        # Convert the raw dict to ConnectorCredentials
        connector_details = ConnectorCredentials(
            user_id=connector_data['user_id'],
            org_id=connector_data['org_id'],
            notebook_id=connector_data.get('notebook_id'),  # Using .get() since it's optional
            connector_type=connector_data['connector_type'],
            credentials=connector_data['credentials'],
        )

        connector_manager = ConnectorManager()
        result = await connector_manager.setup_connector(connector_details)
        print(f"Result: {result}")
        return result
    except Exception as e:
        logging.error(f"Error creating connector: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@app.delete("/connectors/delete/{connector_id}")
async def delete_connector(connector_id: str):
    print(f"Deleting connector {connector_id}")
    return delete_connector_credentials(connector_id)
  
@app.get("/connectors/all/{org_id}")
async def get_connectors(org_id: str):
    print(f"Getting connectors for org {org_id}")
    return await get_connector_credentials(org_id)

@app.get("/connectors/{user_id}/{type}")
async def check_connector_connection(user_id: UUID, notebook_id: UUID, type: str):
    return get_is_type_connected(user_id, notebook_id, type)


#----------------------------------
# Integrations
#----------------------------------
@app.post("/integrations/create")
async def create_integration(integration_data: dict):
    print("Creating integration", integration_data)
    return await create_credentials(
        org_id=integration_data['org_id'],
        notebook_id=integration_data['notebook_id'],
        integration_type=integration_data['integration_type'],
        credentials=integration_data['credentials']
    )
 
@app.get("/integrations/{integration_id}")
async def get_integration(integration_id: str):
    return get_integration(integration_id)

@app.get("/integrations/all/{org_id}")
async def get_all_integrations(org_id: str):
    return get_all_integrations(org_id)   


#----------------------------------
#   Logging
#----------------------------------
# TODO Separate call if the notebook is deployed or not.
@app.get("/logs/{notebook_id}")
async def get_deployment_logs(notebook_id: str):
    print(f"Getting deployment logs for notebook {notebook_id}")
    supabase_logs = SupabaseLogs()
    log_details = supabase_logs.get_deployment_logs(notebook_id)
    print(f"log_details {log_details}")
    log = json.loads(log_details['body'])
    if len(log) > 0:
        print(f"log {log[0]}")
        logger = DeploymentLogger(
            log[0]['log_group'], 
            log[0]['log_stream'],
            'org_id',
            notebook_id
        )
        return logger.get_logs_from_cloudwatch()
    else:
        return []


if __name__ == "__main__":
    print("Starting server")
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
        access_log=True,
        ws_ping_interval=600, 
        ws_ping_timeout=60
    )

    # import debugpy
    # debugpy.listen(("0.0.0.0", 47153))
    # debugpy.wait_for_client()
    # import uvicorn
    # uvicorn.run("main:app", host="0.0.0.0", port=47153)
