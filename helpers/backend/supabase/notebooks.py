import logging
logger = logging.getLogger(__name__)
from supabase import Client
from helpers.backend.supabase.client import get_supabase_client
supabase: Client = get_supabase_client()

def get_notebook_by_id(notebook_id: str, user_id: str):
    response = supabase.table('notebooks') \
        .select('*') \
        .eq('id', notebook_id) \
        .eq('user_id', user_id) \
        .execute()
    return response.data[0]

def save_notebook(notebook_id: str, user_id: str, url: str, project_name: str):
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

