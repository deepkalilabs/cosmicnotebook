import logging
from ..base import BaseConnector
from src.backend_types import ConnectorCredentials

logger = logging.getLogger(__name__)

class ClaudeConnector(BaseConnector):
    def __init__(self, connector_details: ConnectorCredentials):
        print(f"Initializing ClaudeConnector with credentials: {connector_details}")
        # Extract the nested credentials
        credentials = connector_details.credentials
        
        claude_credentials = {
            'api_key': credentials['api_key'],
        }

        super().__init__(connector_details, required_fields=list(claude_credentials.keys()))

    def get_connector_code(self):
        code = f"""
from cosmic_sdk.secrets import SecretsManager
from cosmic_sdk.connectors import ClaudeService
from anthropic import Anthropic

secrets_manager = SecretsManager()

claude_credentials = secrets_manager.get_secrets(org_id="org_123", connector_type="claude")
api_key = claude_credentials['api_key']

client = Anthropic(api_key=api_key)

response = client.messages.create(
    model="claude-3-opus-20240229",
    messages=[
        .....
    ]
)
return response.content[0].text"""
        return code.lstrip()
    
    def get_connector_docstring(self):
        """
        Return the connector docstring that will be displayed in the notebook cell.
        """
        doc = """
## Claude Connector
This connector allows you to interact with Anthropic's Claude APIs directly in your notebook.
It can be used to access Claude models for text generation, analysis, and other AI services.

## Documentation
For more examples and detailed usage, refer to our documentation.
- <a href="https://github.com/deepkalilabs/cosmicnotebook/docs/connectors/claude" target="_blank">Cosmic SDK Documentation</a>
- <a href="https://github.com/deepkalilabs/cosmicnotebook/docs/connectors/claude/recipes" target="_blank">Cosmic SDK Recipes</a>
"""
        return doc