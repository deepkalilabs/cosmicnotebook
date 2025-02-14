import logging
from ..base import BaseConnector
from src.backend_types import ConnectorCredentials

logger = logging.getLogger(__name__)

class OpenAIConnector(BaseConnector):
    def __init__(self, connector_details: ConnectorCredentials):
        print(f"Initializing OpenAIConnector with credentials: {connector_details}")
        # Extract the nested credentials
        credentials = connector_details.credentials
        
        openai_credentials = {
            'api_key': credentials['api_key'],
        }

        super().__init__(connector_details, required_fields=list(openai_credentials.keys()))

    def get_connector_code(self):
        code = f"""
from cosmic_sdk.secrets import SecretsManager
from cosmic_sdk.connectors import OpenAIService
from openai import OpenAI

secrets_manager = SecretsManager()

openai_credentials = secrets_manager.get_secrets(org_id="org_123", connector_type="openai")
api_key = openai_credentials['api_key']

client = OpenAI(api_key = api_key)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        .....
    ]
)
return response.choices[0].message.content"""
        return code.lstrip()
    
    def get_connector_docstring(self):
        """
        Return the connector docstring that will be displayed in the notebook cell.
        """
        doc = """
## OpenAI Connector
This connector allows you to interact with OpenAI's APIs directly in your notebook.
It can be used to access GPT models, embeddings, and other OpenAI services.

## Documentation
For more examples and detailed usage, refer to our documentation.
- <a href="https://github.com/deepkalilabs/cosmicnotebook/docs/connectors/openai" target="_blank">Cosmic SDK Documentation</a>
- <a href="https://github.com/deepkalilabs/cosmicnotebook/docs/connectors/openai/recipes" target="_blank">Cosmic SDK Recipes</a>
"""
        return doc