import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from  '@/app/lib/config';

interface IntegrationRequest {
  orgId: string;
  notebookId: string;
  integration: string;
  credentials: Record<string, string | number | boolean>;
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body = await request.json() as IntegrationRequest;
    console.log("Received request body:", body);

    const { orgId, notebookId, integration, credentials } = body;

    // Validate required fields
    const missingFields = [];
    if (!orgId) missingFields.push('orgId');
    if (!notebookId) missingFields.push('notebookId');
    if (!integration) missingFields.push('integration');
    if (!credentials) missingFields.push('credentials');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missingFields 
        },
        { status: 400 }
      );
    }

    // Transform the data to match backend expectations
    const backendData = {
      org_id: orgId,
      notebook_id: notebookId,
      integration_type: integration,
      credentials: credentials
    };

    console.log("Sending request to:", `${getApiUrl()}/integrations/create`);
    const response = await fetch(`${getApiUrl()}/integrations/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
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
