'use client'

import { useSearchParams } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getApiUrl } from '@/app/lib/config';
import { useState, useEffect } from 'react';
import { NotebookDetails } from '@/app/types';
import { NextResponse } from 'next/server';

export default function NotebookSettings() {
  //const params = useParams();
  const searchParams = useSearchParams();
  //const id = params.id as string;
  const name = searchParams.get('name') || '';
  const id = searchParams.get('id') || '';

  const [notebookDetails, setNotebookDetails] = useState<NotebookDetails | null>(null);

  useEffect(() => {
    const fetchNotebookDetails = async () => {
      const response = await fetch(`${getApiUrl()}/notebook_details/${id}`);
      if (response.status !== 200) {
        console.log("Error response:\n\n", response);
        return NextResponse.json({ error: `HTTP error! status: ${response.status}` }, { status: response.status });
      }
      const responseData = await response.json();
      setNotebookDetails(responseData);
    };
    fetchNotebookDetails();
  }, [id]);

  console.log("notebookDetails", notebookDetails);

  return (
    <div>
      <div className="space-y-6">
          <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings for {name} notebook</h1>
              <p className="text-muted-foreground">
                  Manage your notebook&apos;s basic settings.
              </p>
          </div>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings for {name} notebook</CardTitle>
                <CardDescription>
                  Manage your notebook&apos;s basic settings.
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}