from typing import Optional
from .factory import ConnectorFactory
from backend_types import ConnectorResponse, ConnectorCredentials
import logging

logging.basicConfig(level=logging.INFO)

class ConnectorManager:
    """
    Manager for connectors.
    Setup, trigger sync, and get data.
    """
    def __init__(self):
        pass

    async def setup_connector(
        self,
        credentials: ConnectorCredentials,
    ) -> ConnectorResponse:
        """Setup a new connector"""
        try:
            print(f"Searching for connector {credentials['connector_type']}")
            # 1. Create and return connector instance
            connector = ConnectorFactory.create(
                credentials['connector_type'],
                credentials
            )
            print(f"Connector {credentials['connector_type']} created")

            # 2. Insert connector into database
            result = await connector.setup()
            if not result['success']:


            # 3. Trigger initial sync and insert sync status into database and S3/R2
            

            # 4. Trigger future syncs



   
