from typing import Any, List, Optional, Dict
import httpx
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel

mcp = FastMCP("pylon")

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

# Global constants
OAUTH_TOKEN = "pylon_api_71a9a32bbc2eb5afa08d75dcf974121a28b032603630023ecfd899d3dae1dd68"
API_URL = "https://api.usepylon.com"
ACCOUNT_SLUG = "accounts"
ISSUES_SLUG = "issues"
HEADERS = {"Authorization": f"Bearer {OAUTH_TOKEN}", "Content-Type": "application/json"}

async def _make_pylon_request(method: str, url: str, data: dict[str, Any] = None):
    """ 
    Make a request to the Pylon API
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(method, url, headers=HEADERS, json=data)
            response.raise_for_status()
            _handle_error(response)
            return response.json()
        except httpx.HTTPStatusError as e:
            raise Exception(f"HTTP error occurred: {e}")
        
def _handle_error(response: httpx.Response):
    if response.status_code >= 400:
        error_text = response.text
        print(f"Request failed with status code {response.status_code}")
        print(f"Error response: {error_text}")
    response.raise_for_status()

@mcp.tool()
async def get_accounts() -> AccountList:
    """
    Get all accounts
    """
    url = f"{API_URL}/{ACCOUNT_SLUG}"
    response = await _make_pylon_request("GET", url)
    print(response)
    return AccountList(**response)

@mcp.tool()
async def get_account_by_id(account_id: str) -> Account:
    """
    Get an account by id
    """
    url = f"{API_URL}/{ACCOUNT_SLUG}/{account_id}"
    response = await _make_pylon_request("GET", url)
    print(response)
    return Account(**response.get("data"))

@mcp.tool()
async def update_account(account_id: str, data: dict) -> Account:
    """
    Update an account
    """
    url = f"{API_URL}/{ACCOUNT_SLUG}/{account_id}"
    response = await _make_pylon_request("PATCH", url, data)
    print(response)
    return Account(**response.get("data"))

if __name__ == "__main__":
    mcp.run(transport="stdio")