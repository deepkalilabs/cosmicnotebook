import type { NextRequest } from 'next/server'
import { getApiUrl } from  '@/app/lib/config';

export async function POST(
  req: NextRequest
) {
  try {

    //Get the last part of the path
    const jobId = req.nextUrl.pathname.split('/').pop();
    const endpoint = `${getApiUrl()}/jobs/job_logs/${jobId}`;

    const body = await req.json();
    const notebookId = body.notebook_id;
    const awsLogGroup = body.aws_log_group;
    const awsLogStream = body.aws_log_stream;

    console.log('notebookId:', notebookId);
    console.log('awsLogGroup:', awsLogGroup);
    console.log('awsLogStream:', awsLogStream);

    console.log('in jobs api notebookId:', jobId);
    console.log('endpoint:\n\n', endpoint);
    if (!notebookId) {
      return Response.json({ error: 'Notebook ID is required' }, { status: 400 });
    }

    const req_body = JSON.stringify({
      notebook_id: notebookId,
      aws_log_group: awsLogGroup,
      aws_log_stream: awsLogStream,
    });

    console.log('req_body:', req_body);

    const response = await fetch(endpoint, {
      cache: 'no-store',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: req_body,
    });

    const data = await response.json();

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return Response.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}