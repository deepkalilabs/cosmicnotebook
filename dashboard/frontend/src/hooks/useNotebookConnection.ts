// hooks/useNotebookConnection.ts
'use client';

import { useEffect, useMemo, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { OutputDeployMessage, NotebookConnectionProps } from '@/app/types';
import { getWebsocketUrl } from '@/app/lib/config';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/app/store';

// Extend react-use-websocket types to include headers
declare module "react-use-websocket" {
  interface Options {
    headers?: Record<string, string>;
  }
}


export const useNotebookConnection = ({
  onNotebookDeployed, 
  notebookDetails,
}: NotebookConnectionProps) => {

  const notebookId = notebookDetails?.id
  const notebookName = notebookDetails?.name
  const userId = notebookDetails?.user_id
  const toast = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useUserStore.getState();
  const socketUrl = useMemo(() => {
    const socketBaseURL = getWebsocketUrl();
  
    if (notebookId) {
      if (process.env.NODE_ENV === 'development') {
        return `${socketBaseURL}/${notebookId}/${notebookName}`;
      } else {
        return `${socketBaseURL}/${notebookId}/${notebookName}`;
      }
    } else {
      return null;
    }
  }, [notebookDetails?.id]);
  

  console.log("notebookId", notebookId)
  console.log("notebookName", notebookName)
  console.log("userId", userId)

  console.log("socketURL", socketUrl)

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, {
    headers: user?.token ? {
      'Authorization': `Bearer ${user?.token}`,
    } : {},
    onOpen: () => {
      setIsConnected(true)
      toast.toast({
        title: "Connected to notebook",
        description: "You can now deploy your notebook",
      })
    },
    onClose: () => {
      setIsConnected(false)
      toast.toast({
        title: "Disconnected from notebook",
        description: "You can now deploy your notebook",
      })
    },
    onError: (event) => {
      setIsConnected(false)
      toast.toast({
        title: "Error connecting to notebook",
        description: "Please try again",
      })
      console.error("WebSocket error:", event);
    },
    shouldReconnect: () => {
      setIsConnected(false)
      toast.toast({
        title: "Reconnecting to notebook",
        description: "Please wait...",
      })
      return true;
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    share: true,
    retryOnError: true
  });
  

  useEffect(() => {
    if (!lastMessage?.data) return;
    
    try {
      const data = JSON.parse(lastMessage.data);
      if (data.type === 'deploying_notebook') {
        onNotebookDeployed?.(data as OutputDeployMessage);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }, [lastMessage, onNotebookDeployed]);


  const deployLambda = (user_id: string, name: string, notebook_id: string) => {
    if (!isConnected) {
      toast.toast({
        title: "Not connected to notebook",
        description: "This is an error on our end. Please try again later.",
      })
      return;
    }

    const message = {
      type: 'deploy_notebook',
      user_id,
      notebook_name: name,
      notebook_id
    };

    try {
      sendMessage(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    deployLambda,
    isConnected,
    connectionStatus: {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Connected',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Disconnected',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState]
  };
}