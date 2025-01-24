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
import { NotebookCell } from '@/app/types';
import { useNotebookConnection } from '@/hooks/useNotebookConnection';
import { useToast } from '@/hooks/use-toast';
import NotebookUpload from '@/components/NotebookUpload';
import { useUserStore } from '@/app/store';

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

export default function ProjectsPage() {
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newNotebookName, setNewNotebookName] = useState("");
    const filterNotebooks = notebooks.filter((notebook: { name: string }) => notebook.name.toLowerCase().includes(search.toLowerCase()));

    console.log("notebooks", notebooks);
    console.log("filterNotebooks", filterNotebooks);
    const [importNotebookDialogOpen, setImportNotebookDialogOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useUserStore();
    console.log("firing here", 1)

    const { saveNotebook } = useNotebookConnection({
      onNotebookSaved: (data) => {
        if (data.success) {
          console.log(`Toasting: Received notebook_saved: ${data.type}, success: ${data.success}, message: ${data.message}`);
          toast({
            title: "Notebook imported",
            description: data.message,
            variant: "default"
          });
        } else {
          toast({
            title: "Failed to save",
            description: data.message,
            variant: "destructive"
          });
        }
      }
    })

    const createNotebookHelper = async (notebookName: string) : Promise<string> => {
      const newNotebook = {
          user_id: user?.id,
          name: notebookName,
          description: "New notebook", // Adding a default description
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
      }

      // Supabase create notebook
      const { data, error } = await supabase
          .from('notebooks')
          .insert(newNotebook)
          .select()
          .single();

      if (error) {
          console.error('Error creating notebook:', error);
          return "";
      }

      setNotebooks(prevNotebooks => [...prevNotebooks, data]);
      setNewNotebookName("");

      return data.id;
    }

    const createNotebook = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const notebookId = await createNotebookHelper(newNotebookName);
        console.log(`Notebook created successfully at ${notebookId}`);
        openNotebook(notebookId, newNotebookName);
        setDialogOpen(false);
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

      setImportNotebookDialogOpen(false);
      const notebookId = await createNotebookHelper(fileName);
      console.log(`Notebook created successfully at ${notebookId}`);

      // TODO: Save the notebook cells to S3 associated with the notebook name
      if (user?.id) {
        saveNotebook(cosmicCells, fileName, notebookId, user?.id)
      } else {
        console.error("User should not be null for saving notebook.")
      }
      console.log('cosmicCells', cosmicCells);
      // openNotebook(notebookId, fileName);
    }

    const getAllNotebooksByUser = async (userId: string) => {
        const { data, error } = await supabase.from('notebooks').select().eq('user_id', userId);
        if (error) {
            console.error('Failed to fetch notebooks: ' + error.message);
            return;
        }
        setNotebooks(data || [] as Notebook[]); // Type assertion with proper interface
    }

    const deleteNotebook = async (notebookId: string) => {
        const { error } = await supabase
            .from('notebooks')
            .delete()
            .eq('id', notebookId);
            
        if (error) {
            console.error('Failed to delete notebook: ' + error.message);
            return;
        }
        
        setNotebooks(notebooks.filter((notebook: { id: string }) => notebook.id !== notebookId));
    }

    const openNotebook = (notebookId: string, name: string) => {
        router.push(`/dashboard/notebook/${notebookId}?name=${name}`);
    }

    useEffect(() => {
        console.log(newNotebookName);
    }, [newNotebookName]);

    useEffect(() => {
        if (user?.id) {
            getAllNotebooksByUser(user?.id);
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Notebook
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Notebook</DialogTitle>
                </DialogHeader>
                <div className="flex gap-4">
                  <Input
                    value={newNotebookName}
                    onChange={(e) => setNewNotebookName(e.target.value)}
                    placeholder="Enter notebook name"
                  />
                  <Button onClick={createNotebook}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={importNotebookDialogOpen} onOpenChange={setImportNotebookDialogOpen}> 
                <Button onClick={() => setImportNotebookDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Notebook
                </Button>
              <DialogContent aria-describedby="import-notebook-description">
                <DialogHeader>
                  <DialogTitle>Import Notebook</DialogTitle>
                  <DialogDescription id="import-notebook-description">
                    Upload a Jupyter notebook file to import it into your workspace.
                  </DialogDescription>
                </DialogHeader>
                <NotebookUpload onFileSelect={handleFileSelect} />
              </DialogContent>
            </Dialog>
            </div>
          </div>
  
          {/* Search */}
          <div className="flex items-center space-x-2 max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notebooks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
  
          {/* Notebooks Grid */}
          <ScrollArea className="flex-1">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterNotebooks.map((notebook) => (
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
                          deleteNotebook(notebook.id);
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
                        <div className="w-2 h-2 rounded-full bg-primary/50 mr-2" />
                        Last modified: {new Date(notebook.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button
                      variant="default" 
                      className="w-full group-hover:bg-primary/90 transition-colors"
                      onClick={() => openNotebook(notebook.id, notebook.name)}
                    >
                      Open Notebook
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
  
          <Separator className="my-4" />
  
          {/* Templates Section */}
          <div className="space-y-4">
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
      </div>
    );
}