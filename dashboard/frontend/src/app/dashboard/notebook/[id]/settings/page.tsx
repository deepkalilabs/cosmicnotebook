'use client'

import { useSearchParams } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export default function NotebookSettings() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';

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