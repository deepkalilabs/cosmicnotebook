from abc import ABC, abstractmethod
from typing import Dict, Any
from backend_types import ConnectorResponse

class BaseConnector(ABC):
    def __init__(self, credentials: dict):
        self.credentials = credentials
        self.connector_type = None
        self.sync_status = {
            "status": "not_started",
            "message": "Sync not initiated",
            "progress": 0
        }

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
    async def trigger_initial_sync(self) -> Dict[str, Any]:
        """
        Trigger initial data sync to S3/R2
        Returns sync job details
        """
        pass

    @abstractmethod
    async def get_sync_status(self) -> Dict[str, Any]:
        """Get current sync status"""
        return self.sync_status

    def update_sync_status(self, status: str, message: str, progress: int = 0):
        """Update sync status"""
        self.sync_status = {
            "status": status,
            "message": message, 
            "progress": progress
        }

    def get_sync_status_message(self) -> str:
        """Return the connector sync status message"""
        return self.sync_status["message"]