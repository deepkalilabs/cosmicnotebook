from secrets.base import SecretsProvider
import boto3
from typing import List
import os
import dotenv
import json
dotenv.load_dotenv()

class AWSSecretsProvider(SecretsProvider):
    def __init__(self, region_name: str):
        self.region_name = region_name
        self.client = boto3.client('secretsmanager', region_name=region_name)
        self.env = os.environ.get('cosmic_secret_env', 'dev')

    def get_secret_value(self, path: str) -> str:
        """
        Get a secret value from AWS Secrets Manager.

        Path format examples:
        - connectors/posthog/client123  (for specific client)
        - connectors/posthog/shared     (shared configuration)
        - integrations/slack/client123  (for specific client)
        - integrations/slack/shared     (shared configuration)
        """
        secret_id = f"{self.env}/{path}"
        try:
            response = self.client.get_secret_value(SecretId=secret_id)
            return json.loads(response['SecretString'])
        except Exception as e:
            raise e

    def put_secret_value(self, path: str, value: str) -> None:
        secret_id = f"{self.env}/{path}"
        try:
            self.client.put_secret_value(SecretId=secret_id, SecretString=json.dumps(value))
        except Exception as e:
            self.client.create_secret(Name=secret_id, SecretString=json.dumps(value))

    def delete_secret_value(self, path: str) -> None:
        secret_id = f"{self.env}/{path}"
        try:
            self.client.delete_secret(SecretId=secret_id)
        except Exception as e:
            raise e

    def list_secrets(self, path: str) -> List[str]:
        pass