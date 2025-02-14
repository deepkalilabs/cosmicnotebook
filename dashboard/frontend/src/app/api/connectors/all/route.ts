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

    const { orgId } = await req.json();
    console.log('orgId:', orgId);
    if (!orgId) {
      console.error('Org ID is required');
      return Response.json({ error: 'Org ID is required', data: null, status: 400 });
    }

    const response = await fetch(`${getApiUrl()}/connectors/all/${orgId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Created connector response:', response);
    const data = await response.json();
    return Response.json({ error: null, data: data, status: 200 });
  } catch (error) {
    console.error('Error fetching connectors:', error);
    return Response.json({ error: 'Failed to fetch connectors', data: null, status: 500 });
  }
}