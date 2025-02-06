'use client'

import { useSearchParams } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotebookSettings() {
  //const params = useParams();
  const searchParams = useSearchParams();
  //const id = params.id as string;
  const name = searchParams.get('name') || '';

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/dashboard/projects" className="flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to notebooks
        </Link>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Settings for {name} notebook</h2>
        
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