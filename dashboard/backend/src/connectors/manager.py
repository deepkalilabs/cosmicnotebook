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
        connector_details: ConnectorCredentials
    ) -> ConnectorResponse:
        """Setup a new connector"""
        try:

            # 1. Create connector instance
            connector = ConnectorFactory.create(
                connector_details.connector_type,
                connector_details
            )


            # 2. Setup connector and get cell data
            result = await connector.setup()
            print(f"Result: {result}")
            if result['success']:
                return ConnectorResponse(
                    id=result['id'],
                    status_code=200,
                    connector_type=connector_details.connector_type,
                    success=True,
                    message=result.get('message', 'Connector setup successful'),
                    code_string=result.get('code_string', None),
                    doc_string=result.get('doc_string', None),
                    credentials=result.get('credentials', None)
                )
            
            else:
                return ConnectorResponse(
                    status_code=500,
                    connector_type=connector_details.connector_type,
                    success=False,
                    message=result.get('message', 'Unknown error occurred'),
                    body=None,
                    code_string=None,
                    doc_string=None
                )          

        except Exception as e:
            print(f"Error setting up connector {connector_details.connector_type}: {e}")
            return ConnectorResponse(
                status_code=500,
                connector_type=connector_details.connector_type,
                success=False,
                message="Error setting up connector: " + str(e),
                body=None,
                code_string=None,
                doc_string=None
            )
