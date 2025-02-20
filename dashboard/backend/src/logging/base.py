from abc import ABC, abstractmethod
import boto3
import os
class BaseLogger(ABC):
    def __init__(self, log_group: str, log_stream: str, notebook_id: str):
        self.log_group = log_group  # "/deployments_logs"
        self.log_stream = log_stream  # "/deployments_logs"
        self.notebook_id = notebook_id
        self.logs_client = boto3.client('logs', region_name=os.getenv("AWS_REGION"))

    def log(self, message: str, level: str, metadata: dict, ):
        pass

    def get_logs_from_cloudwatch(self) -> list:
        """
        Fetch all logs from a specific CloudWatch log group and stream.
        Handles pagination automatically.
        """

        log_events = []
        
        # Initial call parameters
        params = {
            'logGroupName': self.log_group,
            'logStreamName': self.log_stream,
            'startFromHead': True  # Start from oldest logs
        }

        print("params:", params)

        try:
            while True:
                # Get batch of logs
                response = self.logs_client.get_log_events(**params)
                
                # Add this batch of events to our list
                log_events.extend(response['events'])
                
                # If we get the same token twice, we've reached the end
                next_token = response['nextForwardToken']
                if params.get('nextToken') == next_token:
                    break
                    
                # Set up next iteration
                params['nextToken'] = next_token
                
            return log_events
            
        except Exception as e:
            print(f"Error fetching logs: {str(e)}")
            return []