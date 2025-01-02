from typing import Optional
from fastapi import WebSocket
from .factory import ConnectorFactory
from ..types import ConnectorResponse, ConnectorCredentials

class ConnectorManager:
    """
    Manager for connectors.
    Manages the setup of connectors and the execution of setup code in the notebook via a websocket.
    """
    def __init__(self, websocket: Optional[WebSocket] = None):
        self.websocket = websocket
        self._closed = False

    async def send_status(self, success: bool, message: str):
        """Send status update to frontend"""
        if self.websocket and not self._closed:
            try:
                await self.websocket.send_json({
                    'type': 'connector_status',
                    'success': success,
                    'message': message,
                    'cell': None
                })
            except RuntimeError:
                self._closed = True

    async def setup_connector(
        self,
        credentials: ConnectorCredentials,
        code_executor
    ) -> ConnectorResponse:
        """Setup a new connector"""
        try:
            print(f"Searching for connector {credentials['connector_type']}")
            # 1. Create connector instance
            connector = ConnectorFactory.create(
                credentials['connector_type'],
                credentials
            )
            print(f"Connector {credentials['connector_type']} created")

            # 2. Setup connector and get cell data
            result = await connector.setup()
            if not result['success']:
                await self.send_status(False, result['message'])
                return result
            print(f"Connector {credentials['connector_type']} setup successful")

            # 3. Execute setup code in notebook
            if result['cell']:
                try:
                    await code_executor(result['cell']['source'])
                    await self.send_status(True, 'Connector initialized successfully')
                except Exception as exec_error:
                    error_msg = f"Error executing setup code: {str(exec_error)}"
                    await self.send_status(False, error_msg)
                    return {
                        'success': False,
                        'message': error_msg,
                        'cell': None
                    }

            return result

        except Exception as e:
            error_response = {
                'success': False,
                'message': str(e),
                'cell': None
            }
            try:
                await self.send_status(False, str(e))
            except:
                pass  # If we can't send the status, just continue
            return error_response 