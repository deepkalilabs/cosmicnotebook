// src/app/api/jobs/schedule/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getApiUrl } from  '@/app/lib/config';
import { useUserStore } from '@/app/store';
export async function GET(request: NextRequest) {

    const authHeader = request.headers.get('Authorization');
    console.log('Auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'No valid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
 
    try {
        const notebookId = request.nextUrl.pathname.split('/').pop();
        const endpoint = `${getApiUrl()}/notebook_details/${notebookId}`;
        console.log("endpoint:\n\n", endpoint);
        
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
            
        if (response.status !== 200) {
            console.log("Error response:\n\n", response);
            return NextResponse.json({ error: `HTTP error! status: ${response.status}` }, { status: response.status });
        }
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
        
    } catch (error) {
        console.error('Error fetching notebook details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notebook details' },
            { status: 500 }
        );
    }
}
