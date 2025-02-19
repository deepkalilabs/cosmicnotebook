import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const notebookId = searchParams.get('notebookId')

    if (!notebookId) {
      return NextResponse.json(
        { error: 'Missing required parameter: notebookId' },
        { status: 400 }
      )
    }

    const logs = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logging/deployments/get/${notebookId}`)
    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error fetching deployment logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deployment logs' },
      { status: 500 }
    )
  }
}
