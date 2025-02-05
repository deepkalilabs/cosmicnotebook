import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, CheckCircle2, Check, Copy } from 'lucide-react';
import { OutputDeployMessage } from '@/app/types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { WebsocketContext } from '@/contexts/websocket-context-provider';
import { useNotebookDetailStore } from '@/app/store';


const DeploymentDialog = ({ isDeploying, setIsDeploying }: { isDeploying: boolean, setIsDeploying: (isDeploying: boolean) => void }) => {
  const [messages, setMessages] = useState<{ message: string, success: boolean }[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const [ copied, setCopied ] = useState(false);
  const { deploymentData } : { deploymentData: OutputDeployMessage } = useContext(WebsocketContext);
  const [ isOpen, setIsOpen ] = useState(isDeploying);
  const { notebookDetails, setNotebookDetails } = useNotebookDetailStore();
  const [ newEndpoint, setNewEndpoint ] = useState("");

  useEffect(() => {
    if (!deploymentData.message) return;

    if (!notebookDetails) return;

    console.log("data", deploymentData)

    if (deploymentData.message && deploymentData.message.startsWith("https://") && notebookDetails) {
      setNotebookDetails({
        ...notebookDetails,
        submit_endpoint: deploymentData.message.trim()
      });
      setNewEndpoint(deploymentData.message.trim());
    }
    else {
      setMessages(prev => [...prev, {
          message: deploymentData.message,
          success: deploymentData.success
      }]);
    }
    setCurrentMessageIndex(prev => prev + 1);

  }, [deploymentData]);

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setCurrentMessageIndex(0);
      setIsDeploying(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (!newEndpoint) return;
    navigator.clipboard.writeText(newEndpoint);
    setCopied(true);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>Deploying your Notebook</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {messages.map((msg, index) => (
            <div key={index} className="flex items-center space-x-3">
              {index === currentMessageIndex - 1 ? (
                msg.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                )
              ) : index < currentMessageIndex ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5" />
              )}
              <span className="text-sm text-gray-700">{msg.message}</span>
            </div>
          ))}

          {newEndpoint && (
            <Card className="mt-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <code className="text-sm font-mono text-muted-foreground">
                  {newEndpoint}
                </code>
                <Button 
                  onClick={handleCopy}
                  size="sm"
                  variant="ghost"
                  className="ml-2 h-8"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Card>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeploymentDialog;