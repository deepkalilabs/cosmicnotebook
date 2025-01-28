import os
import json
from uuid import UUID
from typing import Dict, Any
import logging
from datetime import datetime
logger = logging.getLogger(__name__)
from supabase import Client
from helpers.backend.supabase.client import get_supabase_client
supabase: Client = get_supabase_client()

async def insert_connector_sync_run(
    connector_id: str,
    status: str,
    started_at: datetime,
    completed_at: datetime,
    store_url_path: str,
    metadata: Dict[str, Any],
    config: Dict[str, Any],
    raw_response: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Insert a new connector sync run into the database
    This table is used to track the status of the sync runs
    """
    try:
        print("Inserting to connector_sync_runs table")
        response = await supabase.table('connector_sync_runs') \
            .insert({
                'connector_id': connector_id,
                'status': status,
                'started_at': started_at,
                'completed_at': completed_at,
                'store_url_path': store_url_path,
                'metadata': metadata,
                'config': config,
                'raw_response': raw_response
            }) \
            .execute()
        print("Response after insert", response)
        return response.data
    except Exception as e:
        logger.error(f"Error inserting connector sync run: {e}")
        return None