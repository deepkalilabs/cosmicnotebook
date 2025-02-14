from typing import Type
from .base import BaseConnector
from .posthog.connector import PosthogConnector
from src.backend_types import ConnectorResponse, ConnectorCredentials
from .pylon.connector import PylonConnector
from .slack.connector import SlackConnector
class ConnectorFactory:
    """
    Factory design pattern for creating connector instances.
    """
    _connectors = {
        "posthog": PosthogConnector,
        "pylon": PylonConnector,
        "slack": SlackConnector,
    }

    @classmethod
    def create(cls, connector_type: str, connector_details: ConnectorCredentials) -> BaseConnector:
        """Create a connector instance"""
        print(f"Creating connector {connector_type} with credentials: {connector_details}")
        connector_class = cls._connectors.get(connector_type)
        if not connector_class:
            raise ValueError(f"Unknown connector type: {connector_type}")
        return connector_class(connector_details)

    @classmethod
    def register(cls, connector_type: str, connector_class: Type[BaseConnector]):
        """Register a new connector type"""
        cls._connectors[connector_type] = connector_class 