import type { NextRequest } from 'next/server';
import { getApiUrl } from '@/app/lib/config';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    console.log('GET /api/connectors/all - orgId:', orgId);
    if (!orgId) {
      console.error('Org ID is required');
      return Response.json({ error: 'Org ID is required', data: null, status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    console.log('GET /api/connectors/all - token:', token?.substring(0, 20) + '...');

    if (!token) {
      console.log('GET /api/connectors/all - No token found');
      return Response.json({ error: 'No token found', redirect: true }, { status: 401 });
    }

    const response = await fetch(`${getApiUrl()}/connectors/all/${orgId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('FastAPI response status:', response.status);
    console.log('FastAPI response headers:', Object.fromEntries(response.headers));

    const text = await response.text(); // Get raw text first
    console.log('FastAPI response body:', text);

    let data;
    try {
      data = JSON.parse(text); // Attempt to parse as JSON
    } catch (parseError) {
      console.error('Failed to parse FastAPI response as JSON:', parseError);
      return Response.json({ error: 'Invalid response from backend', data: text, status: 500 });
    }

    if (!response.ok) {
      console.error('FastAPI returned non-200 status:', response.status, data);
      return Response.json({ error: data.detail || 'Failed to fetch connectors', data, status: response.status });
    }

    return Response.json({ error: null, data, status: 200 });
  } catch (error) {
    console.error('GET /api/connectors/all - Error:', error);
    return Response.json({ error: 'Failed to fetch connectors', data: null, status: 500 });
  }
}