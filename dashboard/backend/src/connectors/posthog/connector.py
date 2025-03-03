import logging
from ..base import BaseConnector
from src.backend_types import ConnectorCredentials

logger = logging.getLogger(__name__)

class PosthogConnector(BaseConnector):
    def __init__(self, connector_details: ConnectorCredentials):
        print(f"Initializing PosthogConnector with credentials: {connector_details}")
        # Extract the nested credentials
        credentials = connector_details.credentials
        posthog_credentials = {
            'apiKey': credentials['apiKey'],
            'baseUrl': credentials['baseUrl'],
            'projectId': credentials['projectId']
        }

        super().__init__(connector_details, required_fields=list(posthog_credentials.keys()))


    def get_connector_code(self):
        code = f"""
from cosmic_sdk.secrets import SecretsManager
from cosmic_sdk.connectors import PostHogService

secrets_manager = SecretsManager()

credentials = secrets_manager.get_secrets(org_id="org_123", connector_type="posthog")
posthog_service = PostHogService(credentials)
posthog_service.get_user_logins("2024-01-01")
"""
        return code.lstrip()

    def get_connector_docstring(self):
        """
        Return the connector docstring that will be displayed in the notebook cell.
        """
        doc = """
## PostHog Connector
This connector allows you to interact with your PostHog data directly in your notebook.
It can be used to fetch raw data from PostHog or to try out our own AI recipes.
It can only support fetching events less than or equal to 10,000 events at a time.
To fetch more than 10,000 events, please ask for the batch export feature.

## Documentation
For more examples and detailed usage, refer to our documentation.
- <a href="https://github.com/deepkalilabs/cosmicnotebook/docs/connectors/posthog" target="_blank">Cosmic SDK Documentation</a>
- <a href="https://github.com/deepkalilabs/cosmicnotebook/docs/connectors/posthog/recipes" target="_blank">Cosmic SDK Recipes</a>


### WIP: Batch Exports
The connector automatically sets up a daily batch export of your PostHog events to our own data warehouse.
If you want this service now, please contact us at charlesjavelona@gmail.com.
        """
        return doc

    # async def _prepare_batch_export(self, project_id: str) -> Dict[str, Any]:
    #     """
    #     Prepare a batch export in Posthog

    #     #TODO Double check if prefix needs to be filled before triggering batch export
    #     """
    #     started_at = datetime.now(datetime.UTC).isoformat()
    #     prefix = f"exports/{self.org_id}/{self.connector_type}/{self.project_id}/{started_at.year}-{started_at.month}-{started_at.day}/events.jsonl"
    #     return {
    #         "name": f"{self.connector_type}-{self.org_id}-{self.project_id}-export",
    #         "model": "events",
    #         "interval": "daily",
    #         "started_at": started_at,
    #         "destination": {
    #             "type": "s3",
    #             "config": {
    #                 "bucket": self.s3_config['bucket'],
    #                 "region": self.s3_config['region'],
    #                 "prefix": prefix,
    #                 "compression": "gzip",
    #                 "encryption": "AES256",
    #                 "format": "jsonl",
    #                 "aws_access_key_id": self.s3_config['access_key'],
    #                 "aws_secret_access_key": self.s3_config['secret_key']
    #             }
    #         }
    #     }
    
    # async def _batch_export_request(self, export_config: Dict[str, Any]) -> Dict[str, Any]:
    #     """
    #     Request a batch export from PostHog
    #     """
    #     try:
    #         response = requests.post(
    #             f"{self.credentials['base_url']}/api/batch-exports",
    #             headers={"Authorization": f"Bearer {self.credentials['api_key']}"},
    #             json=export_config
    #         )
    #         response.raise_for_status() # Raise an exception if the request failed
    #         return response.json()
    #     except Exception as e:
    #         logger.error(f"Error creating batch export: {e}")
    #         return None
        
    # async def record_sync_schedule(self, connector_id: str, export_response: Dict[str, Any], export_config: Dict[str, Any]) -> Dict[str, Any]:
    #     """
    #     Record the sync schedule in the database
    #     """
    #     metadata = {
    #         'export_id': export_response['id'],
    #         'name': export_response['name'],
    #         'model': export_response['model'],
    #         'interval': export_response['interval'],
    #         'paused': export_response['paused'],
    #         'latest_runs': export_response['latest_runs'],
    #         'created_at': export_response['created_at'],
    #         'last_updated_at': export_response['last_updated_at']
    #     }

    #     config = {
    #         'destination': export_config['destination'],
    #     }

    #     try:
    #         response = await insert_connector_sync_run(
    #             connector_id=connector_id,
    #             status="pending",
    #             started_at=export_response['started_at'],
    #             completed_at=None,
    #             store_url_path=export_config['destination']['config']['prefix'],
    #             metadata=metadata,
    #             config=config,
    #             raw_response=export_response
    #         )

    #         if response is None:
    #             return {
    #                 'success': False,
    #                 'message': 'Failed to record sync schedule in database',
    #                 'body': response
    #             }
            
    #         return {
    #             'success': True,
    #             'message': 'Sync schedule recorded in database',
    #             'body': response
    #         }
            
    #     except Exception as e:
    #         logger.error(f"Error recording sync schedule: {e}")
    #         return {
    #             'success': False,
    #             'message': f"Failed to record sync schedule in database: {str(e)}",
    #             'body': None
    #         }

    # async def trigger_backfill_request(self, export_id: str) -> Dict[str, Any]:
    #     """
    #     Trigger a backfill after the batch export is created.
    #     Backfill is 3 months of history, running weekly on Saturday at 12:01 AM UTC.
    #     This is to ensure that the data is up to date before the user can query it.
    #     NOTE: Posthog will handle the backfill, so we don't need to do anything else aside from triggering and recording the sync run.
    #     """
    #     now = datetime.now(datetime.UTC)
    #     three_months_ago = (now - timedelta(days=90))

    #     #Set time to 12:01 AM UTC
    #     start_date = three_months_ago.replace(hour=0, minute=1, second=0, microsecond=0)
    #     end_date = now.replace(hour=0, minute=1, second=0, microsecond=0)

    #     try:
    #         response = requests.post(
    #             f"{self.credentials['base_url']}/api/batch-exports/{export_id}/backfill",
    #             headers={"Authorization": f"Bearer {self.credentials['api_key']}"},
    #             json={
    #                 "start_date": start_date.isoformat(),
    #                 "end_date": end_date.isoformat()
    #             }
    #         )
    #         response.raise_for_status()
    #         return response.json()
    #     except Exception as e:
    #         logger.error(f"Error triggering backfill: {e}")
    #         return None
    
    # async def create_batch_export(self, project_id: str) -> Dict[str, Any]:
    #     """
    #     Create a batch export in PostHog to export events to S3
    #     """
    #     try:
    #         export_config = await self._prepare_batch_export(project_id)
    #         export_response = await self._batch_export_request(export_config)
            
    #         print("Export response: ", export_response)
    #         # Insert sync run into database
    #         response = await self.record_sync_schedule(self.connector_id, export_response, export_config)
    #         if not response['success']:
    #             return response
           
    #         # Trigger backfill

    #     except Exception as e:
    #         logger.error(f"Error creating batch export: {e}")
    #         return None
    
