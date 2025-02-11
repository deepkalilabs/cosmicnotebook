# PostHog API Client Documentation

## Overview

The PostHog API Client is a Python library that provides a convenient interface for interacting with the PostHog API. It enables developers to fetch various types of data including organizations, projects, groups, and events.

## Installation

```python
from cosmic_sdk.secrets import SecretsManager
from cosmic_sdk.connectors import PostHogClient

# Initialize secrets manager
secrets_manager = SecretsManager()

# Get credentials
credentials = secrets_manager.get_secrets(org_id="org_123", connector_type="posthog")

# Initialize PostHog client
posthog_client = PostHogClient(credentials)
```

## Authentication

The client requires three essential credentials to initialize:

- `api_key`: Your PostHog API key
- `base_url`: The base URL of your PostHog instance
- `project_id`: The ID of your PostHog project

## Usage

### Initializing the Client

```python
from posthog.client import PostHogClient

credentials = {
    'apiKey': 'your_api_key',
    'baseUrl': 'your_base_url',
    'projectId': 'your_project_id'
}

client = PostHogClient(credentials)
```

### Organization Operations

#### Get All Organizations
Retrieves a list of all organizations accessible to the authenticated user.

```python
response = client.get_organizations()
```

Returns:
```python
{
    "status": "success",
    "message": "Connected to PostHog",
    "data": [/* organization data */]
}
```

### Project Operations

#### Get Project Details
Retrieves details about a specific project.

```python
response = client.get_project()
```

Returns:
```python
{
    "status": "success",
    "message": "Project retrieved successfully",
    "data": {/* project data */}
}
```

### Group Operations

#### Get All Groups
Retrieves all groups for a project.

```python
response = client.get_groups()
```

#### Find Group
Finds a group by key or group index.

```python
response = client.get_group_find()
```

#### Get Group Types
Retrieves all group types defined in the project.

```python
response = client.get_group_types()
```

### Event Operations

#### Get All Events
Retrieves all events for a project.

```python
response = client.get_events()
```

#### Get Event by ID
Retrieves a specific event by its ID.

```python
response = client.get_event_by_id("event_id")
```

#### Get Event Values
Retrieves event values for analysis.

```python
response = client.get_event_by_values()
```

### Test Data Generation

#### Generate Test Data
Generates test data for a specific organization and project.

```python
response = client.generate_test_data("organization_id")
```

## Response Format

All methods return a dictionary with the following structure:

```python
{
    "status": str,  # "success" or "error"
    "message": str, # Description of the operation result
    "data": Any     # The response data or None if error
}
```

## Error Handling

The client implements comprehensive error handling:

- Missing credentials raise `ValueError`
- API request failures return error responses with details
- Network timeouts are set to 10 seconds
- All API calls are wrapped in try-except blocks

## Dependencies

- `requests`: For HTTP requests
- `logging`: For error logging
- `typing`: For type hints
- `cosmic_sdk.connectors.posthog.models`: For PostHog data models

## TODO Items

1. Add query parameters support for groups API (cursor, search, group_type)
2. Add query parameters support for group find (group_key, group_type_index)
3. Implement pagination handling
4. Add rate limiting support
5. Add more comprehensive error handling

## API Documentation References

For more detailed information about the PostHog API endpoints:

- Organizations API: https://posthog.com/docs/api/organizations
- Groups API: https://posthog.com/docs/api/groups
- Events API: https://posthog.com/docs/api/events