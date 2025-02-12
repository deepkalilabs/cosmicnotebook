import os
from datetime import datetime, timedelta
import logging
import requests
from typing import Dict, Any, List
from ..base import BaseConnector
from src.backend_types import ConnectorResponse
from helpers.backend.supabase.connector_credentials import create_connector_credentials
from helpers.backend.secrets import secrets_manager

logger = logging.getLogger(__name__)

class SlackConnector(BaseConnector):
    def __init__(self, credentials: dict):
        logger.info(f"Initializing SlackConnector with credentials: {credentials}")
        # Extract the nested credentials
        self.user_id = credentials.user_id
        self.org_id = credentials.org_id
        self.notebook_id = credentials.notebook_id
        self.connector_id = None # Get after inserting into database
        self.connector_type = credentials.connector_type
        self.credentials = {
            'slack_bot_token': credentials.credentials['slackBotToken'],
            #'channel_id': credentials.credentials['channelId']
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
            print(f"Setting up SlackConnector with credentials: {self.credentials}")
            
            if not isinstance(self.credentials, dict):
                return {
                    'success': False,
                    'message': f"Invalid credentials format. Expected dict, got {type(self.credentials)}",
                    'code_string': None,
                    'doc_string': None,
                    'body': None,
                    'type': self.connector_type
                }
            
            if 'slack_bot_token' not in self.credentials:
                logger.error(f"Missing slack_bot_token in credentials. Available keys: {self.credentials.keys()}")
                return {
                    'success': False,
                    'message': "Missing required credential: 'slack_bot_token'. Available keys: " + 
                              ", ".join(self.credentials.keys()),
                    'code_string': None,
                    'doc_string': None,
                    'body': None,
                    'type': self.connector_type
                }
         
            print('Submitting connector credentials in setup:')
            # Submit connector credentials to database
            response = await create_connector_credentials(
                user_id=self.user_id,
                org_id=self.org_id,
                connector_type=self.connector_type,
                credentials=self.credentials,
                doc_string=self.get_connector_docstring(),
                code_string=self.get_connector_code()
            )
            if response['status_code'] == 200 and response['body']:
                data = response['body'][0]

                # Get secret path and switch it in credentials
                secret_path = data['credentials']['secret_path']
                #print('secret_path in response', secret_path)
                print('Converting secret path to credentials before returning response')
                data['credentials'] = secrets_manager.get_secret_value(secret_path)
                #Extract org id from secret path and add it to credentials
                return {
                    'success': True,
                    'message': 'Slack connector submitted to database',
                    'code_string': data['code_string'],
                    'doc_string': data['doc_string'],
                    'body': data,  
                    'type': self.connector_type
                }
            else:
                return {
                    'success': False,
                    'code_string': None,
                    'doc_string': None,
                    'message': 'Failed to submit Slack connector to database',
                    'body': response,
                    'type': self.connector_type
                }

        except Exception as e:
            logger.error(f"Error in setup: {e}")
            return {
                'success': False,
                'message': f"Failed to setup Slack connector: {str(e)}",
                'code_string': None,
                'doc_string': None,
                'body': None,
                'type': self.connector_type
            }

    
    def get_connector_code(self):
        code = f"""
from cosmic_sdk.secrets import SecretsManager
from cosmic_sdk.connectors import SlackService

secrets_manager = SecretsManager()

credentials = secrets_manager.get_secrets(org_id="org_123", connector_type="slack")
slack_service = SlackService(credentials)
slack_service.send_message("Hello, world!")
"""
        return code.lstrip()

    def get_connector_docstring(self):
        """
        Return the connector docstring that will be displayed in the notebook cell.
        """
        doc = """
## Slack Connector
This connector allows you to interact with your Slack data directly in your notebook.
It can be used to send messages to a Slack channel or to read messages from a Slack channel.

## Documentation
For more examples and detailed usage, refer to our documentation.
- <a href="https://github.com/deepkalilabs/cosmicnotebook/tree/main/docs/connectors/slack" target="_blank">Cosmic SDK Documentation</a>
- <a href="https://github.com/deepkalilabs/cosmicnotebook/tree/main/docs/connectors/slack/recipes" target="_blank">Cosmic SDK Recipes</a>
        """
        return doc