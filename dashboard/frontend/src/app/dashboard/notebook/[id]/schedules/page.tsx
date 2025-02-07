'use client'

import { useParams, useSearchParams } from 'next/navigation';
import { JobScheduler } from '@/components/notebook/jobs/JobScheduler';

export default function Page() {
    const params = useParams();
    const searchParams = useSearchParams();
    const name = searchParams.get('name') || '';
    
    const id = params.id as string;
    return (
        <div>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schedules for {name} notebook</h1>
                    <p className="text-muted-foreground">
                        Monitor your notebook&apos;s schedules.
                    </p>
                </div>
                <JobScheduler notebookId={id} />
            </div>
        </div>
    )
}