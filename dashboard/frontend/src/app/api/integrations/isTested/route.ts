import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from  '@/app/lib/config';

interface IntegrationRequest {
  id: string;
  is_tested: boolean;
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body = await request.json() as IntegrationRequest;
    console.log("Received request body:", body);

    const { id, is_tested } = body;

    // Validate required fields
    const missingFields = [];
    if (!id) missingFields.push('id');
    if (is_tested === undefined) missingFields.push('is_tested');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missingFields 
        },
        { status: 400 }
      );
    }
    debugger;

    console.log("Sending request to:", `${getApiUrl()}/integrations/is_tested/`);
    const response = await fetch(`${getApiUrl()}/integrations/is_tested/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, is_tested })
    });
    console.log("Response from integrations/is_tested:", response);

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to update is_tested' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      data,
      status: response.status,
      error: null
    });

  } catch (error) {
    console.warn('Error updating integration is_tested status:', error);
    return NextResponse.json(
      { 
        data: null,
        status: 500,
        error: {
          message: 'Failed to update integration test status',
          details: error instanceof Error ? error.message : String(error)
        }
      },
      { status: 500 }
    );
  }
}
