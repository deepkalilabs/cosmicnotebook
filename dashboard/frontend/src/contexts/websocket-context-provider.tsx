import { useState, useCallback, useMemo, createContext } from "react";
import { OutputDeployMessage, NotebookDetails } from "@/app/types";
import { useNotebookConnection } from "@/hooks/useNotebookConnection";

interface WebsocketContextProps {
    deployLambda: (user_id: string, name: string, notebook_id: string) => void;
    isConnected: boolean;
    connectionStatus: string;
    deploymentData: OutputDeployMessage;
}

export const WebsocketContext = createContext<WebsocketContextProps>({} as WebsocketContextProps);

export function WebsocketContextProvider( { children, notebookDetails }: {
    children: React.ReactNode, 
    notebookDetails: NotebookDetails
  } ) {
    const [ deploymentData, setDeploymentData ] = useState<OutputDeployMessage>({} as OutputDeployMessage);
  
    const onNotebookDeployed = useCallback((data: OutputDeployMessage) => {
      console.log(`Received notebook_deployed: ${data.type}, success: ${data.success}, message: ${data.message}`);
      setDeploymentData(data);
    }, []);
  
    const { deployLambda, isConnected, connectionStatus } = useNotebookConnection({
        onNotebookDeployed: onNotebookDeployed,
        notebookDetails: notebookDetails
    });
  
    const contextValue: WebsocketContextProps = useMemo(() => ({
      deployLambda,
      isConnected,
      connectionStatus,
      deploymentData,
    }), [deployLambda, isConnected, connectionStatus, deploymentData]);
    
    return (
      <WebsocketContext.Provider value={contextValue}>
        {children}
      </WebsocketContext.Provider>
    )
  }
  