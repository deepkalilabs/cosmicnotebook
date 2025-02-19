from abc import ABC, abstractmethod

class BaseLogger(ABC):
    def __init__(self, log_group: str, notebook_id: str):
        self.log_group = log_group  # "/deployments_logs"
        self.notebook_id = notebook_id

    @abstractmethod
    def log(self, message: str, level: str, metadata: dict, ):
        pass
