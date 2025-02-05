import { NextRequest, NextResponse } from 'next/server';
import { WebClient } from '@slack/web-api';


interface IntegrationRequest {
   credentials: {
    slackBotToken: string;
    channelId: string;
   }
}

//TODO: In the futuer - support other integrations. Right now only slack is supported.
export async function POST(
  request: NextRequest,
) {
  try {
    const body = await request.json() as IntegrationRequest;
    console.log("Received request body:", body);

    const { credentials } = body;

    // Validate required fields
    const missingFields = [];
    if (!credentials) missingFields.push('credentials');
    if (!credentials?.slackBotToken) missingFields.push('slackBotToken');
    if (!credentials?.channelId) missingFields.push('channelId');

    if (missingFields.length > 0) {
      return NextResponse.json({
        data: null,
        status: 400,
        error: {
          message: 'Missing required fields',
          details: `Required fields missing: ${missingFields.join(', ')}`
        }
      }, { status: 400 });
    }

    const slack = new WebClient(credentials.slackBotToken);
    console.log("Slack client created with channel:", credentials.channelId);
   
    try {
      const result = await slack.chat.postMessage({
        channel: credentials.channelId.trim(), // Ensure no whitespace
        text: "Hello! I'm your new AI assistant. How can I help you today?"
      });

      console.log("Slack message sent", result);
     
      return NextResponse.json(result);
    } catch (error) {
      console.warn('Error sending message:', error);
      return NextResponse.json(
        { 
          error: 'Internal server error', 
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

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
