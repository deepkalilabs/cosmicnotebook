import os
from supabase import create_client, Client
from typing import Optional

class SupabaseClient():
    _instance: Optional[None] = None

    @classmethod 
    def get_client(cls) -> Client:
        if cls._instance is None:
            SUPABASE_URL=os.getenv('SUPABASE_URL')
            SUPABASE_SERVICE_KEY=os.getenv('SUPABASE_SERVICE_KEY')

            if not SUPABASE_SERVICE_KEY or not SUPABASE_URL:
                raise ValueError("Supabase keys not found.")
            
            cls._instance: Client = create_client(
                supabase_url=SUPABASE_URL,
                supabase_key=SUPABASE_SERVICE_KEY
            )
        
        return cls._instance

        
def get_supabase_client() -> Client:
    return SupabaseClient.get_client()
