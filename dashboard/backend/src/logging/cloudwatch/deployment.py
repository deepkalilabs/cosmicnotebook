from ..base import BaseLogger
import boto3
from datetime import datetime
import json
import logging
from helpers.backend.supabase.logs import SupabaseLogs


logging.basicConfig(level=logging.INFO)

"""
This logger is used to log the deployment of a notebook.

Current: Overwrites the log stream for each deployment.
TODO: 
- Have a version number for each deployment.
- Have a log group for each org.
- Have a log stream for each notebook.
- Have a log stream for each deployment.
"""
class DeploymentLogger(BaseLogger):
    def __init__(self, lambda_fn_name: str, region: str, org_id: str, notebook_id: str, user_id: str, type: str):
        self.client = boto3.client('logs', region_name=region)
        self.org_id = org_id
        self.notebook_id = notebook_id
        self.user_id = user_id

        #Set the log group and stream
        self.log_group = lambda_fn_name
        self.log_stream = f"{notebook_id}-{type}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        self.sequence_token = None

        logging.info(f"Creating log stream: {self.log_stream}")
        self.supabase_logs = SupabaseLogs()
        self._create_log_group()
        self._create_log_stream()

    def _create_log_group(self):
        try:
            self.client.create_log_group(
                logGroupName=self.log_group
            )
            self.supabase_logs.create_deployment_log(
                type='deployment',
                log_group=self.log_group,
                log_stream=self.log_stream,
                error=None,
                status='success',
                file_path=None,
                notebook_id=self.notebook_id,
            )


            logging.info(f"Created log group: {self.log_group}")
        except self.client.exceptions.ResourceAlreadyExistsException:
            logging.info(f"Log group already exists: {self.log_group}")
            self.supabase_logs.create_deployment_log(
                type='deployment',
                log_group=self.log_group,
                log_stream=self.log_stream,
                error="Log group already exists",
                status='success',
                file_path=None,
                notebook_id=self.notebook_id,
            )
        except Exception as e:
            self.supabase_logs.create_deployment_log(
                type='deployment',
                log_group=self.log_group,
                log_stream=self.log_stream,
                error=f"Error creating log group: {e}",
                status='error',
                file_path=None,
                notebook_id=self.notebook_id,
            )
            logging.error(f"Error creating log group: {e}")

    def _create_log_stream(self):
        try:
            # First, try to create the log group if it doesn't exist
            try:
                self.client.create_log_group(logGroupName=self.log_group)
                logging.info(f"Created log group: {self.log_group}")
            except self.client.exceptions.ResourceAlreadyExistsException:
                logging.info(f"Log group already exists: {self.log_group}")

            # Now create the log stream
            response = self.client.create_log_stream(
                logGroupName=self.log_group,
                logStreamName=self.log_stream
            )
            logging.info(f"Created log stream: {self.log_stream}")
            return response
        except self.client.exceptions.ResourceAlreadyExistsException:
            logging.info(f"Log stream already exists: {self.log_stream}")
            return self.client.describe_log_streams(
                logGroupName=self.log_group,
                logStreamNamePrefix=self.log_stream,
                limit=1
            )
        except Exception as e:
            logging.error(f"Error creating log stream: {e}")
            return None

    def log(self, message: str, level: str, metadata: dict):
        # Format the message to include level and metadata
        formatted_message = f"[{level}] {message} | metadata: {json.dumps(metadata)}"
        
        params = {
            "logGroupName": self.log_group,
            "logStreamName": self.log_stream,
            "logEvents": [
                {
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "message": formatted_message
                }
            ]
        }

        if self.sequence_token:
            params["sequenceToken"] = self.sequence_token

        try:
            response = self.client.put_log_events(**params)
            self.sequence_token = response["nextSequenceToken"]
        except Exception as e:
            print(f"Error putting log events: {e}")



