import json
import sys
import os
sys.path.append((os.path.dirname(os.getcwd())))
from supabase import Client
import logging
from helpers.backend.supabase.client import get_supabase_client
from helpers.backend.common_types import SupabaseConnectorCredential, SupabaseConnectorCredentialList
from helpers.backend.secrets import secrets_manager

logger = logging.getLogger(__name__)
supabase: Client = get_supabase_client()

async def get_connector_credentials(org_id: str):
    print('In get_connector_credentials', org_id)

    if not org_id:
        return {
            'status_code': 400,
            'body': json.dumps({'error': 'Org ID are required'}),
            'message': 'Org ID are required'
        }

    
    try:
        response = supabase.table('connector_credentials') \
            .select('*') \
            .eq('org_id', org_id) \
            .execute()
    
        credentials = [SupabaseConnectorCredential(**credential) for credential in response.data]
        credential_list = SupabaseConnectorCredentialList(credentials=credentials)
        print(credential_list)

        # Transform secret path into credentials.
        for credential in credential_list.credentials:
            credential.credentials = secrets_manager.get_secret_value(credential.credentials['secret_path'])
        
        return {
            'status_code': 200,
            'body': json.dumps(credential_list.model_dump()),
            'message': 'Successfully retrieved connector credentials'
        }
    except Exception as e:
        logger.error(f"Error getting connector credentials for org {org_id}: {str(e)}")
        return {
            'status_code': 500,
            'body': json.dumps({'error': str(e)}),
            'message': 'Error getting connector credentials'
        }



async def create_connector_credentials(org_id: str, user_id: str, connector_type: str, credentials: dict, doc_string: str, code_string: str):
    if not user_id:
        return {
            'status_code': 400,
            'message': 'User ID is required',
            'body': None
        }
    
    if not org_id:
        return {
            'status_code': 400,
            'message': 'Org ID is required',
            'body': None
        }
    
    if not connector_type:
        return {
            'status_code': 400,
            'message': 'Connector type is required',
            'body': None
        }
    
    if not credentials:
        return {
            'status_code': 400,
            'message': 'Credentials are required',
            'body': None
        }
    
    """
    Turn credentials into a secret path and save it to the database.
    """
    secret_path = secrets_manager.put_secret_value(f"orgs/{org_id}/connectors/{connector_type}", credentials)
    metadata = {
        "arn": secret_path['ARN'],
        "version": secret_path['VersionId']
    }
    path = secret_path['Name']
    print('metadata', metadata)
    print('path', path)

    try:
        response = supabase.table('connector_credentials') \
            .upsert({
                'user_id': user_id,
                'org_id': org_id,
                'connector_type': connector_type,
                'credentials': {'secret_path': path, 'metadata': metadata},
                'doc_string': doc_string,
                'code_string': code_string
            }) \
            .execute()
        
        return {
            'status_code': 200,
            'message': 'Connector credentials created successfully',
            'body': response.data
        }
    except Exception as e:
        logger.error(f"Error creating connector credentials: {str(e)}")
        return {
            'status_code': 500,
            'message': str(e),
            'body': None
        }

def delete_connector_credentials(connector_id: str):
    if not connector_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Connector ID is required'}),
            'message': 'Connector ID is required'
        }
    
    try:
        response = supabase.table('connector_credentials') \
            .delete() \
            .eq('id', connector_id) \
            .execute()
        
        return {
            'statusCode': 200,
            'message': 'Connector credentials deleted successfully',
            'body': json.dumps(response.data)
        }
    except Exception as e:
        logger.error(f"Error deleting connector credentials: {str(e)}")
        return {
            'statusCode': 500,
            'message': 'Error deleting connector credentials',
            'body': None
        }
    

def get_is_type_connected(org_id: str, type: str):
    if not org_id:
        return {
            'statusCode': 400,
            'message': 'Org ID is required'
        }
    
    if not type:
        return {
            'statusCode': 400,
            'message': 'Type is required'
        }
    
    try:
        response = supabase.table('connector_credentials') \
            .select('id') \
            .eq('org_id', org_id) \
            .eq('connector_type', type) \
            .limit(1) \
            .execute()
        
        return {
            'statusCode': 200,
            'body': json.dumps({'is_connected': len(response.data) > 0}),
            'message': 'Successfully retrieved connector credentials'
        }   
    except Exception as e:
        logger.error(f"Error checking connector connection: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'message': 'Error checking connector connection'
        }