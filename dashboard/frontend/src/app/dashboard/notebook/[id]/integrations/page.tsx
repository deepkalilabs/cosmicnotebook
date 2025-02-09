'use client'

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store";
import { Skeleton } from "@/components/ui/skeleton";
import { IntegrationsButton } from "@/components/integrations/IntegrationsButton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface IntegrationProps {
    id: string;
    org_id: string;
    notebook_id: string;
    type: string;
    is_tested: boolean;
    credentials: Record<string, string | number | boolean>;
    created_at: string | null;
    updated_at: string | null;
}
// #TODO: Check if the notebook is deployed. Then show the integrations.
export default function NotebookIntegrations() {
    const { user } = useUserStore();
    const { toast } = useToast();

    const params = useParams();
    const searchParams = useSearchParams();
    const notebookId = params.id as string;
    const name = searchParams.get('name') || '';
    const userId = user?.id || '';
    const [ loading, setLoading ] = useState(false);
    const [integrations, setIntegrations] = useState<IntegrationProps[]>([]);
    const [selectedIntegration, setSelectedIntegration] = useState<IntegrationProps | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const getIcon = (type: string) => {
        try {
            return `https://img.logo.dev/${type}.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true` || '/fallback-icon.png';
        } catch (error) {
            console.warn('Error loading image:', error);
            return '/fallback-icon.png'; // Make sure to have a fallback icon in your public directory
        }
    };

    useEffect(() => {
        if (userId && notebookId) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [userId, notebookId]);


    //TODO: Get and load the integrations.
    useEffect(() => {
        const getIntegrations = async () => {
            const response = await fetch(`/api/integrations/getAll`, {
                method: 'POST',
                body: JSON.stringify({ notebookId })
            });

            const data = await response.json();
            console.log("Integrations", data);
            setIntegrations(data || []);
        }

        getIntegrations();
    }, [notebookId]);

    

    const handleCreateIntegration = async (orgId: string, notebookId: string, integration: string, credentials: Record<string, string | number | boolean>) => {
        console.log("Deploying integration", orgId, notebookId, integration, credentials);
        const response = await fetch(`/api/integrations/create`, {
            method: 'POST',
            body: JSON.stringify({ orgId, notebookId, integration, credentials })
        });

        console.log("Response", response);
        const data = await response.json();
        console.log("New integration data:", data);
        
        if (response.status === 200) {
            setIntegrations(prevIntegrations => {
                console.log("Previous integrations:", prevIntegrations);   
                const newIntegrations = [...prevIntegrations, data];
                console.log("New integrations array:", newIntegrations);
                return newIntegrations;
            });
            
            toast({
                title: "Integration created",
                description: "Integration was successfully created",
            });
        } else {
            toast({
                title: "Error creating integration",
                description: "Failed to create integration",
                variant: "destructive",
            });
        }
        
        return data;
    }


    const handleDeleteIntegration = async (integrationId: string) => {
        console.log("Deleting integration", integrationId);
        const response = await fetch(`/api/integrations/delete`, {
            method: 'POST',
            body: JSON.stringify({ integrationId })
        });

        const data = await response.json();
        console.log("Integration deleted", data);
        return data;
    }

    const handleTestConnection = async (id: string, is_tested: boolean) => {
        console.log("Testing connection", id);

        const response = await fetch(`/api/integrations/isTested`, {
            method: 'POST',
            body: JSON.stringify({ id, is_tested })
        });

        const data = await response.json();
        console.log("Connection tested", data)

        if (data.status === 200) {
            toast({
                title: "Connection tested",
                description: "Connection tested successfully",
            });
           
        } else {
            toast({
                title: "Connection failed",
                description: "Connection failed to test",
                variant: "destructive",
            });
        }
        return data;
    }   

    const sendFirstSlackMessage = async (integration: IntegrationProps) => {
        console.log("Sending first Slack message", integration);
        const response = await fetch(`/api/integrations/sendFirstMessage`, {
            method: 'POST',
            body: JSON.stringify({ credentials: integration.credentials })
        });

        const data = await response.json();
        console.log("First Slack message sent", data);
        return data;
    }

    const onHandleTestConnection = async (integration: IntegrationProps) => {
        const testConnectionResponse = await handleTestConnection(
            integration.id, 
            integration.is_tested
        );

        if (testConnectionResponse.status === 200) {
            setIntegrations(prevState => prevState.map(item => 
                item.id === integration.id 
                    ? { ...item, is_tested: !item.is_tested } 
                    : item
            ));
            
            const res = await sendFirstSlackMessage(integration);
            console.log("First Slack message sent", res);

            if (res.ok) {
                toast({
                    title: "First Slack message sent",
                    description: "First Slack message sent successfully",
                });
            } else {
                toast({
                    title: "First Slack message failed",
                    description: "First Slack message failed to send",
                    variant: "destructive",
                });
            }
        }
        return
    }

    // #TODO: Trigger the poll.
    /*
    const triggerPoll = async (integration: IntegrationProps) => {
        console.log("Triggering poll", integration);
        const response = await fetch(`/api/integrations/poll`, {
            method: 'POST',
            body: JSON.stringify({ integration })
        });

        const data = await response.json();
        console.log("Poll triggered", data);
    }*/

    useEffect(() => {
        console.log("Integrations updated:", integrations);
    }, [integrations]);
    
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
                    <div className="flex justify-end">
                        <IntegrationsButton notebookId={notebookId} onHandleCreateIntegration={handleCreateIntegration} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
                <h2 className="text-lg font-medium">Created Integrations</h2>
            </div>
            {integrations?.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {integrations?.map((integration: IntegrationProps, index: number) => (
                        <Card 
                            key={index}
                            className="cursor-pointer hover:bg-accent/50 transition-colors w-1/4 relative group"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteIntegration(integration.id).then(() => {
                                        setIntegrations(prevState => 
                                            prevState.filter(item => item.id !== integration.id)
                                        );
                                        toast({
                                            title: "Integration deleted",
                                            description: "Integration was successfully deleted",
                                        });
                                    });
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-destructive"
                                >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                            </Button>
                            <CardContent className="p-3">
                                <div className="flex flex-col gap-2">
                                    <div 
                                        className="flex items-center gap-2"
                                        onClick={() => {
                                            setSelectedIntegration(integration);
                                            setSheetOpen(true);
                                        }}
                                    >
                                        <div className="p-1.5 bg-accent rounded-md">
                                            <Image src={getIcon(integration.type)} alt={integration.type} width={20} height={20} onError={(e) => {
                                                console.error('Error loading image:', e);
                                                e.currentTarget.src = '/fallback-image.png';
                                            }} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{integration.type}</span>
                                            <span className="text-xs text-muted-foreground">
                                                created: {integration.created_at ? new Date(integration.created_at).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    {integration.is_tested ? (
                                        <div className="flex items-center gap-2 w-full mt-2 text-sm text-green-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Connected
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2 bg-background/50 hover:bg-accent/80 transition-all duration-200 
                                                       border border-border/50 hover:border-border/80 shadow-sm 
                                                       font-medium text-xs tracking-wide"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onHandleTestConnection(integration);
                                            }}
                                        >
                                            Test Connection 
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="sm:max-w-[400px]">
                    <SheetHeader className="pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent rounded-lg">
                                <Image 
                                    src={selectedIntegration ? getIcon(selectedIntegration.type) : '/fallback-icon.png'} 
                                    alt={selectedIntegration?.type || 'Integration'} 
                                    width={24} 
                                    height={24} 
                                />
                            </div>
                            <SheetTitle className="text-xl">{selectedIntegration?.type}</SheetTitle>
                        </div>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium uppercase text-muted-foreground tracking-wider">Integration Details</h3>
                            <div className="grid gap-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-muted-foreground">Type</span>
                                    <span className="font-medium">{selectedIntegration?.type}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-muted-foreground">Notebook ID</span>
                                    <span className="font-medium font-mono text-xs">{selectedIntegration?.notebook_id}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-muted-foreground">Created</span>
                                    <span className="font-medium">{selectedIntegration?.created_at ? 
                                        new Date(selectedIntegration.created_at).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-muted-foreground">Updated</span>
                                    <span className="font-medium">{selectedIntegration?.updated_at ? 
                                        new Date(selectedIntegration.updated_at).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {selectedIntegration?.credentials && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium uppercase text-muted-foreground tracking-wider">Credentials</h3>
                                <div className="grid gap-3 text-sm">
                                    {Object.entries(selectedIntegration.credentials).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center py-2 border-b group">
                                            <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium font-mono max-w-[200px] truncate">
                                                    {String(value)}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(String(value));
                                                        toast({
                                                            description: "Copied to clipboard",
                                                        });
                                                    }}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

