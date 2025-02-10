from abc import ABC, abstractmethod
from typing import List

class SecretsProvider(ABC):
    @abstractmethod
    def get_secret_value(self, path: str) -> str:
        pass

    @abstractmethod
    def put_secret_value(self, path: str, value: str) -> None:
        pass

    @abstractmethod
    def delete_secret_value(self, path: str) -> None:
        pass

    @abstractmethod
    def list_secrets(self, path: str) -> List[str]:
        pass