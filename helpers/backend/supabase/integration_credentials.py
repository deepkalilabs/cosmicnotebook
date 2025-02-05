from typing import Dict, List, Optional
from datetime import datetime

from supabase.client import Client
from helpers.backend.supabase.client import get_supabase_client

TABLE_NAME = "integration_credentials"
supabase: Client = get_supabase_client()

async def create_integration_credentials(org_id: str, notebook_id: str, integration_type: str, credentials: Dict) -> Dict:
    """Create new integration credentials"""
    supabase = get_supabase_client()
    
    data = {
        "org_id": org_id,
        "notebook_id": notebook_id,
        "type": integration_type,
        "credentials": credentials,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    
    result = supabase.table(TABLE_NAME).insert(data).execute()
    return result.data[0] if result.data else None

async def get_integration(integration_id: str) -> List[Dict]:
    """Retrieve integration based on integration id"""
    supabase = get_supabase_client()
    query = supabase.table(TABLE_NAME).select("*").eq("id", integration_id)
    result = query.execute()
    return result.data if result.data else []

async def update_integration_credentials(integration_id: str, updates: Dict) -> Dict:
    """Update existing integration credentials"""
    supabase = get_supabase_client()
    updates["updated_at"] = datetime.utcnow().isoformat()
    
    result = (
        supabase.table(TABLE_NAME)
        .update(updates)
        .eq("id", integration_id)
        .execute()
    )
    return result.data[0] if result.data else None

async def delete_integration_credentials(integration_id: str) -> bool:
    """Delete integration credentials"""
    supabase = get_supabase_client()
    result = (
        supabase.table(TABLE_NAME)
        .delete()
        .eq("id", integration_id)
        .execute()
    )
    return bool(result.data)

async def get_all_integrations(notebook_id: str) -> List[Dict]:
    """Retrieve all integrations for a notebook"""
    supabase = get_supabase_client()
    query = supabase.table(TABLE_NAME).select("*").eq("notebook_id", notebook_id)
    result = query.execute()
    return result.data if result.data else []

async def update_is_tested(id: str, is_tested: bool) -> Dict:
    """Update is_tested for an integration"""
    supabase = get_supabase_client()
    result = (
        supabase.table(TABLE_NAME)
        .update({"is_tested": is_tested})
        .eq("id", id)
        .execute()
    )
    return result.data[0] if result.data else None

