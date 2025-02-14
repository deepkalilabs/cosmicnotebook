from abc import ABC, abstractmethod
from typing import Dict, Any
from src.backend_types import ConnectorResponse
import os 
import logging
from helpers.backend.supabase.connector_credentials import create_connector_credentials
from helpers.backend.secrets import secrets_manager
from src.backend_types import ConnectorCredentials

logger = logging.getLogger(__name__)

class BaseConnector(ABC):
    def __init__(self, connector_details: ConnectorCredentials, required_fields: list):
        print(f"Initializing BaseConnector with credentials: {connector_details}")
        self.credentials = connector_details.credentials
        self.connector_type = connector_details.connector_type
        self.user_id = connector_details.user_id
        self.org_id = connector_details.org_id
        self.notebook_id = connector_details.notebook_id
        self.connector_id = None # Get after inserting into database
        self.connector_type = connector_details.connector_type
        self.s3_config = {
            'bucket': os.getenv('AWS_BUCKET_NAME'),
            'region': os.getenv('AWS_REGION'),
            'access_key': os.getenv('AWS_ACCESS_KEY_ID'),
            'secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
            #'prefix': f"exports/{self.org_id}/{self.connector_type}/{self.project_id}/{datetime.now().strftime('%Y-%m-%d')}"
        }
        self.required_fields = required_fields

    async def setup(self) -> ConnectorResponse:
        """
        Template method pattern for connector setup.
        Child classes can override specific steps if needed.
        """
        try:
            print(f"Setting up {self.__class__.__name__}")
            
            # Step 1: Validate credentials
            validation_result = await self._validate_setup()
            if not validation_result['success']:
                return validation_result

            # Step 2: Submit credentials to database
            db_result = await self._submit_to_database()
            if not db_result['success']:
                return db_result
            
            print(f"DB result: {db_result}")

            # Step 3: Process response
            return await self._process_setup_response(db_result['data'])

        except Exception as e:
            logger.error(f"Error in setup: {e}")
            return self._create_error_response(f"Failed to setup {self.__class__.__name__}: {str(e)}")

    async def _validate_setup(self) -> ConnectorResponse:
        """Validate connector setup requirements."""
        
        if not isinstance(self.credentials, dict):
            return {
                'success': False,
                'message': f"Invalid credentials format. Expected dict, got {type(self.credentials)}"
            }

        print(self.credentials)
        missing_fields = [field for field in self.required_fields if not self.credentials.get(field, '')]
        print(f"Missing fields: {missing_fields}")
        
        if missing_fields:
            return {
                'success': False,
                'message': f"Missing required fields: {', '.join(missing_fields)}"
            }
    
        return {'success': True, 'message': 'Credentials valid'}

    async def _submit_to_database(self) -> Dict[str, Any]:
        """Submit connector credentials to database."""
        response = await create_connector_credentials(
            user_id=self.user_id,
            org_id=self.org_id,
            connector_type=self.connector_type,
            credentials=self.credentials,
            doc_string=self.get_connector_docstring(),
            code_string=self.get_connector_code()
        )

        if response['status_code'] != 200 or not response['body']:
            return {
                'success': False,
                'data': response,
                'message': f'Failed to submit {self.__class__.__name__} to database'
            }

        return {
            'success': True,
            'data': response['body'][0]
        }

    async def _process_setup_response(self, data: Dict[str, Any]) -> ConnectorResponse:
        """Process the database response and prepare final setup response."""
        # Handle secret path conversion
        try:
            secret_path = data['credentials']['secret_path']
            data['credentials'] = secrets_manager.get_secret_value(secret_path)
        except Exception as e:
            print(f"Error getting secret: {e}")
            raise e
        
        return {
            'id': data['id'],
            'success': True,
            'message': f'{self.__class__.__name__} submitted to database',
            'code_string': data['code_string'],
            'doc_string': data['doc_string'],
            'credentials': data['credentials'],
            'type': self.connector_type,
            'user_id': data['user_id'],
            'org_id': data['org_id'],
            'notebook_id': data['notebook_id']
        }

    def _create_error_response(self, message: str) -> ConnectorResponse:
        """Create a standardized error response."""
        return {
            'success': False,
            'message': message,
            'code_string': None,
            'doc_string': None,
            'body': None,
            'type': self.connector_type
        }
    @abstractmethod
    def get_connector_code(self) -> str:
        """Return the connector code"""
        pass


    @abstractmethod
    def get_connector_docstring(self) -> str:
        """Return the connector docstring"""
        pass

 

# {
#   "user_id": "8a4fb888-37a9-4185-af84-aba3748062bf",
#   "org_id": "e82e521d-6f6d-4f5e-be6e-b04e6419b64d",
#   "connector_type": "posthog",
#   "credentials": {
#     "apiKey": "phx_wpWyIsZhbd0HiTm2Yer54xVBUc4pqubwDYHyF8KDIuloQdP",
#     "baseUrl": "https://us.posthog.com",
#     "userId": "8a4fb888-37a9-4185-af84-aba3748062bf",
#     "projectId": "24075"
#   }
# }