'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useOrgUserStore, useUserStore } from "@/app/store";
import { Skeleton } from "@/components/ui/skeleton";
import { IntegrationsButton } from "@/components/integrations/IntegrationsButton";
import { useToast } from "@/hooks/use-toast";
import { ConnectorCredentialsList } from "@/app/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet";
  import { marked } from 'marked';
  import CodeBlock from '@/components/CodeBlock';
  import { Pencil, Trash2, Eye, EyeOff, Copy, CheckCircle2, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function NotebookIntegrations() {
    const { user } = useUserStore();

    const params = useParams();
    const notebookId = params.id as string;
    const userId = user?.id || '';
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { orgUsers } = useOrgUserStore();
    const [connectors, setConnectors] = useState<ConnectorCredentialsList>({ credentials: [] });
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedDocstring, setSelectedDocstring] = useState<string>("");
    const [selectedCode, setSelectedCode] = useState<string>("");
    const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({});
    const [ copiedStates, setCopiedStates ] = useState<Record<string, boolean>>({});
    const orgId = orgUsers[0]?.org_id;

    useEffect(() => {
        if (userId && notebookId && orgUsers && orgUsers.length > 0) {
            console.log('Fetching connectors for org:', orgUsers[0].org_id);
            fetchConnectors(orgUsers[0].org_id);
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [userId, notebookId, orgUsers]);



    //TODO: Only enable one connector type at a time.
    const handleCreateConnector = async (type: string, credentials: Record<string, string | number | boolean>) => {
        console.log('Creating connector', type, credentials);

        const response = await fetch(`/api/connectors/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'user_id': userId, 'org_id': orgId, 'type': type, 'credentials': credentials, 'notebook_id': notebookId })
        });

        console.log('Create connector response:', response);
        const resp = await response.json()


        if (resp.status != 200) {
            toast({
                title: "Error",
                description: "Failed to create connector",
                variant: "destructive",
            });
            console.error('Failed to create connector', response);
            return;
        }

        console.log("Connector: ", resp.data);

        setConnectors(prev => ({
            ...prev,
            credentials: [...prev.credentials, resp.data]
        }));

        //If the connector is created successfully, open the doc dialog
        //If the connector is created successfully, open the doc dialog
        if (resp.status === 200) {
            setTimeout(() => {
                console.log('Opening doc dialog', resp.data);
                handleShowDocs(resp.data.doc_string, resp.data.code_string);
            }, 2000);

            toast({
                title: "Success",
                description: "Connector created",
                variant: "default"
            });    
        }

        return resp;
    };

    //TODO: This is a temporary fetch to get the connectors. Change to use the API endpoint in the backend.
    const fetchConnectors = async (orgId: string) => {
        try {
            const response = await fetch(`/api/connectors/all/${orgId}`)
              
            console.log('Fetch connectors response:', response);

            if (response.status !== 200) {
                console.warn('Error fetching connectors:', response.statusText);
                return;
            }

            const data = await response.json();

            if (data.status !== 200) {
                console.warn('Error fetching connectors:', data);
                return;
            }

            const connectors = JSON.parse(data.data.body);
            setConnectors(connectors || []);
            } catch (error) {
                console.warn('Error fetching connectors:', error);
            } finally {
                setIsLoading(false);
            }
    };

    const handleDeleteConnector = async (connectorId: string) => {
        try {
        setIsLoading(true);
        const response = await fetch(`/api/connectors/delete`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ connectorId })
        });

        const data = await response.json();
        console.log('Delete connector response:', data);
        if (data.status !== 200) {
            toast({
            title: "Error",
            description: "Failed to delete connector",
            variant: "destructive",
            });
            console.warn('Failed to delete connector', data);
            setIsLoading(false);
            return; 
        }

        console.log('Delete connector response:', data);
        setConnectors(prev => ({
            ...prev,
            credentials: prev.credentials.filter((connector) => connector.id !== connectorId)
        }));

        toast({
            title: "Success",
            description: "Connector deleted successfully",
        });
        } catch (error) {
        console.warn('Error deleting connector:', error);
        toast({
            title: "Error",
            description: "Failed to delete connector",
            variant: "destructive",
        });
        } finally {
        setIsLoading(false);
        }
    };

    const toggleCredentialsVisibility = (connectorId: string) => {
        setShowCredentials(prev => ({
            ...prev,
            [connectorId]: !prev[connectorId]
        }));
    };

    const handleCopyCredentials = (credentials: JSON) => {
        const credentialsString = JSON.stringify(credentials, null, 2);
        navigator.clipboard.writeText(credentialsString).then(() => {
        toast({
            title: "Copied",
            description: "Credentials copied to clipboard",
        });
        }).catch((error) => {
        console.error('Failed to copy credentials:', error);
        setCopiedStates(prev => ({
            ...prev,
            [connectors.credentials[0].id]: false
        }));
        toast({
            title: "Error",
            description: "Failed to copy credentials",
            variant: "destructive",
        });
        });
    };

    const handleShowDocs = (docstring: string, code: string) => {
        setSelectedDocstring(docstring);
        setSelectedCode(code);
        setIsSheetOpen(true);
    };

    const handleEdit = (connectorId: string) => {
        // TODO: Implement edit functionality
        console.log('Edit connector:', connectorId);
    };

    const handleDelete = (connectorId: string) => {
        handleDeleteConnector(connectorId);
    };

    console.log("Connectors: ", connectors);

    return isLoading ? (
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
            <div className="flex flex-row justify-between items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Data Connectors and Secrets</h1>
                <IntegrationsButton onHandleCreateConnector={handleCreateConnector} />
            </div>
            <div>
                <p className="text-muted-foreground">
                    Store your credentials securely and encrypted on AWS Secrets Manager.
                    Pull data from data connectors to use in your notebook. 
                </p>
            </div>
            <div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/4">Type</TableHead>
                                <TableHead className="w-2/4">Credentials</TableHead>
                                <TableHead className="w-1/4">Actions</TableHead>
                                <TableHead className="w-1/4">Docs</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {connectors.credentials.map((connector, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {connector?.connector_type}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleCredentialsVisibility(connector?.id)}
                                                aria-label={showCredentials[connector?.id] ? "Hide credentials" : "Show credentials"}
                                            >
                                                {showCredentials[connector?.id] ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>

                                            <div className="flex-1 flex items-center gap-2 overflow-y-auto">
                                                <code className="font-mono text-sm truncate max-w-md">
                                                    {showCredentials[connector?.id]
                                                        ? JSON.stringify(connector?.credentials)
                                                        : '••••••••'}
                                                </code>
                                                
                                                {showCredentials[connector?.id] && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleCopyCredentials(connector?.credentials)}
                                                        aria-label="Copy credentials"
                                                    >
                                                        {copiedStates[connector?.id] ? (
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleEdit(connector?.id)}
                                            >
                                                <Pencil className="h-2 w-2" />
                                            </Button>
                                            <Button 
                                                variant="ghost"
                                                onClick={() => handleDelete(connector?.id)}
                                                className="flex items-center text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleShowDocs(connector?.doc_string, connector?.code_string)}>
                                            <BookOpen className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent  className="overflow-y-auto w-1/2 hover:max-w-[80%] transition-all duration-300" side="right">
                    <SheetHeader>
                    <SheetTitle>Connector Documentation</SheetTitle>
                    <SheetDescription>View and copy connector details</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 space-y-6 pb-8">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Docstring</h2>
                        <div 
                        className="prose prose-sm max-w-none bg-white p-6 rounded border min-h-[300px] max-h-[600px] overflow-y-auto"
                        dangerouslySetInnerHTML={{ 
                            __html: marked.parse(selectedDocstring || '') 
                        }}
                        />
                    </div>
                        
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Code</h2>
                    <button
                        onClick={() => {
                        navigator.clipboard.writeText(selectedCode);
                        toast({
                            title: "Copied",
                            description: "Code copied to clipboard",
                        });
                        }}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        title="Copy code"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    </div>

                    <CodeBlock code={selectedCode} />
                        </div>
                    </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
