import { NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/app/lib/config"

export async function GET(
    req: NextRequest
) {
    try {
        const notebookId = req.nextUrl.pathname.split('/').pop();
        console.log("Notebook ID in logging API", notebookId)

        const response = await fetch(`${getApiUrl()}/logging/deployments/get/${notebookId}`)
        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Logs in API", data)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching deployment logs:', error)
        return NextResponse.json(
            { error: 'Failed to fetch deployment logs' },
            { status: 500 }
        )
    }
} 
