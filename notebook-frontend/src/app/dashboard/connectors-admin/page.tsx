'use client';

import React, { useState, useEffect } from 'react';

import { useConnectorStore } from '@/app/store';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ConnectorsButton } from '@/components/connectors/ConnectorsButton';
import { useOrgUserStore } from '@/app/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ConnectorsAdmin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCredentials, setVisibleCredentials] = useState<string[]>([]);
  const { orgUsers } = useOrgUserStore();
  const { connectors, setConnectors } = useConnectorStore();

  useEffect(() => {
    if (orgUsers && orgUsers.length > 0) {
      console.log('Fetching connectors for org:', orgUsers[0].org_id);
      fetchConnectors(orgUsers[0].org_id);
    }
  }, [orgUsers]);

  useEffect(() => {
    console.log('Connectors:', connectors);
  }, [connectors]);


  //TODO: This is a temporary fetch to get the connectors. Change to use the API endpoint in the backend.
  const fetchConnectors = async (orgId: string) => {
    try {
      const { data, error } = await supabase
        .from('connector_credentials')
        .select('*')
        .eq('org_id', orgId);  

      if (error) {
        console.error('Supabase error:', error.message);
        return;
      }

      console.log('Query successful, data:', data);
      setConnectors(data || []);
    } catch (error) {
      console.warn('Error fetching connectors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateConnector = async (type: string, credentials: Record<string, string | number | boolean>, userId: string, orgId: string) => {
    console.log('Creating connector', type, credentials, userId, orgId);

    const response = await fetch(`/api/connectors/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, orgId, type, credentials })
    });

    const data = await response.json();
    return data;
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
      setConnectors(connectors.filter(connector => connector.id !== connectorId));

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

  const toggleCredentials = (connectorId: string) => {
    setVisibleCredentials(prev => 
      prev.includes(connectorId) 
        ? prev.filter(id => id !== connectorId)
        : [...prev, connectorId]
    );
  };

  const handleCopyCredentials = (credentials: any) => {
    const credentialsString = JSON.stringify(credentials, null, 2);
    navigator.clipboard.writeText(credentialsString).then(() => {
      toast({
        title: "Copied",
        description: "Credentials copied to clipboard",
      });
    }).catch((error) => {
      console.error('Failed to copy credentials:', error);
      toast({
        title: "Error",
        description: "Failed to copy credentials",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Connectors Administration</h1>
        <ConnectorsButton onHandleCreateConnector={handleCreateConnector} setConnectors={setConnectors}/>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Credentials</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connectors.map((connector) => (
              <TableRow key={connector.id}>
                <TableCell className="font-medium capitalize">
                  {connector.connector_type}
                </TableCell>
                <TableCell>
                  {new Date(connector?.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {visibleCredentials.includes(connector.id) ? (
                    <div className="flex items-start gap-2">
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(connector.credentials, null, 2)}
                      </pre>
                      <button
                        onClick={() => handleCopyCredentials(connector.credentials)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="Copy credentials"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <span>•••••••</span>
                  )}
                  <button
                    onClick={() => toggleCredentials(connector.id)}
                    className="ml-2 p-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    {visibleCredentials.includes(connector.id) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDeleteConnector(connector.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ConnectorsAdmin;
