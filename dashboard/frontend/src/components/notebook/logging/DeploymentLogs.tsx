import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface LogEntry {
    timestamp: number;
    message: string;
    ingestionTime: number;
}

interface DeploymentLogsProps {
    logs: LogEntry[]
    isLoading: boolean
    error: string | null
}

export default function DeploymentLogs({ logs, isLoading, error }: DeploymentLogsProps) {
    console.log("Logs in DeploymentLogs", logs)
    debugger;

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const renderLogContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading logs...
                </div>
            );
        }

        if (error) {
            return <p className="text-destructive">Error: {error}</p>;
        }

        if (logs.length === 0) {
            return <p className="text-muted-foreground">No build logs available</p>;
        }

        return logs.map((log, index) => (
            <div key={index} className="font-mono text-sm py-1 flex items-start group hover:bg-muted/50">
                <span className="text-muted-foreground min-w-[100px] select-none group-hover:text-foreground">
                    {formatTimestamp(log.timestamp)}
                </span>
                <span className="flex-1">
                    {log.message}
                </span>
            </div>
        ));
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Build Logs</CardTitle>
                        <CardDescription>
                            <br />
                            View the build and deployment logs for your notebook
                        </CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">View Full Logs</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Build Logs</DialogTitle>
                                <DialogDescription>
                                    Detailed logs from the build and deployment process
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                                {renderLogContent()}
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>                       
            <CardContent>
                <div className="mt-4">
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-background">
                        {logs.length > 0 ? 
                            logs.slice(-5).map((log, index) => (
                                <div key={index} className="font-mono text-sm py-1 flex items-start group hover:bg-muted/50">
                                    <span className="text-muted-foreground min-w-[100px] select-none group-hover:text-foreground">
                                        {formatTimestamp(log.timestamp)}
                                    </span>
                                    <span className="flex-1">
                                        {log.message}
                                    </span>
                                </div>
                            ))
                            : renderLogContent()
                        }
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}