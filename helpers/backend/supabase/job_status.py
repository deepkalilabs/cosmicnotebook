# status_handler.py
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
print(sys.path)

import json
from uuid import UUID
from typing import Dict, Any
import logging
from pydantic import BaseModel
from common_types import SupabaseJobDetails, SupabaseJobList

logger = logging.getLogger(__name__)
from supabase import Client
from client import get_supabase_client
supabase: Client = get_supabase_client()

def get_all_jobs_for_user(user_id: UUID):
    try:
        response = supabase.table('lambda_jobs') \
            .select('request_id,input_params,completed,result,created_at,updated_at,completed_at,error, notebook_id') \
            .eq('user_id', user_id) \
            .execute()
        
        jobs = [SupabaseJobDetails(**job) for job in response.data]
        job_list = SupabaseJobList(jobs=jobs)
        
        return {
            'statusCode': 200,
            'body': json.dumps(job_list.model_dump())
        }
    except Exception as e:
        logger.error(f"Error getting all jobs for user {user_id}: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def get_job_by_request_id(request_id: str, user_id: UUID):
    try:
        response = supabase.table('lambda_jobs') \
            .select('request_id,input_params,completed,result,created_at,updated_at,completed_at,error,notebook_name,notebook_id') \
            .eq('request_id', request_id) \
            .eq('user_id', user_id) \
            .single() \
            .execute()
            
        if response.data:
            return {
                'statusCode': 200,
                'body': SupabaseJobDetails(**response.data).model_dump()
            }
        else:
            logger.warning(f"Job not found: {request_id}")
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Job not found'
                })
            }

    except Exception as e:
        logger.error(f"Error getting job by request ID: {request_id} for user {user_id}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def get_all_jobs_for_notebook(notebook_id: UUID):
    try:
        response = supabase.table('lambda_jobs') \
            .select('request_id,input_params,completed,result,created_at,updated_at,completed_at,error,notebook_id') \
            .eq('notebook_id', notebook_id) \
            .execute()
        
        jobs = [SupabaseJobDetails(**job) for job in response.data]
        job_list = SupabaseJobList(jobs=jobs)
        
        return {
            'statusCode': 200,
            'body': json.dumps(job_list.model_dump())
        }
    except Exception as e:
        logger.error(f"Error getting all jobs for notebook {notebook_id}: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
