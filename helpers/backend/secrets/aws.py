from helpers.backend.secrets.base import SecretsProvider
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
        try:
            print('Getting secret value', path)
            response = self.client.get_secret_value(SecretId=path)
            return json.loads(response['SecretString'])
        except Exception as e:
            raise e

    def put_secret_value(self, path: str, value: str) -> None:
        print('Putting secret value', path, value)
        secret_id = f"{self.env}/{path}"
        try:
            return self.client.put_secret_value(SecretId=secret_id, SecretString=json.dumps(value))
        except Exception as e:
            return self.client.create_secret(Name=secret_id, SecretString=json.dumps(value))

    def delete_secret_value(self, path: str) -> None:
        secret_id = f"{self.env}/{path}"
        try:
            self.client.delete_secret(SecretId=secret_id)
        except Exception as e:
            raise e

    def list_secrets(self, path: str) -> List[str]:
        pass