import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from  '@/app/lib/config';

interface IntegrationRequest {
  notebookId: string;
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body = await request.json() as IntegrationRequest;
    console.log("Received request body:", body);

    const { notebookId } = body;

    // Validate required fields
    const missingFields = [];
    if (!notebookId) missingFields.push('notebookId');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missingFields 
        },
        { status: 400 }
      );
    }

    console.log("Sending request to:", `${getApiUrl()}/integrations/get_all/${notebookId}`);
    const response = await fetch(`${getApiUrl()}/integrations/get_all/${notebookId}`, {
      method: 'GET',
    });
    console.log("Response from integrations/create:", response);

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to create integration' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error creating integration:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
