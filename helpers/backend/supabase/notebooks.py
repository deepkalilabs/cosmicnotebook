import os
import logging
logger = logging.getLogger(__name__)
from supabase import Client
# from helpers.backend.supabase.client import get_supabase_client
from typing import Optional
from supabase import create_client, Client

from dotenv import load_dotenv
load_dotenv(os.path.join(os.getcwd(), '.env'))

LOGGER = logging.getLogger(__name__)
class SupabaseClient():
    _instance: Optional[None] = None

    @classmethod 
    def get_client(cls) -> Client:
        SUPABASE_URL=os.environ.get('SUPABASE_URL')
        SUPABASE_SERVICE_KEY=os.environ.get('SUPABASE_SERVICE_KEY')

        if cls._instance is None:
            SUPABASE_URL=SUPABASE_URL
            SUPABASE_SERVICE_KEY=SUPABASE_SERVICE_KEY

            if not SUPABASE_SERVICE_KEY or not SUPABASE_URL:
                print("Supabase keys not found.")
                return None
            cls._instance: Client = create_client(
                supabase_url=SUPABASE_URL,
                supabase_key=SUPABASE_SERVICE_KEY
            )
        
        return cls._instance

        
def get_supabase_client() -> Client:
    return SupabaseClient.get_client()

supabase: Client = get_supabase_client()

def get_notebook_by_id(notebook_id: str, user_id: str):
    response = supabase.table('notebooks') \
        .select('*') \
        .eq('id', notebook_id) \
        .eq('user_id', user_id) \
        .execute()
    return response.data[0]

def save_notebook(notebook_id: str, user_id: str, url: str, project_name: str):
    LOGGER.debug(f"Saving notebook: {notebook_id}, {user_id}, {url}, {project_name}")
    # Save URL to Supabase based on notebook_id and user_id
    response = supabase.table('notebooks').upsert({
        'id': notebook_id, 
        'user_id': user_id,
        's3_url': url,
        'updated_at': 'now()',
        'name': project_name,
        'path': project_name,
    }).execute()

    return response.data[0]

def rename_notebook(notebook_id: str, user_id: str, new_path: str):
    try:
        response = supabase.table('notebooks') \
            .upsert({
                'id': notebook_id,
                'user_id': user_id,
                'path': new_path,
                'name': new_path,
                'updated_at': 'now()'
            }) \
            .execute()
        logging.info(f"Response: {response}")
        return response
    
    except Exception as e:
        logging.error(f"Error renaming notebook: {e}")
        return None

def get_all_notebooks(user_id: str):
    if not user_id:
        logging.error("User ID is required")
        return None
    try:
        response = supabase.table('notebooks') \
            .select('*') \
            .eq('user_id', user_id) \
            .execute()
        return response.data
    except Exception as e:
        logging.error(f"Error getting all notebooks: {e}")
        return None
