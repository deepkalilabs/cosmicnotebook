'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store";
import { Skeleton } from "@/components/ui/skeleton";
import { IntegrationsButton } from "@/components/integrations/IntegrationsButton";


export default function NotebookIntegrations() {
    const { user } = useUserStore();

    const params = useParams();
    const searchParams = useSearchParams();
    const notebookId = params.id as string;
    const name = searchParams.get('name') || '';
    const userId = user?.id || '';
    const [ loading, setLoading ] = useState(false);


    useEffect(() => {
        if (userId && notebookId) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [userId, notebookId]);

    const handleCreateIntegration = async (orgId: string, notebookId: string, integration: string, credentials: Record<string, string | number | boolean>) => {
        
        console.log("Deploying integration", orgId, notebookId, integration, credentials);
        const response = await fetch(`/api/integrations/create`, {
            method: 'POST',
            body: JSON.stringify({ orgId, notebookId, integration, credentials })
        });

        const data = await response.json();
        console.log("Integration deployed", data);
        return data;
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
                <h1 className="text-3xl font-bold tracking-tight">Integrations for {name}</h1>
                <p className="text-muted-foreground">
                    Connect your notebook to other platforms to interact with your notebook.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Messaging Integration</CardTitle>
                    <CardDescription>
                        Connect your notebook to other platforms to interact with your notebook.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <IntegrationsButton notebookId={notebookId} onHandleCreateIntegration={handleCreateIntegration} />
                </CardContent>
            </Card>
        </div>
    )
}

