import json
import sys
import os
sys.path.append((os.path.dirname(os.getcwd())))
from supabase import Client
import logging
from helpers.backend.supabase.client import get_supabase_client

logger = logging.getLogger(__name__)


class SupabaseLogs:
    def __init__(self):
        self.supabase: Client = get_supabase_client()

    def get_deployment_logs(self, notebook_id: str):
        try:
            response = self.supabase.table('logs') \
                .select('*') \
                .eq('notebook_id', notebook_id) \
                .order('created_at', desc=True) \
                .limit(1) \
                .execute()

            return {
                'status_code': 200,
                'body': json.dumps(response.data),
                'message': 'Successfully retrieved deployment logs'
            }

        except Exception as e:
            logger.error(f"Error getting deployment logs for notebook {notebook_id}: {str(e)}")
            return {
                'status_code': 500,
                'body': json.dumps({'error': str(e)}),
                'message': 'Error getting deployment logs'
            }


    def create_deployment_log(
            self,
            type: str, 
            log_group: str, 
            log_stream: str, 
            error: str, 
            status: str,
            file_path: str,
            notebook_id: str
    ):
        try:
            response = self.supabase.table('logs').insert({
                'notebook_id': notebook_id,
                'type': type,
                'log_group': log_group,
                'log_stream': log_stream,
                'error': error,
                'status': status,
                'file_path': file_path,
                'notebook_id': notebook_id,
            }).execute()

            return {
                'status_code': 200,
                'body': json.dumps(response.data),
                'message': 'Successfully added deployment log'
            }
        except Exception as e:
            logger.error(f"Error adding deployment log for notebook {notebook_id}: {str(e)}")
            return {
                'status_code': 500,
                'body': json.dumps({'error': str(e)}),
                'message': 'Error adding deployment log'
            }