// src/app/api/jobs/schedule/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getApiUrl } from  '@/app/lib/config';

export async function GET(request: NextRequest) {
    try {
        const notebookId = request.nextUrl.pathname.split('/').pop();
        const endpoint = `${getApiUrl()}/notebook_details/${notebookId}`;
        console.log("endpoint:\n\n", endpoint);
        
        const response = await fetch(endpoint);
        
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
