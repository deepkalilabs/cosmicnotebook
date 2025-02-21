import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { NotebookDetails, ScheduledJob } from '@/app/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Info, PlusIcon } from 'lucide-react';
import { TrashIcon } from 'lucide-react';
import JsonEditorCell from '@/components/JsonEditorCell';
import { explainCronParts, CronBuilder } from '@/components/CronBuilder';

interface JobSchedulerProps {
  notebookId: string;
}

export function JobScheduler({ notebookId }: JobSchedulerProps) {
  const [selectedJob, setSelectedJob] = useState<ScheduledJob | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notebookDetails, setNotebookDetails] = useState<NotebookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<ScheduledJob[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/notebook_job_schedule/${notebookId}`).then(res => res.json()),
      fetch(`/api/notebook_details/${notebookId}`).then(res => res.json())
    ])
    .then(([schedulesData, detailsData]) => {
      setSchedules(schedulesData);
      setNotebookDetails(detailsData);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, [notebookId]);

  useEffect(() => {
    if (!isSheetOpen && isInfoOpen) {
      setIsInfoOpen(false);
    }
  }, [isSheetOpen]);

  useEffect(() => {
    console.log("selectedJob", selectedJob?.schedule);
  }, [selectedJob]);

  const handleEdit = (job: ScheduledJob) => {
    setSelectedJob(job);
    setIsEditing(true);
    setIsSheetOpen(true);
    setIsInfoOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setSchedules(schedules.filter(job => job.id !== id));
      const response = await fetch(`/api/notebook_job_schedule/${notebookId}`, {
        method: 'DELETE',
        body: JSON.stringify({ schedule_id: id, notebook_id: notebookId }),
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        toast({
          title: 'Schedule deleted',
          description: 'Job schedule has been deleted successfully',
        });
      } else {
        throw new Error('Failed to delete job schedule');
      }
    } catch (error) {
        console.error("error", error);
        toast({
          title: 'Error',
          description: 'Failed to delete job schedule',
        variant: 'destructive',
      });
    }

  };


  const handleSave = async (job: ScheduledJob) => {
    try {
      setIsEditing(false);
      setIsSheetOpen(false);
      setSchedules([...schedules, job]);

      const response = await fetch(`/api/notebook_job_schedule/${notebookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(job),
      });

      if (!response.ok) {
        throw new Error('Failed to update job schedule');
      }            
      toast({
        title: 'Schedule updated',
        description: 'Job schedule has been updated successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating job schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job schedule',
        variant: 'destructive',
      });
    }
  };

  const handleAddNew = () => {
    const newJob: ScheduledJob = {
      id: crypto.randomUUID(),
      submit_endpoint: notebookDetails?.submit_endpoint || "",
      input_params: '',
      schedule: '0 * * * ? *', // Default to hourly
    };
    setSelectedJob(newJob);
    setIsEditing(true);
    setIsSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Scheduled Jobs for  </h2>
        <p className="text-sm text-muted-foreground">{notebookDetails?.submit_endpoint}</p>
        <Button onClick={handleAddNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <div className="grid gap-4">
        {schedules.length === 0 && (
          <p className="text-sm text-muted-foreground">No schedules found.</p>
        )}
        {schedules.map((job) => (
          <Card key={job.id}>
            <CardContent>
              <div className="flex justify-between items-start mt-2">
                <div className="grid grid-cols-4 gap-8 flex-1">
                  <div>
                    <div className="text-md font-medium">Schedule</div>
                    <div className="text-sm">
                      {job.schedule}
                      <span className="text-xs text-muted-foreground ml-2">
                        ({explainCronParts(job.schedule)})
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-md font-medium">Status</div>
                    <div className="text-sm text-muted-foreground">
                      {job.status || "Active"}
                    </div>
                  </div>

                  <div>
                    <div className="text-md font-medium">Last Run</div>
                    <div className="text-sm text-muted-foreground">
                      {job.last_run ? new Date(job.last_run).toLocaleString() : 'Never'}
                    </div>
                  </div>

                  <div>
                    <div className="text-md font-medium">Next Run</div>
                    <div className="text-sm text-muted-foreground">
                      {job.next_run ? new Date(job.next_run).toLocaleString() : 'Not scheduled'}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(job)}>
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)}>
                    <TrashIcon className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[1000px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? 'Edit Schedule' : 'Schedule Details'}
            </SheetTitle>
          </SheetHeader>

          {selectedJob && (
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-lg font-medium">Endpoint URI</label>
                {selectedJob.submit_endpoint && selectedJob.submit_endpoint.length > 0 ? (
                  <div className="px-3 py-2 text-sm border rounded-md bg-gray-50 break-all">
                    {selectedJob.submit_endpoint}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Notebook not deployed.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium">Input Parameters</label>
                <JsonEditorCell
                  value={selectedJob.input_params}
                  onChange={(value) => {
                    setSelectedJob({ ...selectedJob, input_params: value });
                  }}
                  isEditing={isEditing}
                  endpoint={selectedJob.submit_endpoint}
                />
              </div>

              <hr className="my-4 border-gray-200" />

              <div className="space-y-2">
                <label className="text-lg font-medium">Schedule</label>
                <CronBuilder
                  value={selectedJob.schedule}
                  onChange={(value) => {
                    setSelectedJob({ ...selectedJob, schedule: value });
                  }}
                  isEditing={isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setIsSheetOpen(false);
                      // Remove the job if it was newly created and cancelled
                      if (!selectedJob.last_run) {
                        setSchedules(schedules.filter(j => j.id !== selectedJob.id));
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleSave(selectedJob)}
                    disabled={isInfoOpen}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}