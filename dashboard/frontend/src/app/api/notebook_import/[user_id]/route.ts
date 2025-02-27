// src/app/api/jobs/schedule/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getApiUrl } from  '@/app/lib/config';

export async function POST(request: NextRequest) {
    try {
        const user_id = request.nextUrl.pathname.split('/').pop();
        const endpoint = `${getApiUrl()}/notebook_import/${user_id}`;

        const body = await request.json();
        const { fileName, fileContent } = body;

        console.log("fileName", fileName);
        console.log("endpoint", endpoint);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName, fileContent }),
        });
        
        if (response.status !== 200) {
            console.log("Error response:\n\n", response);
            return NextResponse.json({ error: `HTTP error! status: ${response.status}` }, { status: response.status });
        }
        
        const data = await response.json();
        console.log("data", data);
        return NextResponse.json(data, { status: response.status });
        
    } catch (error) {
        console.error('Error fetching notebook details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notebook details' },
            { status: 500 }
        );
    }
}
