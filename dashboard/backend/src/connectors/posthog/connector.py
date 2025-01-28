import os
from datetime import datetime, timedelta
import logging
import requests
from typing import Dict, Any, List
from ..base import BaseConnector
from helpers.types import ConnectorResponse
from helpers.supabase.connector_credentials import create_connector_credentials
from helpers.supabase.connector_sync_runs import insert_connector_sync_run


logger = logging.getLogger(__name__)

class PosthogConnector(BaseConnector):
    def __init__(self, credentials: dict):
        logger.info(f"Initializing PosthogConnector with credentials: {credentials}")
        # Extract the nested credentials
        self.user_id = credentials.get('user_id')
        self.org_id = credentials.get('org_id')
        self.notebook_id = credentials.get('notebook_id')
        self.connector_id = None # Get after inserting into database
        self.connector_type = 'posthog'
        self.credentials = {
            'api_key': credentials.get('credentials.apiKey'),
            'base_url': credentials.get('credentials.baseUrl'),
            'project_id': credentials.get('credentials.projectId')
        }
        self.s3_config = {
            'bucket': os.getenv('AWS_BUCKET_NAME'),
            'region': os.getenv('AWS_REGION'),
            'access_key': os.getenv('AWS_ACCESS_KEY_ID'),
            'secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
            #'prefix': f"exports/{self.org_id}/{self.connector_type}/{self.project_id}/{datetime.now().strftime('%Y-%m-%d')}"
        }
      
    async def setup(self) -> ConnectorResponse:
        try:
            logger.info(f"Setting up PosthogConnector with credentials: {self.credentials}")
            
            if not isinstance(self.credentials, dict):
                return {
                    'success': False,
                    'message': f"Invalid credentials format. Expected dict, got {type(self.credentials)}",
                    'code': None,
                    'docstring': None
                }
            
            if 'api_key' not in self.credentials:
                logger.error(f"Missing api_key in credentials. Available keys: {self.credentials.keys()}")
                return {
                    'success': False,
                    'message': "Missing required credential: 'api_key'. Available keys: " + 
                              ", ".join(self.credentials.keys()),
                    'code': None,
                    'docstring': None
                }
            
            # Submit connector credentials to database
            response = await create_connector_credentials(
                user_id=self.user_id,
                notebook_id=self.notebook_id,
                org_id=self.org_id,
                connector_type=self.connector_type,
                credentials=self.credentials
            )
            logger.info(f"Connector credentials response: {response}")


            if response['statusCode'] != 200:
                return {
                    'success': False,
                    'message': response['message'],
                    'code': None,
                    'docstring': None
                }
            
            # Get connector id from database
            self.connector_id = response['data']['id']
            return {
                'success': True,
                'message': 'Posthog submitted to database',
                'code': self.get_connector_code(),
                'docstring': self.get_connector_docstring()
            }

        except Exception as e:
            logger.error(f"Error in setup: {e}")
            return {
                'success': False,
                'message': f"Failed to setup PostHog connector: {str(e)}",
                'code': None,
                'docstring': None
            }

    async def _prepare_batch_export(self, project_id: str) -> Dict[str, Any]:
        """
        Prepare a batch export in Posthog

        #TODO Double check if prefix needs to be filled before triggering batch export
        """
        started_at = datetime.now(datetime.UTC).isoformat()
        prefix = f"exports/{self.org_id}/{self.connector_type}/{self.project_id}/{started_at.year}-{started_at.month}-{started_at.day}/events.jsonl"
        return {
            "name": f"{self.connector_type}-{self.org_id}-{self.project_id}-export",
            "model": "events",
            "interval": "daily",
            "started_at": started_at,
            "destination": {
                "type": "s3",
                "config": {
                    "bucket": self.s3_config['bucket'],
                    "region": self.s3_config['region'],
                    "prefix": prefix,
                    "compression": "gzip",
                    "encryption": "AES256",
                    "format": "jsonl",
                    "aws_access_key_id": self.s3_config['access_key'],
                    "aws_secret_access_key": self.s3_config['secret_key']
                }
            }
        }
    
    async def _batch_export_request(self, export_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Request a batch export from PostHog
        """
        try:
            response = requests.post(
                f"{self.credentials['base_url']}/api/batch-exports",
                headers={"Authorization": f"Bearer {self.credentials['api_key']}"},
                json=export_config
            )
            response.raise_for_status() # Raise an exception if the request failed
            return response.json()
        except Exception as e:
            logger.error(f"Error creating batch export: {e}")
            return None
        
    async def record_sync_schedule(self, connector_id: str, export_response: Dict[str, Any], export_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Record the sync schedule in the database
        """
        metadata = {
            'export_id': export_response['id'],
            'name': export_response['name'],
            'model': export_response['model'],
            'interval': export_response['interval'],
            'paused': export_response['paused'],
            'latest_runs': export_response['latest_runs'],
            'created_at': export_response['created_at'],
            'last_updated_at': export_response['last_updated_at']
        }

        config = {
            'destination': export_config['destination'],
        }

        try:
            response = await insert_connector_sync_run(
                connector_id=connector_id,
                status="pending",
                started_at=export_response['started_at'],
                completed_at=None,
                store_url_path=export_config['destination']['config']['prefix'],
                metadata=metadata,
                config=config,
                raw_response=export_response
            )

            if response is None:
                return {
                    'success': False,
                    'message': 'Failed to record sync schedule in database',
                    'body': response
                }
            
            return {
                'success': True,
                'message': 'Sync schedule recorded in database',
                'body': response
            }
            
        except Exception as e:
            logger.error(f"Error recording sync schedule: {e}")
            return {
                'success': False,
                'message': f"Failed to record sync schedule in database: {str(e)}",
                'body': None
            }

    async def trigger_backfill_request(self, export_id: str) -> Dict[str, Any]:
        """
        Trigger a backfill after the batch export is created.
        Backfill is 3 months of history, running weekly on Saturday at 12:01 AM UTC.
        This is to ensure that the data is up to date before the user can query it.
        NOTE: Posthog will handle the backfill, so we don't need to do anything else aside from triggering and recording the sync run.
        """
        now = datetime.now(datetime.UTC)
        three_months_ago = (now - timedelta(days=90))

        #Set time to 12:01 AM UTC
        start_date = three_months_ago.replace(hour=0, minute=1, second=0, microsecond=0)
        end_date = now.replace(hour=0, minute=1, second=0, microsecond=0)

        try:
            response = requests.post(
                f"{self.credentials['base_url']}/api/batch-exports/{export_id}/backfill",
                headers={"Authorization": f"Bearer {self.credentials['api_key']}"},
                json={
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat()
                }
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error triggering backfill: {e}")
            return None
    
    async def create_batch_export(self, project_id: str) -> Dict[str, Any]:
        """
        Create a batch export in PostHog to export events to S3
        """
        try:
            export_config = await self._prepare_batch_export(project_id)
            export_response = await self._batch_export_request(export_config)
            
            print("Export response: ", export_response)
            # Insert sync run into database
            response = await self.record_sync_schedule(self.connector_id, export_response, export_config)
            if not response['success']:
                return response
           
            # Trigger backfill

        except Exception as e:
            logger.error(f"Error creating batch export: {e}")
            return None
    
 