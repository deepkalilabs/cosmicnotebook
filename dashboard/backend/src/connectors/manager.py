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

            # 2. Setup connector and get cell data
            result = await connector.setup()
            if not result['success']:
                return ConnectorResponse(
                    type='connector_created',
                    success=False,
                    message=result['message'],
                    body=None,
                    code_string=None,
                    doc_string=None
                )           

            # 3. Return response
            return ConnectorResponse(
                type='connector_created',
                success=True,
                message='Ready to use posthog connector',
                body=result['body'],
                code_string=result['code_string'],
                doc_string=result['doc_string']
            )

        except Exception as e:
            print(f"Error setting up connector {credentials.connector_type}: {e}")
            return ConnectorResponse(
                type='connector_created',
                success=False,
                message=str(e),
                body=None,
                code_string=None,
                doc_string=None
            )
