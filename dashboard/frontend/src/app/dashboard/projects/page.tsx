"use client"
import React, { useEffect, useState } from 'react';
import { Plus, Search, MessageCircle, ArrowRight, BookTemplate, Trash2, Upload } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { MarimoFile, NotebookCell } from '@/app/types';
import { useNotebookConnection } from '@/hooks/useNotebookConnection';
import { useToast } from '@/hooks/use-toast';
import NotebookUpload from '@/components/NotebookUpload';
import MarimoFileComponent from '@/components/marimo/MarimoFileComponent';
import { newNotebookURL } from '@/lib/marimo/urls';
import { useOrgUserStore, useUserStore } from '@/app/store';

const templateData = {
    "templates": [
        {
            "id": 1,
            "name": "Posthog Churn Prediction",
            "description": "A template for churn prediction using Posthog",
            "example_customer": "See how Provision a YC company used Posthog to predict and prevent churn",
            "available": false
        },
        {
            "id": 2,
            "name": "AI Co Analyst",
            "description": "A template for building an AI co-analyst that can help you chat with your data",
            "example_customer": "See how  used AI to build an AI co-analyst",
            "available": false
        },
        {
            "id": 3,
            "name": "Linear AI Task Manager",
            "description": "A template for building an AI task manager that can help you manage your teams tasks",
            "example_customer": "See how Provision a YC company used AI to build an AI task manager within Linear",
            "available": false
        }
    ]
}

//TODO: Move notebook interface to types.ts
interface Notebook {
    id: string;
    user_id: string;
    session_id: string;
    organization_id: string;
    name: string;
    description: string;
    s3_url: string;
    updated_at: string;
    created_at: string;
}

interface NewNotebookButtonProps {
  onCreateNotebook: (name: string) => void;
}

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

interface ImportNotebookButtonProps {
  onFileSelect: (fileName: string, fileContent: { cells: any[] }) => void;
}

// const NotebookList: React.FC<{
//   header: React.ReactNode;
//   files: MarimoFile[];
// }> = ({ header, files }) => {
//   if (files.length === 0) {
//     return null;
//   }

//   return (
//     <div className="flex flex-col gap-2">
//       {header}
//       <div className="flex flex-col divide-y divide-[var(--slate-3)] border rounded overflow-hidden max-h-[48rem] overflow-y-auto shadow-sm bg-background">
//         {files.map((file) => {
//           return <MarimoFileComponent key={file.path} file={file} returnUrl={document.location.href} />;
//         })}
//       </div>
//     </div>
//   );
// };


function ImportNotebookButton({ onFileSelect }: ImportNotebookButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Import Notebook
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="import-notebook-description">
        <DialogHeader>
          <DialogTitle>Import Notebook</DialogTitle>
          <DialogDescription id="import-notebook-description">
            Upload a Jupyter notebook file to import it into your workspace.
          </DialogDescription>
        </DialogHeader>
        <NotebookUpload onFileSelect={(fileName: string, fileContent: { cells: any[] }) => {
          onFileSelect(fileName, fileContent);
          setDialogOpen(false);
        }} />
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectsPage() {
    const [marimoNotebooks, setMarimoNotebooks] = useState<MarimoFile[]>([]);
    const { user } = useUserStore();

    
    localStorage.setItem('user_id', user?.id || '');

    if (!user?.id) {
      console.log("User should not be null for creating notebook.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFileSelect = async (fileName: string, fileContent: { cells: any[] }) => {
      const codeCells = fileContent?.cells?.filter((cell) => ['code', 'markdown'].includes(cell.cell_type) || []);
      const cosmicCells: NotebookCell[] = []
      
      codeCells.forEach((cell) => {
        cosmicCells.push({
          id: uuidv4(),
          code: cell?.source?.join(''),
          output: cell?.outputs?.join(''),
          executionCount: 0,
          type: cell.cell_type as 'code' | 'markdown'
        })
      })

      console.log("cosmicCells", cosmicCells);
    }

    const getAllMarimoNotebooksByUser = async (userId: string) => {
        const { data, error } = await supabase.from('notebooks').select().eq('user_id', userId);
        if (error) {
            console.error('Failed to fetch notebooks: ' + error.message);
            return;
        }
        setMarimoNotebooks(data || [] as MarimoFile[]); // Type assertion with proper interface
    }


    useEffect(() => {
        if (user?.id) {
            // getAllNotebooksByUser(user?.id);
            getAllMarimoNotebooksByUser(user?.id);
        }
    }, [user]);

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
              <NewNotebookButton user_id={user?.id || ''} notebook_id={uuidv4()} />
              <ImportNotebookButton onFileSelect={handleFileSelect} />
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
                <Card 
                  key={notebook.id} 
                  className="group hover:shadow-lg transition-all duration-200 border-border/50"
                >
                  <CardHeader className="space-y-2 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <MessageCircle className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="text-lg font-semibold tracking-tight">{notebook.name}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete notebook
                          // deleteNotebook(notebook?.id || '');
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground/90 line-clamp-2">
                      {!notebook.description || ""}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <div className="flex flex-col flex-wrap items-center">
                        {notebook.description ? notebook.description : ""} 
                        <br/>
                        Last modified: {new Date(notebook.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <MarimoFileComponent file={notebook} returnUrl={document.location.href} user_id={user?.id || ''} notebook_id={notebook.id}/>
                  </CardFooter>
                </Card>
              ))}
              </div>
            </ScrollArea>
          </div>  
  
          <Separator className="my-4" />
  
          {/* Templates Section */}
          <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Templates</h3>
              <Button variant="outline">
                Request Template
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {templateData.templates.map((template) => (
                <Card 
                  key={template.id} 
                  className="group relative overflow-hidden transition-colors hover:bg-muted/50"
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <BookTemplate className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="text-lg font-semibold">{template.name}</h4>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>

                    <div className="flex items-center">
                      <span className="text-xs bg-secondary px-2.5 py-0.5 rounded-md text-secondary-foreground">
                        {template.example_customer}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      variant="default"
                      disabled={!template.available}
                    >
                      {template.available ? "Use Template" : "Template will be available soon"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
    );
}