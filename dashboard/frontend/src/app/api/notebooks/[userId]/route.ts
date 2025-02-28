import type { NextRequest } from 'next/server'
import { getApiUrl } from  '@/app/lib/config';

export async function GET(
  req: NextRequest
) {
  try {

    //Get the last part of the path
    const userId = req.nextUrl.pathname.split('/').pop();
    console.log('userId:', userId);

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const authHeader = req.headers.get('Authorization');
    console.log('Auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return Response.json({ 
            error: 'No valid authorization header',
            redirect: true
        }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token || token == "undefined") {
      return Response.json({ 
        error: 'No valid token',
        redirect: true
      }, { status: 401 });
    }

    const response = await fetch(`${getApiUrl()}/notebooks/all/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('response:', response);
    const data = await response.json();

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching notebooks:', error);
    return Response.json({ error: error }, { status: 500 });
  }
}