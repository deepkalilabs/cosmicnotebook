import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Job, Jobs } from "@/app/types";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
interface JobsPageProps {
  jobs?: Jobs;
}

export default function JobsPage({ jobs }: JobsPageProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const fetchLogsForJob = async (job: Job) => {
    console.log(job.aws_log_group, job.aws_log_stream);
    console.log("Sending request to /api/job_logs/", job.id);
    setLogs(["Loading...."])
    fetch(`/api/job_logs/${job.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notebook_id: job.notebook_id,
          aws_log_group: job.aws_log_group,
          aws_log_stream: job.aws_log_stream,
        }),
      }
    ).then((res) => res.json()).then((data) => {
      console.log("logs:", data);
      setLogs(data);
    });
  }

  return (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead className="text-center">Result</TableHead>
            <TableHead>Input Params</TableHead>
            <TableHead>Error</TableHead>
            <TableHead>Logs</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          { !jobs?.jobs ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                Loading jobs...
              </TableCell>
            </TableRow>
          ) : jobs?.jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                No jobs found.
              </TableCell>
            </TableRow>
          ) : (
            [...jobs.jobs]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((job, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono">{job.request_id}</TableCell>
                  <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                job.completed ? 'bg-green-100 text-green-800' : 
                job.error ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {job.completed ? 'Completed' : job.error ? 'Failed' : 'Running'}
              </span>
            </TableCell>
            <TableCell>{new Date(job.created_at).toLocaleString()}</TableCell>
            <TableCell>{job.completed_at ? new Date(job.completed_at).toLocaleString() : '-'}</TableCell>
            <TableCell className="w-1/3 text-center">
              {job.result && job.result.length > 0 ? 
                <pre className="whitespace-pre-wrap text-center">
                  {JSON.stringify(job.result, null, 2)}
                </pre>
              : '-'}
            </TableCell>
            <TableCell className="w-2/3">
              {job.input_params ? (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(job.input_params, null, 2)}
                </pre>
              ) : '-'}
            </TableCell>
            <TableCell>{job.error ? job.error : '-'}</TableCell>
            <TableCell>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  setShowLogs(!showLogs);
                  fetchLogsForJob(job);
                }}
              >
                <FileIcon className="w-4 h-4" />
              </Button>
            </TableCell>
            </TableRow>
          ))
        )}
        </TableBody>
      </Table>
      {showLogs && (
        <Sheet open={showLogs} onOpenChange={setShowLogs}>
          <SheetContent side="right" className="overflow-y-auto w-1/2 hover:max-w-[80%] transition-all">
            <SheetHeader>
              <SheetTitle>Job Logs</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <div className="bg-gray-50 rounded-md p-4">
                <pre className="text-sm font-mono max-h-[80vh] overflow-y-auto whitespace-pre-wrap break-words">
                  {logs.join('\n')}
                </pre>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}