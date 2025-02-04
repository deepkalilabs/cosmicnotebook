'use client'

import { NotebookDetails, OutputDeployMessage } from "@/app/types";
import { DeployButton } from "@/components/notebook/settings/DeployButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotebookConnection } from "@/hooks/useNotebookConnection";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store";
import { Skeleton } from "@/components/ui/skeleton";
import { IntegrationsButton } from "@/components/integrations/IntegrationsButton";


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
                <CardContent className="space-y-8 pt-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Deployment Settings</h3>
                        <div className="border rounded-lg p-4 bg-muted/5"> 
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                            isDeploying ? 'bg-yellow-400 animate-pulse' : 
                                            deploymentData.success ? 'bg-green-500' : 'bg-gray-400'
                                        }`} />
                                        <p className="text-sm text-muted-foreground">
                                            {isDeploying ? 'Deploying...' : 
                                             deploymentData.success ? 'Deployed' : 'Not deployed'}
                                        </p>
                                    </div>
                                    <DeployButton 
                                        onDeploy={handleDeploy}
                                        disabled={isDeploying}
                                        isConnected={isConnected}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {deploymentData.message || 'No deployment information available'}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Messaging Integration</CardTitle>
                    <CardDescription>
                        Connect your API to messaging platforms to interact with your notebook.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <IntegrationsButton onHandleCreateIntegration={() => {}} />
                </CardContent>
            </Card>
        </div>
    );
}