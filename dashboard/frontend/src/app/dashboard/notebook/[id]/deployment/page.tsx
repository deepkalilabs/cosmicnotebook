"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useState, useEffect } from 'react';
import DeploySettings from '@/components/notebook/settings/DeploySettings';
import { useNotebookDetailStore } from '@/app/store';
import { Skeleton } from '@/components/ui/skeleton';

//TODO: Show URL for the API when deployed
//TODO: Do we change url when we redeploy?
//TODO: Add CURL request to the API when deployed
export default function NotebookDeployment() {
    const { notebookDetails } = useNotebookDetailStore()
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (notebookDetails) {
            setLoading(false);
        }
    }, [notebookDetails]);

    if (!notebookDetails) {
        return <div>Loading...</div>
    }

    return (
        loading ? (
            <Card>
                <CardHeader>
                    <Skeleton className="h-[20px] w-full" />
                    <Skeleton className="h-[20px] w-full" />
                    <Skeleton className="h-[20px] w-full" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[20px] w-full" />
                    <Skeleton className="h-[20px] w-full" />
                    <Skeleton className="h-[20px] w-full" />
                </CardContent>
            </Card>
        ) : (
            <DeploySettings />
        )
    )
}