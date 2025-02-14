from pydantic import BaseModel
from typing import Optional, Dict, Any, List, Union

class OutputExecutionMessage(BaseModel):
    type: str
    cellId: str
    output: str

class OutputSaveMessage(BaseModel):
    type: str
    success: bool
    message: str

class OutputLoadMessage(BaseModel):
    type: str
    success: bool
    message: str
    cells: list
    
class OutputGenerateLambdaMessage(BaseModel):
    type: str
    success: bool
    message: str

class LambdaJobDetails(BaseModel):
    request_id: Optional[str] = None
    input_params: Optional[Dict[str, Any]] = None  # More explicit about expected type
    completed: Optional[bool] = False
    result: Optional[Union[List[Dict[str, Any]], Dict[str, Any], None]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    completed_at: Optional[str] = None
    error: Optional[str] = None
    notebook_id: Optional[str] = None
    
class LambdaJobList(BaseModel):
    jobs: list[LambdaJobDetails]

class SupabaseConnectorCredential(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    notebook_id: Optional[str] = None
    connector_type: Optional[str] = None
    credentials: Optional[dict] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class SupabaseConnectorCredentialList(BaseModel):
    credentials: list[SupabaseConnectorCredential]

class OutputPosthogSetupMessage(BaseModel):
    type: str
    success: bool
    message: str

class ScheduledJob(BaseModel):
    id: str
    schedule: str
    last_run: Optional[str] = None
    next_run: Optional[str] = None
    submit_endpoint: Optional[str] = None
    input_params: Optional[str] = None

class ScheduledJobList(BaseModel):
    schedules: list[ScheduledJob]

class NotebookDetails(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    user_id: str
    s3_url: Optional[str] = None
    submit_endpoint: Optional[str] = None
    cells: Optional[list] = None
    session_id: Optional[str] = None
    created_at: Optional[str] = None 
    updated_at: Optional[str] = None
    output: Optional[dict] = None

class NotebookData(BaseModel):
    notebook_details: NotebookDetails
    job_details: LambdaJobList
    schedule_details: ScheduledJobList
    # connector_details: SupabaseConnectorCredentialList

class ConnectorResponse(BaseModel):
    id: str
    status_code: int
    connector_type: str
    credentials: Optional[dict] = None
    code_string: Optional[str] = None
    doc_string: Optional[str] = None
    message: Optional[str] = None
    success: Optional[bool] = None
    
class ConnectorCredentials(BaseModel):
    user_id: str
    org_id: str
    notebook_id: Optional[str] = None
    connector_type: str
    credentials: dict


