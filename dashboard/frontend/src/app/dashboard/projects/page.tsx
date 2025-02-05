"use client"
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { MarimoFile } from '@/app/types';
import { newNotebookURL } from '@/lib/marimo/urls';
import { useUserStore } from '@/app/store';
import { NotebookCard } from '@/components/NotebookCard';
import { Templates } from '@/components/Templates';

function NewNotebookButton({ user_id, notebook_id }: { user_id: string, notebook_id: string }) {

  const notebook_url = newNotebookURL(user_id, notebook_id);
  const router = useRouter();
  return (
    <Button onClick={() => {
      sessionStorage.setItem('returnUrl', document.location.href);
      router.push(notebook_url.toString());
    }}>
      <Plus className="mr-2 h-4 w-4" />
      New Notebook
    </Button>
  );
}

export default function ProjectsPage() {
    const [marimoNotebooks, setMarimoNotebooks] = useState<MarimoFile[]>([]);
    const { user } = useUserStore();

    if (!user?.id) {
      console.log("User should not be null for creating notebook.");
    }


    const getAllMarimoNotebooksByUser = async (userId: string) => {
        const { data, error } = await supabase.from('notebooks').select().eq('user_id', userId);
        if (error) {
            console.error('Failed to fetch notebooks: ' + error.message);
            return;
        }
        setMarimoNotebooks(data || [] as MarimoFile[]); // Type assertion with proper interface
    }

    const onDeleteNotebook = async (notebook_id: string) => {
      setMarimoNotebooks(marimoNotebooks.filter(notebook => notebook.id !== notebook_id)); 
      const { data, error } = await supabase.from('notebooks').delete().eq('id', notebook_id);
      if (error) {
        console.log("Error deleting notebook", error);
      }
      return data;
    }

    useEffect(() => {
        if (user?.id) {
            getAllMarimoNotebooksByUser(user?.id);
        }
    }, [user]);

    if (!user?.id) {
      return null;
    }

    return (
        <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 space-y-8 p-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Notebooks</h2>
              <p className="text-muted-foreground">
                Manage and create your Jupyter notebooks.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <NewNotebookButton user_id={user.id} notebook_id={uuidv4()} />
              {/* <ImportNotebookButton /> */}
            </div>
          </div>
    
          <ScrollArea className="flex-1">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {marimoNotebooks.length == 0 && (
                <div className="flex h-full">
                  <p className="text-muted-foreground">No notebooks found</p>
                </div>
              )}
              {marimoNotebooks.length > 0 && marimoNotebooks.map((notebook) => (
                <NotebookCard key={notebook.id || ''} marimo_notebook={notebook} user={user} onDeleteNotebook={onDeleteNotebook} />
              ))}
              </div>
            </ScrollArea>
          </div>
  
          <Separator className="my-4" />
  
          {/* Templates Section */}
          <Templates />
        </div>
    );
}