'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useContext, useState, useEffect } from "react";
import DeploymentDialog from "../DeploymentDialog";
import { WebsocketContext } from "@/contexts/websocket-context-provider";
import { Copy, Check, ExternalLink, Loader2, Cloud } from "lucide-react";
import { useNotebookDetailStore } from "@/app/store";
import { NotebookDetails } from "@/app/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useDeploymentLogs } from '@/hooks/useDeploymentLogs';
import DeploymentLogs from "../logging/DeploymentLogs";

const CurlSupportDialog = ({notebookDetails, curlSupport, setCurlSupport}: {notebookDetails: NotebookDetails, curlSupport: boolean, setCurlSupport: (curlSupport: boolean) => void}) => {
    const [ copied, setCopied ] = useState(false);
    
    
    const curlCommand = `curl -X POST  \\
        -H "Content-Type: application/json" \\
        -d '{"param1": "value1", "param2": "value2"}' \\
        ${notebookDetails.submit_endpoint}`

    return (
        <Dialog open={curlSupport} onOpenChange={setCurlSupport}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>API Usage Example</DialogTitle>
                    <DialogDescription>
                        Use this curl command to test your deployed API endpoint
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-secondary/50 p-4 rounded-md flex items-center justify-between">
                    <pre className="whitespace-pre-wrap break-all font-mono text-sm">
                        {curlCommand}
                    </pre>
                    <Button
                        onClick={() => {
                            setCopied(true);
                            navigator.clipboard.writeText(curlCommand);
                        }}
                        size="sm"
                        variant="ghost"
                        className="ml-2 h-8"
                    >
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}   

export default function DeploySettings() {
    const { deployLambda } = useContext(WebsocketContext);
    const [ isDeploying, setIsDeploying ] = useState(false);
    const { notebookDetails } = useNotebookDetailStore();
    const { logs, isLoading, error, clearLogs, fetchLogs } = useDeploymentLogs(
        notebookDetails?.id ?? '',
        isDeploying
    );
    const [ curlSupport, setCurlSupport ] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (notebookDetails?.id) {
            fetchLogs();
        }
    }, [notebookDetails?.id])

<<<<<<< HEAD
  

=======
>>>>>>> 83a9420 (deployment logs)
    const handleDeploy = useCallback(async () => {
        if (!notebookDetails) return;
        
        clearLogs();
        setIsDeploying(true);
        
        deployLambda(
            notebookDetails.user_id,
            notebookDetails.name,
            notebookDetails.id
        );
    }, [deployLambda, notebookDetails, clearLogs]);

    if (!notebookDetails) return <div>Loading...</div>;

    return (
        <div>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Deploy {notebookDetails.name}</h1>
                    <p className="text-muted-foreground">
                        Deploy your notebook as an API.
                    </p>
                </div>
                
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <CardTitle>Deployment Settings</CardTitle>
                                <CardDescription>
                                    Configure your deployment settings and monitor the status of your API.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    isDeploying ? 'bg-yellow-400 animate-pulse' : 
                                    notebookDetails.submit_endpoint ? 'bg-green-500' : 'bg-red-400'
                                }`} />
                                <p className="text-sm text-muted-foreground">
                                    {isDeploying ? 'Deploying...' : 
                                    notebookDetails.submit_endpoint ? 'Deployed' : 'Not deployed'}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="max-w-[60%] text-sm text-muted-foreground">
                                {notebookDetails.submit_endpoint ? (
                                    <div className="flex items-center gap-2">
                                        <span>Deployed to: </span>
                                        <span className="text-black">
                                            {notebookDetails.submit_endpoint}
                                        </span>
                                        <Button 
                                            variant="default" 
                                            size="icon"
                                            onClick={() => {
                                                setCurlSupport(true);
                                            }}
                                        >
                                            <ExternalLink />
                                        </Button>
                                    </div>
                                ) : (
                                    <span>No deployment information available.</span>
                                )}
                            </div>
                            <Button
                                variant="default" 
                                disabled={isDeploying}
                                onClick={handleDeploy}
                            >
                                {isDeploying ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Deploying...
                                    </>
                                ) : (
                                    <>
                                        <Cloud className="h-4 w-4" />
                                        Deploy to AWS
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <DeploymentLogs 
                    logs={logs}
                    isLoading={isLoading}
                    error={error}
                />

                <div className="flex gap-4 mt-8">
                    <Card className="flex-1 hover:bg-secondary/50 cursor-pointer transition-colors" 
                        onClick={() => router.push(`${window.location.pathname.split('/deployment')[0]}/integrations${window.location.search}`)}>
                        <CardHeader>
                            <CardTitle>Integrations</CardTitle>
                            <CardDescription>   
                                Support additional integrations with your deployed API.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="flex-1 hover:bg-secondary/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`${window.location.pathname.split('/deployment')[0]}/jobs${window.location.search}`)}>
                        <CardHeader>
                            <CardTitle>Jobs & Monitoring</CardTitle>
                            <CardDescription>
                                Check the status of requests you have made to your deployed API.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="flex-1 hover:bg-secondary/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`${window.location.pathname.split('/deployment')[0]}/schedules${window.location.search}`)}>
                        <CardHeader>
                            <CardTitle>Scheduling</CardTitle>
                            <CardDescription>
                                Schedule your API to run at a specific time.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {isDeploying && (
                    <DeploymentDialog
                        isDeploying={isDeploying}
                        setIsDeploying={setIsDeploying}
                    />
                )}

                {curlSupport && notebookDetails.submit_endpoint && (
                    <CurlSupportDialog
                        notebookDetails={notebookDetails}
                        curlSupport={curlSupport}
                        setCurlSupport={setCurlSupport}
                    />
                )}
            </div>
        </div>
    )
}