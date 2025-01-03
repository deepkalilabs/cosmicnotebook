from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from helpers.lambda_generator import lambda_generator
from helpers.supabase import job_status
from helpers.types import OutputExecutionMessage, OutputSaveMessage, OutputLoadMessage, OutputGenerateLambdaMessage, OutputPosthogSetupMessage, ScheduledJob, NotebookDetails

from uuid import UUID
from helpers.notebook import notebook
import logging
from helpers.scheduler.notebook_scheduler import NotebookScheduler
from typing import List
logging.basicConfig(level=logging.INFO)

app = FastAPI()
scheduler = NotebookScheduler()  # Single instance
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

@app.websocket("/ws/{session_id}/{notebook_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str, notebook_id: str):

    print(f"New connection with session ID: {session_id} and notebook ID: {notebook_id}")
    
    await websocket.accept()
    
    print(f"New connection with session ID: {session_id} and notebook ID: {notebook_id}")

    try:
        while True:
            if notebook_id not in notebook_sessions:
                nb = notebook.NotebookUtils(notebook_id)
                await websocket.send_json({"type": "init", "message": "Kernel initializing. Please wait."})
                kernel_manager, kernel_client = nb.initialize_kernel()
                notebook_sessions[notebook_id] = {'km': kernel_manager, 'kc': kernel_client, 'nb': nb}
            
            nb = notebook_sessions[notebook_id]['nb']

            data = await websocket.receive_json()
            
            if data['type'] == 'execute':
                code = data['code']
                output = await nb.execute_code(code=code)

                print(f"Sending output: {output}, type: {type(output)}, cellId: {data['cellId']}\n\n")
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
                # sleep(3) # Wait for API to be registered at AWS
                await websocket.send_json(response.model_dump())
                
            msgOutput = ''
            
    except WebSocketDisconnect:
        pass
    finally:
        # Optionally, you can decide when to shut down the kernel
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

@app.on_event("startup")
async def start_scheduler():
    scheduler.start()

@app.on_event("shutdown")
async def shutdown_scheduler():
    scheduler.shutdown()

@app.get("/notebook_details/{notebook_id}")
async def get_notebook_details(notebook_id: str) -> NotebookDetails:
    nb = notebook.NotebookUtils(notebook_id)
    details = await nb.get_notebook_details()
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

if __name__ == "__main__":
    if not os.path.exists('notebooks'):
        os.makedirs('notebooks')

    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000,
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

