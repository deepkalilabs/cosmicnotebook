from .base import BaseLogger

class RuntimeLogger(BaseLogger):
    def __init__(self, log_group: str, log_stream: str, notebook_id: str):
        super().__init__(log_group, log_stream, notebook_id)

    def get_logs_from_cloudwatch(self) -> str:
        logs = super().get_logs_from_cloudwatch()
        log_messages = [log['message'] for log in logs]
        return log_messages