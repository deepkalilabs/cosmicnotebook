'use client';

import React, { useState, useEffect } from 'react';

import { useConnectorStore } from '@/app/store';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ConnectorsButton } from '@/components/connectors/ConnectorsButton';
import { getApiUrl } from '@/app/lib/config';
const ConnectorsAdmin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);


  const { connectors, setConnectors } = useConnectorStore();

  useEffect(() => {
    fetchConnectors();
    console.log('Connectors:', connectors);
  }, []);

  const fetchConnectors = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('connectors')
        .select('*');
      
      if (error) throw error;
      setConnectors(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch connectors",
        variant: "destructive"
      });
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

  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Connectors Administration</h1>
        <ConnectorsButton onHandleCreateConnector={handleCreateConnector} />
        
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      
      </div>
    </div>
  );
};

export default ConnectorsAdmin;
