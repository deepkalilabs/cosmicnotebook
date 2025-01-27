from abc import ABC, abstractmethod
from typing import Dict, Any
from ..types import ConnectorResponse

class BaseConnector(ABC):
    def __init__(self, credentials: dict):
        self.credentials = credentials
        self.connector_type = None

    @abstractmethod
    async def setup(self) -> ConnectorResponse:
        """Setup the connector and return the cell data"""
        pass

    @abstractmethod
    def get_connector_code(self) -> str:
        """Return the connector code"""
        pass


    @abstractmethod
    def get_connector_docstring(self) -> str:
        """Return the connector docstring"""
        pass

    @abstractmethod
    def trigger_initial_sync(self) -> str:
        """
        Trigger the initial copy and sync of the connector to AWS S3

        TODO: Cost considerations please use Cloudflare R2 instead of AWS S3
        """
        pass

    @abstractmethod
    def get_sync_status(self) -> dict:
        """Return the connector sync status"""
        pass

    @abstractmethod
    def get_sync_status_message(self) -> str:
        """Return the connector sync status message"""
        pass