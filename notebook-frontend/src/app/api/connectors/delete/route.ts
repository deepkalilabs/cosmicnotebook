import type { NextRequest } from 'next/server'
import { getApiUrl } from  '@/app/lib/config';

/**
 * This endpoint is used to delete a connector.
 * @param req - The request object.
 * @returns A JSON response with the connectors.
 */
export async function DELETE(
  req: NextRequest
) {
  try {
    const { connectorId } = await req.json();
    console.log('Delete connector:', connectorId);

    if (!connectorId) {
      return Response.json({ error: 'Connector ID is required', data: null, status: 400 });
    }

    const response = await fetch(`${getApiUrl()}/connectors/delete/${connectorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('response:', response);
    const data = await response.json();
    return Response.json({ error: null, data: data, status: 200 });
  } catch (error) {
    console.error('Error deleting connector:', error);
    return Response.json({ error: 'Failed to delete connector', data: null, status: 500 });
  }
}