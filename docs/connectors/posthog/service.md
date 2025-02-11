# PostHog Service Documentation

Technical documentation for the PostHog service layer, which provides processed data from the PostHog API.

## Setup

The PostHog service is a Python class that connects to the PostHog API and provides a set of methods for querying the data.

The service is initialized with a dictionary of credentials, which is typically loaded from a secrets manager.

```python
from cosmic_sdk.secrets import SecretsManager
from cosmic_sdk.connectors import PostHogService

# Initialize secrets manager
secrets_manager = SecretsManager()

# Get credentials
credentials = secrets_manager.get_secrets(org_id="org_123", connector_type="posthog")

# Initialize PostHog service
posthog_service = PostHogService(credentials)
```

## Available Methods

### 1. fetch_posthog_user_logins

Retrieves user login events with timestamps and accessed URLs.

**Parameters:**
- `start_date` (str): Start date in YYYY-MM-DD format

**Example: Fetching login events from January 1st, 2024 till now**

```python
response = posthog_service.fetch_posthog_user_logins("2024-01-01")
```

**Returns:**
- Dictionary containing:
  - `status`: "success" or "error"
  - `message`: Description of the result
  - `data`: JSON response with event data (if successful)




### 2. fetch_events

Retrieves events data for specific supported event types.

**Parameters:**
- `start_date` (str): Start date in YYYY-MM-DD format
- `event_name` (str): Example name of the event to fetch. Please refer to the PostHog API documentation for the [list of supported events](https://posthog.com/docs/api/events).
  - `$pageview`: Page view events
  - `$pageleave`: Page leave events
  

**Returns:**
- Dictionary containing:
  - `status`: "success" or "error"
  - `message`: Description of the result
  - `data`: JSON response with event data (if successful)

**Example: Fetching pageview events from January 1st, 2025 till now**

```python
response = posthog_service.fetch_posthog_events(
start_date="2025-01-01",
event_name="$pageview"
)
```


