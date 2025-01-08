from ..base import BaseConnector
from helpers.types import ConnectorResponse
from helpers.supabase.connector_credentials import create_connector_credentials
import logging

logger = logging.getLogger(__name__)

class PosthogConnector(BaseConnector):
    def __init__(self, credentials: dict):
        logger.info(f"Initializing PosthogConnector with credentials: {credentials}")
        # Extract the nested credentials
        self.user_id = credentials.get('user_id')
        self.notebook_id = credentials.get('notebook_id')
        self.connector_type = 'posthog'
        self.credentials = credentials.get('credentials')
         
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

    def get_connector_code(self):
        code = f"""
from cosmic.connectors import PostHogService

# Initialize PostHog service
posthog_service = PostHogService({self.credentials})

print("PostHog connector initialized successfully! ✅")

"""
        return code.lstrip()

    def get_connector_docstring(self):
        """
        Return the connector docstring that will be displayed in the notebook cell.
        """
        doc = """
        # Posthog notebook connector

        1. To fetch raw data from PostHog, use the library `posthog_service.client`. Link: https://github.com/deepkalilabs/cosmic-sdk/blob/main/src/cosmic/connectors/posthog/client.py
        2. To try own our own AI recipes, use `posthog_service`. Link: TBD

        # Try out the following examples:
        ## Get all organizations:
        Description: Fetch all organizations from PostHog.
        ```python
        posthog_service.client.get_organizations()
        posthog_service.client.get_events(project_id)
        ```
        """
        return doc
