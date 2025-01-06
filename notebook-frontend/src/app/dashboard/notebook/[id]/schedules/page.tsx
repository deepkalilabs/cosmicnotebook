'use client'

import { useParams } from 'next/navigation';
import { JobScheduler } from '@/components/notebook/jobs/JobScheduler';

export default function Page() {
    const params = useParams();
    const id = params.id as string;
    return <JobScheduler notebookId={id} />;
}