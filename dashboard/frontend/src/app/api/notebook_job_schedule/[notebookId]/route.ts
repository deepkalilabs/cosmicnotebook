// src/app/api/jobs/schedule/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getApiUrl } from  '@/app/lib/config';


export async function GET(request: NextRequest) {
    const notebookId = request.nextUrl.pathname.split('/').pop();
    const endpoint = `${getApiUrl()}/notebook_job_schedule/${notebookId}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
  console.log("POST request received");
  try {
    const body = await request.json();
    console.log("BODY", body);
    const notebookId = request.nextUrl.pathname.split('/').pop();
    const endpoint = `${getApiUrl()}/notebook_job_schedule/${notebookId}`;
    console.log("endpoint", endpoint);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${getApiUrl()}/notebook_job_schedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("DELETE request received");
    console.log("body", body);
    console.log("request", request.nextUrl.pathname);
    const notebookId = body.notebook_id;
    const scheduleId = body.schedule_id;
    const response = await fetch(`${getApiUrl()}/notebook_job_schedule/${notebookId}/${scheduleId}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}