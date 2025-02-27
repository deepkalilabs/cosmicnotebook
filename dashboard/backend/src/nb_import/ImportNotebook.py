import json
from helpers.backend.supabase.client import get_supabase_client
from helpers.backend.aws.s3 import s3

class ImportNotebook:
    def __init__(self, notebook_data: str, user_id: str):
        self.filename = notebook_data['fileName']
        if " " in self.filename:
            self.filename = self.filename.replace(" ", "_")
        self.notebook_name = self.filename.split('.')[0]
        self.ipynb = json.loads(notebook_data['fileContent'])
        assert type(self.ipynb) == dict, "IPynb is not a dict"
        self.supabase = get_supabase_client()
        self.user_id = user_id

    def save_to_supabase(self):
        response = self.supabase.table('notebooks').insert({
            'name': self.notebook_name + ".py",
            'user_id': self.user_id,
            'imported': True
        }).execute()
        self.notebook_id = response.data[0]['id']

    def save_to_cloud(self):
        self.save_to_supabase()
        aws_contents = {}
        aws_contents[f"{self.notebook_name}.ipynb"] = json.dumps(self.ipynb)

        s3_response = s3.save_or_update_notebook(
            notebook_id=self.notebook_id,
            user_id=self.user_id,
            contents=aws_contents,
            project_name=self.notebook_name
        )

        if s3_response.get('statusCode') != 200:
            print(f"S3 Response: {s3_response}")
            raise Exception("Failed to save notebook to S3")
        
        self.supabase.table('notebooks').update({
            's3_url': s3_response['url']
        }).eq('id', self.notebook_id).execute()
        
        return {
            'success': True,
            'message': 'Notebook imported successfully',
            'status': 200,
            'notebook_id': self.notebook_id
        }
        
