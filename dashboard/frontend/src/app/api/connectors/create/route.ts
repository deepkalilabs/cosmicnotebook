import type { NextRequest } from 'next/server'
import { getApiUrl } from  '@/app/lib/config';
import { ConnectorCredentialRequest } from '@/app/types';
import { useUserStore } from '@/app/store';

/**
 * This endpoint is used to create a connector.
 * @param req - The request object.
 * @returns A JSON response with the connectors.
 */
export async function POST(
  req: NextRequest
) {
  try {
    const connectorRequest = await req.json() as ConnectorCredentialRequest;
    console.log('connectorRequest:', connectorRequest);
    console.log('userId:', connectorRequest.user_id);
    console.log('orgId:', connectorRequest.org_id);
    console.log('type:', connectorRequest.type);
    console.log('credentials:', connectorRequest.credentials);
    console.log('notebookId:', connectorRequest.notebook_id);

    if (!connectorRequest.user_id || !connectorRequest.org_id || !connectorRequest.type || !connectorRequest.credentials || !connectorRequest.notebook_id) {
      console.error('User ID, Org ID, Type, Credentials, and Notebook ID are required');
      return Response.json({ error: 'User ID, Org ID, Type, Credentials, and Notebook ID are required', data: null, status: 400 });
    }

    const { user } = useUserStore.getState();
    console.log('Token in create connector:', user);
    if (!user) {
      console.error('User not found');
      return Response.json({ error: 'User not found', data: null, status: 401 });
    }

    const response = await fetch(`${getApiUrl()}/connectors/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: connectorRequest.user_id,
        org_id: connectorRequest.org_id,
        connector_type: connectorRequest.type,
        credentials: connectorRequest.credentials,
        notebook_id: connectorRequest.notebook_id
      })
    });

    console.log('Created connector response:', response);
    const data = await response.json();
    console.log('Created connector data:', data);

    if (data.status_code === 200) {
      return Response.json({ error: null, data: data, status: 200 });
    }

    return Response.json({ error: data.message, status: data.status_code });
  } catch (error) {
    console.error('Error fetching connectors:', error);
    return Response.json({ error: 'Failed to fetch connectors', data: null, status: 500 });
  }
}