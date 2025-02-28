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
import { useUserStore } from '@/app/store';
import { NotebookCard } from '@/components/NotebookCard';
import { Templates } from '@/components/Templates';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { existingNotebookURL } from '@/lib/marimo/urls';

function NewNotebookButton({ user_id, notebook_id }: { user_id: string, notebook_id: string }) {
  const [ nameNotebook, setNameNotebook ] = useState('');
  const [ openNotebookNameDialog, setOpenNotebookNameDialog ] = useState(false);
  const [ redirectMarimo, setRedirectMarimo ] = useState(false)
  const router = useRouter();
  useEffect(() => {
    if (!redirectMarimo) return
    
    const filename = nameNotebook.split('.')[0]
    const notebook_url = existingNotebookURL(filename + ".py", user_id, notebook_id)
    router.push(notebook_url.toString());
  }, [redirectMarimo])


  return (
    <>
      <Button onClick={() => {
        sessionStorage.setItem('returnUrl', document.location.href);
        // router.push(notebook_url.toString());
        setOpenNotebookNameDialog(true);
      }}>
        <Plus className="mr-2 h-4 w-4" />
        New Notebook
      </Button>
      
      <Dialog open={openNotebookNameDialog} onOpenChange={setOpenNotebookNameDialog}>
        <DialogContent> 
          <DialogHeader>
            <DialogTitle>
              Create a new notebook
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Enter a name for your new notebook
          </DialogDescription>
          <Input 
            value={nameNotebook}
            onChange={(e) => setNameNotebook(e.target.value)}
            placeholder="Notebook name"
          />
          <Button 
            onClick={() => {
              setOpenNotebookNameDialog(false);
              setRedirectMarimo(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setOpenNotebookNameDialog(false);
                setRedirectMarimo(true);
              }
            }}
          >
            Create
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ProjectsPage() {
    const [marimoNotebooks, setMarimoNotebooks] = useState<MarimoFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { user } = useUserStore();




    useEffect(() => {
        if (user?.id) {
          console.log("User ID: " + user.id);
          getAllMarimoNotebooksByUser(user.id);
        }
        setIsLoading(false);
    }, [user]);

    const getAllMarimoNotebooksByUser = async (userId: string) => {
      try {
        const fetchNotebooks = await fetch(`/api/notebooks/${userId}`, {
            headers: {
                'Authorization': `Bearer ${user?.token}`
            }
        });
        const data = await fetchNotebooks.json();
        console.log('data', data);

        if(!fetchNotebooks.ok) {
          console.log('Failed to fetch notebooks: ' + fetchNotebooks.statusText);
          return;
        }
        setMarimoNotebooks(data || [] as MarimoFile[]); 
      } catch (error) {
        console.warn('Error fetching notebooks:', error);
      }
    }

    const onDeleteNotebook = async (notebook_id: string) => {
      setMarimoNotebooks(marimoNotebooks.filter(notebook => notebook.id !== notebook_id)); 
      const { data, error } = await supabase.from('notebooks').delete().eq('id', notebook_id);
      if (error) {
        console.log("Error deleting notebook", error);
      }
      return data;
    }

    if (!user?.id) {
      return null;
    }

    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      );
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