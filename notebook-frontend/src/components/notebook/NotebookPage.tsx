"use client";
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Separator } from '@/components/ui/separator';
import { useNotebookStore } from '@/app/store';
import { useNotebookConnection } from '@/hooks/useNotebookConnection';
import { NotebookToolbar } from '@/components/notebook/NotebookToolbar';
import { NotebookCell } from '@/components/notebook/NotebookCell';
import { OutputDeployMessage, CellType, NotebookPageProps } from '@/app/types';
import DeploymentDialog from '@/components/notebook/NotebookDeploy';
import { useConnectorHook } from '@/hooks/useConnectorHook';

export default function NotebookPage({ notebookId, userId, name }: NotebookPageProps) {
  const { toast } = useToast();
  const { cells, addCell, updateCellCode, updateCellType,updateCellOutput, deleteCell, moveCellUp, moveCellDown, setCells } = useNotebookStore();
  const [ isDeploying, setIsDeploying ] = useState(false);
  const [ deploymentData, setDeploymentData] = useState<OutputDeployMessage>({} as OutputDeployMessage);
  const { handleCloseDialog } = useConnectorHook();
  const {
    executeCode,
    saveNotebook,
    loadNotebook,
    restartKernel,
    deployCode,
    isConnected,
    connectionStatus,
    createConnector
  } = useNotebookConnection({
    onOutput: updateCellOutput,
    onNotebookLoaded: (cells) => {
      setCells(cells);
      toast({
        title: 'Notebook loaded',
        description: 'Successfully loaded notebook',
        variant: "default",
        duration: 1000
      });
    },
    onNotebookSaved: (data) => {
      if (data.success) {
        console.log(`Toasting: Received notebook_saved: ${data.type}, success: ${data.success}, message: ${data.message}`);
        toast({
          title: "Notebook saved",
          description: data.message,
          variant: "default",
          duration: 1000
        });
      } else {
        toast({
          title: "Failed to save",
          description: data.message,
          variant: "destructive"
        });
      }
    },
    notebookDetails: {
      id: notebookId,
      name: name,
      user_id: userId || ""
    },
    onNotebookDeployed: (data) => {
      console.log(`Received notebook_deployed: ${data.type}, success: ${data.success}, message: ${data.message}`);
      setIsDeploying(true);
      setDeploymentData(data);
    },
    onError: (error) => {
      toast({
        title: "Failed to deploy",
        description: error,
        variant: "destructive"
      });
    },
    onConnectorCreated: (response) => {
      console.log("Received connector_created on NotebookPage", response);
      //TODO: Update the store with the new connector
      //TODO: Close the dialog
      if (response.success) {
        toast({
          title: "Connector created",
          description: response.message,
          variant: "default",
          duration: 1000
        });

        const codeCellId = uuidv4();
        const markdownCellId = uuidv4();

        addCell('code', codeCellId);
        addCell('markdown', markdownCellId);

        updateCellCode(codeCellId,  response.code); 
        updateCellCode(markdownCellId, response.docstring);
        handleCloseDialog();
      } else {
        //TODO: Add remote error logging for team to fix
        console.error("Failed to create connector", response)
        toast({
          title: "Failed to create connector",
          description: response.message,
          variant: "destructive",
          duration: 1000
        });
      }

    },
  });

  useEffect(() => {
    // Show connection status changes
    if (!isConnected) {
      toast({
        title: 'Kernel Status',
        description: connectionStatus,
        variant: 'destructive',
        duration: 2000
      });
    }
  }, [isConnected, connectionStatus, toast]);

  useEffect(() => {
    if (notebookId) {
      console.log("Loading notebook", name, notebookId, userId);
      loadNotebook(name, notebookId, userId || "");
    }
  }, [notebookId]);


  const handleExecute = async (cellId: string) => {
    const cell = cells.find(c => c.id === cellId);
    if (!cell) return;

    updateCellOutput(cellId, '');
    executeCode(cellId, cell.code);
  };

  const handleSave = async (filename: string) => {
    saveNotebook(cells, filename, notebookId, userId || "");
  };

  const handleLoad = async (filename: string) => {
    loadNotebook(filename, notebookId, userId || "");
  };

  const handleDeploy = async () => {
    // setIsDeploying(true);
    console.log("handle deploying", isDeploying)
    deployCode(cells, userId || "", name, notebookId)
  }

  const handleCreateConnector = (connector: string, values:Record<string, string | number | boolean>, userId: string, notebookId: string) => {
    console.log("handleCreateConnector", connector, values, userId, notebookId)
    createConnector(connector, values, userId, notebookId)
  }

  console.log("firing here", notebookId, name, userId)

  return (
    <div className="flex min-h-screen">
      <div className="container mx-auto py-8">
        <Tabs defaultValue="notebook" className="w-full">
          <TabsContent value="notebook">
            { isDeploying && (
              <DeploymentDialog
                isOpen={isDeploying}
                onOpenChange={setIsDeploying}
                data={deploymentData}
              />
            )}

            <div className="sticky top-0 z-50 bg-background py-2">
              <NotebookToolbar
                name={name}
                onHandleAddCell={(type: CellType) => {
                  addCell(type)
                  handleSave(name)
                }}
                onHandleSave={handleSave}
                onHandleLoad={handleLoad}
                onHandleRestartKernel={restartKernel}
                isConnected={isConnected}
                allCells={cells}
                onHandleDeploy={handleDeploy}
                onHandleCreateConnector={handleCreateConnector}
              />
            </div>

            <Separator className="my-0" />
            <br/>

            <div className="space-y-6">
              {cells.map((cell) => (
                <NotebookCell
                  key={cell.id}
                  id={cell.id}
                  code={cell.code}
                  output={cell.output}
                  type={cell.type}
                  executionCount={cell.executionCount}
                  isExecuting={false}
                  onTypeChange={(type: CellType) => updateCellType(cell.id, type)}
                  onCodeChange={(code) => updateCellCode(cell.id, code)}
                  onExecute={() => {
                    handleExecute(cell.id)
                    handleSave(name)
                  }}
                  onDelete={() => {
                    deleteCell(cell.id)
                    handleSave(name)
                  }}
                  onMoveUp={() => {
                    moveCellUp(cell.id)
                    handleSave(name)
                  }}
                  onMoveDown={() => {
                    moveCellDown(cell.id)
                    handleSave(name)
                  }}
                />
              ))}
              
              {cells.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No cells yet. Click Add Cell to create one.
                </div>
              )} 
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}