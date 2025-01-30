'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, Loader2 } from 'lucide-react';

interface DeployButtonProps {
  onDeploy?: () => Promise<void>;
  disabled?: boolean;
  isConnected?: boolean;
}

export function DeployButton({ 
  onDeploy, 
  disabled,
  isConnected
}: DeployButtonProps) {
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    try {
      if (onDeploy) {
        onDeploy?.()
        setIsDeploying(true)
      }
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Button
      variant="default"
      className="gap-2"
      onClick={handleDeploy}
      disabled={isDeploying || disabled || !isConnected}
    >
      {isDeploying ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Deploying...
        </>
      ) : (
        <>
          <Cloud className="h-4 w-4" />
          Deploy to AWS
        </>
      )}
    </Button>
  );
} 