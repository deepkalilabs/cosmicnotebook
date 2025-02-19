import { useState, useCallback, useEffect } from 'react';

export function useDeploymentLogs(notebookId: string, isDeploying: boolean) {
    const [logs, setLogs] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch logs
    const fetchLogs = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/logging/deployments/get`, {
                method: 'POST',
                body: JSON.stringify({ notebookId })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch deployment logs');
            }
            const data = await response.json();
            setLogs(data.logs);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch logs');
        } finally {
            setIsLoading(false);
        }
    }, [notebookId]);

    // Poll for logs when deployment is in progress
    useEffect(() => {
        if (!isDeploying) return;

        // Initial fetch
        fetchLogs();

        // Set up polling every minute
        const interval = setInterval(fetchLogs, 60000); // 60000ms = 1 minute

        return () => {
            clearInterval(interval);
        };
    }, [isDeploying, fetchLogs]);

    // Clear logs
    const clearLogs = useCallback(() => {
        setLogs([]);
        setError(null);
    }, []);

    return {
        logs,
        isLoading,
        error,
        clearLogs
    };
}
