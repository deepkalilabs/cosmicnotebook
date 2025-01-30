'use client'

import { NotebookDetails, OutputDeployMessage } from "@/app/types";
import { DeployButton } from "@/components/notebook/settings/DeployButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotebookConnection } from "@/hooks/useNotebookConnection";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Deploy {name} notebook</CardTitle>
                    <CardDescription>
                        Configure and deploy your notebook as a web application.
                    </CardDescription>
                </CardHeader>
                <div className="border-t py-2 my-2 mt-2"></div>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between"> 
                        <div>
                            <h4 className="font-medium">Deployment Status</h4>
                            <p className="text-sm text-muted-foreground">Not deployed</p>
                        </div>
                        <DeployButton 
                            onDeploy={handleDeploy}
                            disabled={isDeploying}
                            isConnected={isConnected}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}