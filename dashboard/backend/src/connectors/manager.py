from .factory import ConnectorFactory
from src.backend_types import ConnectorResponse, ConnectorCredentials
import logging
logging.basicConfig(level=logging.INFO)

class ConnectorManager:
    """
    Manager for connectors.
    Manages the setup of connectors and the execution of setup code in the notebook via a websocket.
    """
    def __init__(self):
        pass

    async def setup_connector(
        self,
        credentials: ConnectorCredentials,
    ) -> ConnectorResponse:
        """Setup a new connector"""
        try:
            print(f"Credentials: {credentials}")
            print(f"Searching for connector {credentials.connector_type}")
            # 1. Create connector instance
            connector = ConnectorFactory.create(
                credentials.connector_type,
                credentials
            )
            print(f"Connector {credentials.connector_type} created")
            print(f"Response from connector factory: {connector}")

            # 2. Setup connector and get cell data
            result = await connector.setup()
            print(f"Result: {result}")
            print(f"Result type: {type(result)}")
            print(f"Result success: {result.get('success', False)}")
            if result.get('success', False):
                return ConnectorResponse(
                    type=credentials.connector_type,
                    success=True,
                    message=result.get('message', 'Connector setup successful'),
                    body=result.get('body', None),
                    code_string=result.get('code_string', None),
                    doc_string=result.get('doc_string', None)
                )
            else:
                return ConnectorResponse(
                    type=credentials.connector_type,
                    success=False,
                    message=result.get('message', 'Unknown error occurred'),
                    body=None,
                    code_string=None,
                    doc_string=None
                )          

        except Exception as e:
            print(f"Error setting up connector {credentials.connector_type}: {e}")
            return ConnectorResponse(
                type=credentials.connector_type,
                success=False,
                message=str(e),
                body=None,
                code_string=None,
                doc_string=None
            )
