from datetime import datetime
from typing import Dict, Optional
import os
from supabase import Client
from helpers.backend.supabase.client import get_supabase_client
from src.backend_types import ScheduledJob, NotebookDetails, ScheduledJobRequest
from typing import List
import uuid
import json
import logging
import boto3
from fastapi import HTTPException
import pdb
logger = logging.getLogger(__name__)

# TODO: Turn all of these into transactions.
class NotebookScheduler:
    def __init__(self, notebook_id: str):
        self.notebook_id = notebook_id
        db_url = os.getenv('SUPABASE_DATABASE_URL')
        safe_url = db_url.replace(db_url.split('@')[0].split(':')[-1], '****')
        print(f"Attempting to connect with URL: {safe_url}")
        # Initialize Supabase
        self._supabase: Client = get_supabase_client()
        self.region = os.environ.get("AWS_REGION")
        self._events_client = boto3.client('events', region_name=self.region)
        self._lambda_client = boto3.client('lambda', region_name=self.region)

    def save_schedule_to_supabase(self, notebook_job_schedule: ScheduledJob, rule_name: str):
        self._supabase.table('schedules').insert({
            'notebook_id': self.notebook_id,
            'schedule': notebook_job_schedule.schedule,
            'input_params': notebook_job_schedule.input_params,
            'status': 'Active',
            'aws_rule_name': rule_name
        }).execute()

    async def create_schedule(self, notebook_job_schedule: ScheduledJob):
        try:
            cron = notebook_job_schedule.schedule
            self.lambda_fn_name = self._supabase.table('notebooks').select('lambda_fn_name').eq('id', self.notebook_id).execute().data[0]['lambda_fn_name']
            
            lambda_response = self._lambda_client.get_function(FunctionName=self.lambda_fn_name)
            lambda_arn = lambda_response['Configuration']['FunctionArn']

            input_params = notebook_job_schedule.input_params
            
            rule_payload = {}
            if isinstance(input_params, str):
                try:
                    input_params = json.loads(input_params)
                    request_id = str(uuid.uuid4())
                    rule_payload['request_id'] = request_id
                    rule_payload['notebook_id'] = self.notebook_id
                    rule_payload['body'] = input_params
                    rule_payload = json.dumps(rule_payload)
                except json.JSONDecodeError:
                    logger.error("Invalid JSON in request body")
                    logger.info(f"Event: {input_params}")
                    return {'request_id': request_id, 'status': 'FAILED', 'error': 'Invalid JSON'}

            rule_name = f"schedule-{uuid.uuid4()}"

            rule_response = self._events_client.put_rule(
                Name=rule_name,
                ScheduleExpression=f"cron({cron})",
                State='ENABLED',
                Description=f"Schedule for {self.lambda_fn_name}"
            )

            self._lambda_client.add_permission(
                FunctionName=self.lambda_fn_name,
                StatementId=f"EventBridge-{rule_name}",
                Action='lambda:InvokeFunction',
                Principal='events.amazonaws.com',
                SourceArn=rule_response['RuleArn']
            )

            print(f"rule_payload {rule_payload}")

            self._events_client.put_targets(
                Rule=rule_name,
                Targets=[
                    {
                        'Id': self.lambda_fn_name,
                        'Arn': lambda_arn,
                        'Input': rule_payload
                    }
                ]
            )

            self.save_schedule_to_supabase(notebook_job_schedule, rule_name)

            return {
                "status": "success",
                "rule_name": rule_name,
                "rule_arn": rule_response['RuleArn'],
                "lambda_arn": lambda_arn,
                "input_params": input_params
            }
        except self._lambda_client.exceptions.ResourceNotFoundException:
            raise HTTPException(status_code=404, detail="Lambda function not found")
        except Exception as e:
            print(f"error {e}")
            raise HTTPException(status_code=500, detail=str(e))


    async def get_schedules(self) -> List[ScheduledJob]:
        schedules = self._supabase.table('schedules').select('*').eq('notebook_id', self.notebook_id).execute()
        print(f"schedules {schedules.data}")
        return schedules.data
    

    async def delete_schedule(self, job_id: str):
        try:
            schedule_details = self._supabase.table('schedules').select('*, notebooks(lambda_fn_name)').eq('id', job_id).execute()
            lambda_fn_name = schedule_details.data[0]['notebooks']['lambda_fn_name']
            rule_name = schedule_details.data[0]['aws_rule_name']

            print("deleting schedule")
            print(f"lambda_fn_name {lambda_fn_name}")
            print(f"rule_name {rule_name}")

            # Get all targets for the rule
            targets = self._events_client.list_targets_by_rule(
                Rule=rule_name
            )
            print(f"targets {targets}")
            target_ids = [target['Id'] for target in targets['Targets']]

            # Remove all targets
            if target_ids:
                self._events_client.remove_targets(
                    Rule=rule_name,
                    Ids=target_ids
                )

            # Delete the rule
            self._events_client.delete_rule(
                Name=rule_name,
                Force=True
            )
            self._supabase.table('schedules').delete().eq('id', job_id).execute()
        except Exception as e:
            print(f"error {e}")
            raise HTTPException(status_code=500, detail=str(e))
