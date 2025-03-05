import type { NextRequest } from 'next/server'
import { getApiUrl } from  '@/app/lib/config';
import { cookies } from 'next/headers';
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

 

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    console.log('token:', token);

    if (!token) {
      return Response.json({ error: 'No token found', redirect: true }, { status: 401 });
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