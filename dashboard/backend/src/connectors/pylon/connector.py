import logging
from ..base import BaseConnector
from src.backend_types import ConnectorCredentials

logger = logging.getLogger(__name__)

class PylonConnector(BaseConnector):
    def __init__(self, connector_details: ConnectorCredentials):
        print(f"Initializing PylonConnector with credentials: {connector_details}")
        # Extract the nested credentials
        credentials = connector_details.credentials
        
        pylon_credentials = {
            'oauth_token': credentials['oauth_token'],
        }

        super().__init__(connector_details, required_fields=list(pylon_credentials.keys()))

    def get_connector_code(self):
        code = f"""
from cosmic_sdk.secrets import SecretsManager
from cosmic_sdk.connectors import PylonService

secrets_manager = SecretsManager()

credentials = secrets_manager.get_secrets(org_id="org_123", connector_type="pylon")
pylon_service = PylonService(credentials)
pylon_service.update_account(account_id, data)
"""
        return code.lstrip()
    
    def get_connector_docstring(self):
        """
        Return the connector docstring that will be displayed in the notebook cell.
        """
        doc = """
## Pylon Connector
This connector allows you to interact with your Pylon data directly in your notebook.
It can be used to fetch data from Pylon or to try out our own AI recipes.

## Documentation
For more examples and detailed usage, refer to our documentation.
- <a href="https://github.com/deepkalilabs/cosmicnotebook/docs/connectors/pylon" target="_blank">Cosmic SDK Documentation</a>
- <a href="https://github.com/deepkalilabs/cosmicnotebook/docs/connectors/pylon/recipes" target="_blank">Cosmic SDK Recipes</a>
"""
        return doc