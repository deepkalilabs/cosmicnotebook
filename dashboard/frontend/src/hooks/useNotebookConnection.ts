// hooks/useNotebookConnection.ts
'use client';

import { useCallback, useEffect, useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { OutputDeployMessage, NotebookConnectionProps } from '@/app/types';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/app/lib/config';

export function useNotebookConnection({
  onNotebookDeployed, 
  notebookDetails,
}: NotebookConnectionProps) {
  const { toast } = useToast();

  const notebookId = notebookDetails?.id
  const notebookName = notebookDetails?.name
  const userId = notebookDetails?.user_id

  console.log("notebookId", notebookId)
  console.log("notebookName", notebookName)
  console.log("userId", userId)

  const socketUrl = useMemo(() => {
    const socketBaseURL = getApiUrl().split('://')[1];

    if (notebookId) {
      if (process.env.NODE_ENV === 'development') {
        return `ws://${socketBaseURL}/ws/${notebookId}`;
      } else {
        return `wss://${socketBaseURL}/ws/${notebookId}`;
      }
    } else {
      return null;
    }
    
  }, [notebookId]);

  console.log("socketURL", socketUrl)

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      toast({
        title: "Connected to Cosmic Backend",
        description: "Successfully connected to Cosmic Backend"
      });
    },
    onClose: () => {
      toast({
        title: "Disconnected from Cosmic Backend",
        description: "Attempting to reconnect..."
      });
    },
    onError: (event) => {
      console.log("WebSocket error:", event);
      toast({
        title: "Failed to connect to Cosmic Backend",
        description: "Please try again later."
      });
    },
    shouldReconnect: (closeEvent) => {
      console.log("shouldReconnect", closeEvent)
      return true;
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    share: true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      let parsedData = null;
      switch (data.type) {
        case 'deploying_notebook':
          parsedData = data as OutputDeployMessage;
          console.log(`Received deploying_notebook: ${parsedData.type}, success: ${parsedData.success}, message: ${parsedData.message}`);
          onNotebookDeployed?.(parsedData);
          break;
      }
    }
  }, [lastMessage]);

  const deployLambda = useCallback((user_id: string, name: string, notebook_id: string) => {
    console.log("deployLambda", user_id, name, notebook_id)
    sendMessage(JSON.stringify({
      type: 'deploy_notebook',
      user_id: user_id,
      notebook_name: name,
      notebook_id: notebook_id
    }));
  }, [sendMessage]);

  return {
    deployLambda,
    isConnected: readyState === ReadyState.OPEN,
    connectionStatus: {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Connected',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Disconnected',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState]
  };
}