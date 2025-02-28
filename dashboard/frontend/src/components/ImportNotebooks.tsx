"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/app/store"
import { asImportedURL } from "@/lib/marimo/urls";

interface NotebookUploadProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileSelect: (fileName: string, fileContent: { cells: any[] }) => void;
}

/**
 * Processes notebook file content and converts it to application format
 */
const processNotebookContent = async (fileName: string, fileContent: string, user_id: string) => {  // Send the processed file to the Next.js proxy
  try {
    const response = await fetch(`/api/notebook_import/${user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileContent
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    const result = await response.json();

    const marimo_filename = fileName.split(".")[0] + ".py"

    const href = asImportedURL(marimo_filename, user_id, result.notebook_id, result.session_id);
 
    window.open(href.toString(), '_blank');

    console.log("Upload successful:", result);
    return result;
  } catch (error) {
    console.error("Error uploading notebook to proxy:", error);
    throw error;
  }
};

/**
 * NotebookUpload component for file selection
 */
function NotebookUpload({ onFileSelect }: NotebookUploadProps) {
  const { user } = useUserStore();
  const user_id = user?.id;

  if (!user_id) {
    throw new Error("User ID is required");
  }

  // Replace Uppy with basic file input handler
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const content = reader.result as string;
        
        // Process and upload file content
        const processedCells = await processNotebookContent(file.name, content, user_id);
        
        // Call the callback provided by parent
        onFileSelect(file.name, { cells: processedCells });
      } catch (error) {
        console.error("Error processing file:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid gap-4 py-4">
      <input
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
        accept=".py,.ipynb"
      />
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center w-full px-4 py-2 transition bg-muted border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-muted-foreground focus:outline-none"
      >
        <Button asChild>
          <div>
            <Upload className="mr-2 h-4 w-4" />
            Select Python Notebook
          </div>
        </Button>
      </label>
    </div>
  );
}

/**
 * Import Notebook Button Component with Dialog
 */
export const ImportNotebookButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNotebookSelect = async (fileName: string, fileContent: { cells: any[] }) => {
    try {
      // No need to call processNotebookContent here as it's already called in NotebookUpload
      console.log("Notebook selected:", fileName, fileContent);
      setDialogOpen(false);
    } catch (error) {
      console.warn("Error handling notebook selection:", error);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import Notebook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Notebook</DialogTitle>
        </DialogHeader>
        <NotebookUpload onFileSelect={handleNotebookSelect} />
      </DialogContent>
    </Dialog>
  );
};

export default NotebookUpload;