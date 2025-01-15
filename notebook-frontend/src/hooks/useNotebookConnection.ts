// hooks/useNotebookConnection.ts
'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { NotebookCell, OutputDeployMessage, NotebookConnectionProps } from '@/app/types';
import { OutputExecutionMessage, OutputSaveMessage, OutputLoadMessage, OutputConnectorCreatedMessage } from '@/app/types';
import { useToast } from '@/hooks/use-toast';
//import { useWebSocketContext } from '@/contexts/WebSocketContext'; May need this later for avoiding multiple connections and reusing the same connection
import { getApiUrl } from '@/app/lib/config';
export function useNotebookConnection({
  onOutput,
  onNotebookLoaded,
  onNotebookSaved,
  onNotebookDeployed,
  onError,
  notebookDetails,
  onConnectorStatus,
  onConnectorCreated,
}: NotebookConnectionProps) {
  const { toast } = useToast();
  const notebookId = notebookDetails?.id
  console.log("notebookDetails", notebookDetails)
  const [isReconnecting, setIsReconnecting] = useState(false);

  // TODO: 1. Prevent multiple connections to the same notebook.
  // TODO: 2. Have a way to re-use the same connection if the same notebook is opened again.
  // TODO: 3. Avoid losing the connection when the user navigates away from the notebook page.
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
      setIsReconnecting(false);
      toast({
        title: "Connected to Python kernel",
        description: "Successfully connected to Python kernel"
      });
    },
    onClose: () => {
      if (!isReconnecting) {
        toast({
          title: "Disconnected from Python kernel",
          description: "Attempting to reconnect..."
        });
      }
    },
    onError: (event) => {
      console.log("WebSocket error:", event);
      onError?.("Failed to connect to Python kernel");
    },
    shouldReconnect: (closeEvent) => {
      console.log("shouldReconnect", closeEvent)
      setIsReconnecting(true);
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
        case "init":
          toast({
            title: "Initializing Kernel. Please wait.",
            description: "Loading kernel."
          });
        case 'output':
          parsedData = data as OutputExecutionMessage;
          console.log(`Received output: ${parsedData.output}, type: ${typeof parsedData.type}, cellId: ${parsedData.cellId}`);
          onOutput?.(parsedData.cellId, parsedData.output);
          break;
        case 'notebook_loaded':
          parsedData = data as OutputLoadMessage;
          console.log(`Received notebook_loaded: ${parsedData.type}, success: ${parsedData.success}, message: ${parsedData.message}`);
          onNotebookLoaded?.(parsedData.cells);
          break;
        case 'notebook_saved':
          parsedData = data as OutputSaveMessage;
          console.log(`Received notebook_saved: ${parsedData.type}, success: ${parsedData.success}, message: ${parsedData.message}`);
          onNotebookSaved?.(parsedData);
          break;
        case 'lambda_generated':
          parsedData = data as OutputDeployMessage;
          console.log(`Received lambda_generated: ${parsedData.type}, success: ${parsedData.success}, message: ${parsedData.message}`);
          onNotebookDeployed?.(parsedData);
          break;
        case 'connector_status':
          console.log("Received connector_status")
          onConnectorStatus?.({success: data.success, message: data.message});
          break;
        case 'connector_created':
          console.log("Received connector_created")
          parsedData = data as OutputConnectorCreatedMessage;
          console.log("Received connector_created in useNotebookConnection", parsedData)
          onConnectorCreated?.(parsedData);
          break;
        case 'error':
          onError?.(data.message);
          break;
      }
    }
  }, [lastMessage]);

  const executeCode = (cellId: string, code: string) => {
    sendMessage(JSON.stringify({
      type: 'execute',
      cellId,
      code
    }));
    onOutput?.(cellId, 'Loading....');
  };

  const saveNotebook = (cells: NotebookCell[], filename: string, notebook_id: string, user_id: string) => {
    sendMessage(JSON.stringify({
      type: 'save_notebook',
      cells: cells,
      filename: filename,
      notebook_id: notebook_id,
      user_id: user_id
    }));
  };

  const loadNotebook = useCallback((filename: string, notebook_id: string, user_id: string) => {
    sendMessage(JSON.stringify({
      type: 'load_notebook',
      filename: filename,
      notebook_id: notebook_id,
      user_id: user_id
    }));
  }, [sendMessage]);


  const restartKernel = useCallback(() => {
    sendMessage(JSON.stringify({
      type: 'restart'
    }));
    return Promise.resolve(); // Returns a promise to match the interface expected by the toolbar
  }, [sendMessage]);

  const deployCode = useCallback((cells: NotebookCell[], user_id: string, name: string, notebook_id: string) => {
    // TODO: Change the default name
    console.log("deployCode", cells.filter((cell) => cell.type === 'code').map((cell) => cell.code).join('\n'))

    sendMessage(JSON.stringify({
      type: 'deploy_lambda',
      all_code: cells.filter((cell) => cell.type === 'code').map((cell) => cell.code).join('\n'),
      user_id: user_id,
      notebook_name: name,
      notebook_id: notebook_id
    }));
  }, [sendMessage]);


  const createConnector = useCallback((connectorType: string, credentials: Record<string, string | number | boolean>, userId: string, notebookId: string) => {
    sendMessage(JSON.stringify({
      type: 'create_connector',
      connector_type: connectorType,
      credentials: credentials,
      user_id: userId,
      notebook_id: notebookId
    }));
  }, [sendMessage]);

  return {
    executeCode,
    saveNotebook,
    loadNotebook,
    restartKernel,
    deployCode,
    createConnector,
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