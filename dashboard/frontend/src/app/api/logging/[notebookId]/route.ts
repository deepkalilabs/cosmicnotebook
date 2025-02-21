import { NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/app/lib/config"

export async function POST(
    req: NextRequest
) {
    try {
        const notebookId = req.nextUrl.pathname.split('/').pop();
        console.log("Notebook ID in logging API", notebookId)
        console.log("getApiUrl()", getApiUrl())

        const response = await fetch(`${getApiUrl()}/logging/deployments/get/${notebookId}`)
        console.log("Response from fetch", response)
        if (!response.ok) { 
            console.error("Response not ok", response)
            return response
        }
        const data = await response.json()
        console.log("Logs in API", data)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching deployment logs:', error)
        return error 
    }
} 
