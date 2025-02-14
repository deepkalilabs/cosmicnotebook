import logging
from ..base import BaseConnector
from src.backend_types import ConnectorCredentials

logger = logging.getLogger(__name__)

class SlackConnector(BaseConnector):
    def __init__(self, connector_details: ConnectorCredentials):
        print(f"Initializing SlackConnector with credentials: {connector_details}")
        # Extract the nested credentials
        credentials = connector_details.credentials
        
        slack_credentials = {
            'slack_bot_token': credentials['slack_bot_token'],
        }

        super().__init__(connector_details, required_fields=list(slack_credentials.keys()))

    def get_connector_code(self):
        code = f"""
from cosmic_sdk.secrets import SecretsManager
from cosmic_sdk.connectors import SlackService

secrets_manager = SecretsManager()

credentials = secrets_manager.get_secrets(org_id="org_123", connector_type="slack")
slack_service = SlackService(credentials_slack, channel_id)
slack_service.set_channel_id(channel_id)
slack_service.send_message(message)
"""
        return code.lstrip()
    
    def get_connector_docstring(self):
        """
        Return the connector docstring that will be displayed in the notebook cell.
        """
        doc = """
## Slack Connector
This connector allows you to interact with your Slack data directly in your notebook.
It can be used to send messages to Slack or to try out our own AI recipes.

## Documentation
For more examples and detailed usage, refer to our documentation.
- <a href="https://github.com/deepkalilabs/cosmicnotebook/docs/connectors/slack" target="_blank">Cosmic SDK Documentation</a>
- <a href="https://github.com/deepkalilabs/cosmicnotebook/docs/connectors/slack/recipes" target="_blank">Cosmic SDK Recipes</a>
"""
        return doc