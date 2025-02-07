'use client'

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Jobs } from '@/app/types';
import JobsPage from '@/components/notebook/jobs/JobsPage'; 

export default function Page() {
  const params = useParams();
  const notebookId = params.id as string;
  const [jobs, setJobs] = useState<Jobs>({} as Jobs);
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';
  
  useEffect(() => {
    if (notebookId) {
      const fetchJobs = async () => {
        const response = await fetch(`/api/get_notebook_jobs/${notebookId}`);
        const jobsData = await response.json();
        
        if (jobsData.statusCode !== 200) {
          setJobs({} as Jobs);
      } else {
          console.log('jobsData:', JSON.parse(jobsData.body));
          setJobs(JSON.parse(jobsData.body));
        }
      };

      fetchJobs();
    }
  }, [notebookId]);

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs for {name} notebook</h1>
          <p className="text-muted-foreground">
              Monitor your notebook&apos;s jobs.
          </p>
        </div>
        <JobsPage jobs={jobs} />
      </div>
    </div>
  );
}