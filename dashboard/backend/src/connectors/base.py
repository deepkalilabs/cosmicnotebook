from abc import ABC, abstractmethod
from typing import Dict, Any
from backend_types import ConnectorResponse

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

 