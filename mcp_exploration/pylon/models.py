from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class Secret(BaseModel):
    bearer_token: str

class Channel(BaseModel):
    channel_id: str
    source: str

class ExternalId(BaseModel):
    external_id: str
    label: str

class Owner(BaseModel):
    id: str

class CustomField(BaseModel):
    slug: str
    id: str
    values: Optional[List[str]] = None

class Account(BaseModel):
    id: str
    created_at: str
    channels: Optional[List[Channel]] = None
    custom_fields: Optional[Dict[str, CustomField]] = None
    domain: Optional[str] = None
    domains: Optional[List[str]] = None
    primary_domain: Optional[str] = None
    latest_customer_activity_time: Optional[str] = None
    name: Optional[str] = None
    owner: Optional[Owner] = None
    type: Optional[str] = None
    external_ids: Optional[List[ExternalId]] = None
    tags: Optional[List[str]] = None

class AccountList(BaseModel):
    data: List[Account]
    request_id: str
