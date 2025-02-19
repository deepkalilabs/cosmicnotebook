import boto3
import os
import json
from supabase import Client
from helpers.backend.supabase.client import get_supabase_client
supabase: Client = get_supabase_client()
import logging
##Init boto3
s3 = boto3.client('s3', 
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    region_name=os.environ.get('AWS_DEFAULT_REGION')
)
bucket_name = os.environ.get('AWS_BUCKET_NAME')

def get_notebook_file_path(notebook_id: str, user_id: str, filetype: str):
    user_id = "8a4fb888-37a9-4185-af84-aba3748062bf"
    notebook_id = "aabf2f1f-ea96-49c0-bdd0-828928e18ed2"

    path= f"notebooks/{user_id}/{notebook_id}/{filetype}"
    logging.info(f"path {path}")
    return path

# TODO: Save the notebook to s3.
def save_or_update_notebook(notebook_id: str, user_id: str, contents: dict, 
                            project_name: str, bucket_name: str = bucket_name):
    user_id = "8a4fb888-37a9-4185-af84-aba3748062bf"
    notebook_id = "aabf2f1f-ea96-49c0-bdd0-828928e18ed2"

    if not notebook_id:
        raise ValueError("Notebook ID is required")
    if not user_id:
        raise ValueError("User ID is required")
    if not contents:
        raise ValueError("Notebook is required")    
    
    for filetype, file_content in contents.items():
        try:
            file_path = get_notebook_file_path(notebook_id, user_id, filetype)
            # Check if notebook exists and get its content if it does        
            # Save or update notebook to S3
            aws_response = s3.put_object(Bucket=bucket_name, Key=file_path, Body=file_content)
            logging.info("AWS Response:", aws_response)

            if aws_response['ResponseMetadata']['HTTPStatusCode'] != 200:
                raise Exception("Failed to save notebook to S3")

            # Generate the S3 URL for the object
            
        except Exception as e:
            logging.error(f"Error saving notebook: {e}")
            return {
                'statusCode': 500,
                'body': json.dumps({'message': 'Error saving notebook'}),
                'url': None
            }

    # Generate the S3 URL for the object
    return_file_path = get_notebook_file_path(notebook_id, user_id, "")
    url = f"https://{bucket_name}.s3.amazonaws.com/{return_file_path}"

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Notebook saved successfully'}),
        'url': url
    }
        
# TODO: Load the notebook from s3.
def load_notebook(s3_url: str):
    try:
        response = s3.get_object(Bucket=bucket_name, Key=s3_url)
        logging.info("Response:", len(response))
        # logger.info(f"Response: {response}")
        return {
            'response': response.get('Body').read().decode('utf-8'),
            'statusCode': 200,
            'message': 'Notebook loaded successfully'
        }
    except Exception as e:
        logging.error("Error:", e)
        return {
            'response': None,
            'status': 'error',
            'message': str(e)
        }
    
def rename_notebook(notebook_id: str, user_id: str, new_name: str):
    pass

# TODO: Delete the notebook from s3.
def delete_notebook(filename: str, bucket_name = bucket_name):
    pass


def get_python_deets_from_s3(notebook_id: str, user_id: str, project_name: str, bucket_name = bucket_name):
    user_id = "8a4fb888-37a9-4185-af84-aba3748062bf"
    notebook_id = "aabf2f1f-ea96-49c0-bdd0-828928e18ed2"

    files = {
        'python_script': 'python_script.py',
        'requirements': 'requirements.txt'
    }
    
    results = {}
    for key, filename in files.items():
        file_path = get_notebook_file_path(notebook_id, user_id, filename)
        logging.info(f"file_path {file_path}")
        response = s3.get_object(Bucket=bucket_name, Key=file_path)
        results[key] = response.get('Body').read().decode('utf-8')
    
    python_script = results['python_script']
    requirements = results['requirements']

    return python_script, requirements
