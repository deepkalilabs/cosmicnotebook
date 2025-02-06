import type { NextRequest } from 'next/server'
import { getApiUrl } from  '@/app/lib/config';

/**
 * This endpoint is used to create a connector.
 * @param req - The request object.
 * @returns A JSON response with the connectors.
 */
export async function POST(
  req: NextRequest
) {
  try {

    const { userId, orgId, type, credentials } = await req.json();
    console.log('userId:', userId);
    console.log('orgId:', orgId);
    console.log('type:', type);
    console.log('credentials:', credentials);
    if (!userId || !orgId || !type || !credentials) {
      return Response.json({ error: 'User ID, Org ID, Type, and Credentials are required', data: null, status: 400 });
    }

    const response = await fetch(`${getApiUrl()}/connectors/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        org_id: orgId,
        connector_type: type,
        credentials: credentials
      })
    });

    console.log('Created connector response:', response);
    const data = await response.json();
    return Response.json({ error: null, data: data, status: 200 });
  } catch (error) {
    console.error('Error fetching connectors:', error);
    return Response.json({ error: 'Failed to fetch connectors', data: null, status: 500 });
  }
}