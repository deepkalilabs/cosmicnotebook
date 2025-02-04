'use client'

import { NotebookDetails, OutputDeployMessage } from "@/app/types";
import { DeployButton } from "@/components/notebook/settings/DeployButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotebookConnection } from "@/hooks/useNotebookConnection";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

//TODO: Show URL for the API when deployed
//TODO: Do we change url when we redeploy?
export default function NotebookDeployment() {
    const { user } = useUserStore();

    const params = useParams();
    const searchParams = useSearchParams();
    const notebookId = params.id as string;
    const name = searchParams.get('name') || '';
    const userId = user?.id || '';
    const [ isDeploying, setIsDeploying ] = useState(false);
    const [ deploymentData, setDeploymentData] = useState<OutputDeployMessage>({} as OutputDeployMessage);
    const [ loading, setLoading ] = useState(false);
    const [buildLogs, setBuildLogs] = useState<string[]>([]);
    const [apiCallLogs, setApiCallLogs] = useState<Array<{
        timestamp: string;
        method: string;
        path: string;
        status: number;
        duration: string;
    }>>([]);

    const notebookDetails: NotebookDetails = {
        id: notebookId,
        name: name,
        user_id: userId
    }

    useEffect(() => {
        if (userId && notebookId) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [userId, notebookId]);
    
    const { deployLambda, isConnected } = useNotebookConnection({
        onNotebookDeployed: (data) => {
            console.log(`Received notebook_deployed: ${data.type}, success: ${data.success}, message: ${data.message}`);
            setIsDeploying(true);
            setDeploymentData(data);
            // Simulated build logs - replace with actual logs from backend
            setBuildLogs(prev => [...prev, `[${new Date().toISOString()}] ${data.message}`]);
        },
        notebookDetails: notebookDetails
    });

    const handleDeploy = async () => {
        if (!userId || !notebookId) {
            console.error("No user or notebook id")
            return
        }
        setIsDeploying(true);
        console.log("handle deploying", isDeploying)
        deployLambda(userId, name, notebookId)
    }

    
    return loading ? (
        <div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-[20px] w-full" />
                    <Skeleton className="h-[20px] w-full" />
                    <Skeleton className="h-[20px] w-full" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[20px] w-full" />
                    <Skeleton className="h-[20px] w-full" />
                    <Skeleton className="h-[20px] w-full" />
                </CardContent>
            </Card>
        </div>
    ) : (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Deploy {name}</h1>
                <p className="text-muted-foreground">
                    Configure and deploy your notebook as an API.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <CardTitle>Deployment Settings</CardTitle>
                            <CardDescription>
                                Configure your notebook's deployment settings and monitor its status.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                                isDeploying ? 'bg-yellow-400 animate-pulse' : 
                                deploymentData.success ? 'bg-green-500' : 'bg-red-400'
                            }`} />
                            <p className="text-sm text-muted-foreground">
                                {isDeploying ? 'Deploying...' : 
                                 deploymentData.success ? 'Deployed' : 'Not deployed'}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2 max-w-[60%]">
                            <p className="text-sm text-muted-foreground">
                                {deploymentData.message || 'No deployment information available'}
                            </p>
                        </div>

                        <DeployButton 
                            onDeploy={handleDeploy}
                            disabled={isDeploying}
                            isConnected={isConnected}
                        />
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="build-logs" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="build-logs">Build Logs</TabsTrigger>
                    <TabsTrigger value="api-logs">API Logs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="build-logs" className="mt-4">
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        {buildLogs.length > 0 ? (
                            buildLogs.map((log, index) => (
                                <div key={index} className="font-mono text-sm">
                                    {log}
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No build logs available</p>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="api-logs" className="mt-4">
                    <ScrollArea className="h-[300px] w-full rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2 text-left">Timestamp</th>
                                    <th className="p-2 text-left">Method</th>
                                    <th className="p-2 text-left">Path</th>
                                    <th className="p-2 text-left">Status</th>
                                    <th className="p-2 text-left">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiCallLogs.length > 0 ? (
                                    apiCallLogs.map((log, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">{log.timestamp}</td>
                                            <td className="p-2">{log.method}</td>
                                            <td className="p-2">{log.path}</td>
                                            <td className="p-2">{log.status}</td>
                                            <td className="p-2">{log.duration}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                            No API calls recorded
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
}