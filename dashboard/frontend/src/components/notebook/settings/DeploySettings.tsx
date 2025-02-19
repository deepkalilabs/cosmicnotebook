'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useContext, useState } from "react";
import DeploymentDialog from "../DeploymentDialog";
import { WebsocketContext } from "@/contexts/websocket-context-provider";
import { Copy, Check, ExternalLink, Loader2, Cloud } from "lucide-react";
import { useNotebookDetailStore } from "@/app/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotebookDetails } from "@/app/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

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
    // const [ buildLogs, setBuildLogs ] = useState<string[]>([]);
    const buildLogs: string[] = [];
    const [ curlSupport, setCurlSupport ] = useState(false);
    const router = useRouter();

    const DeployButton = () => {
        return (
            <Button
                variant="default" 
                disabled={isDeploying}
                onClick={() => {
                handleDeploy()
                setIsDeploying(true)
            }}
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
    )}

    const handleDeploy = useCallback(async () => {
        if (!notebookDetails) return;

        deployLambda(
            notebookDetails.user_id,
            notebookDetails.name,
            notebookDetails.id
        )
    }, [deployLambda, notebookDetails]);

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
                        {notebookDetails.submit_endpoint && notebookDetails.submit_endpoint.length > 0 ? (
                            <div>
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
                                    className="ml-2 p-4"
                                >
                                    <ExternalLink />
                                </Button>
                            </div>
                            
                        ) : (
                            <span>Notebook not deployed.</span>
                        )}
                    </div>
                    <DeployButton />
                    </div>
                </CardContent>
                </Card>

                    <Card className="mt-4">
                    <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Build Logs</CardTitle>
                                    <CardDescription>
                                        <br />
                                        View the build and deployment logs for your notebook
                                    </CardDescription>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">View Full Logs</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Build Logs</DialogTitle>
                                            <DialogDescription>
                                                Detailed logs from the build and deployment process
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
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
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>                       
                        <CardContent>
                            <div className="mt-4">
                                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                    {buildLogs.length > 0 ? (
                                        buildLogs.slice(-5).map((log, index) => (
                                            <div key={index} className="font-mono text-sm">
                                                {log}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground">No build logs available</p>
                                    )}
                                </ScrollArea>
                            </div>
                        </CardContent>
                    </Card>
            </div>

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
    )
}