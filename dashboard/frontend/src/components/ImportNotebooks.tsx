import { NotebookCell } from "@/app/types";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { DialogHeader } from "./ui/dialog";
import NotebookUpload from "./NotebookUpload";

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


export const ImportNotebookButton = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
  
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button disabled={true}>
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
          <NotebookUpload onFileSelect={(fileName: string, fileContent: { cells: NotebookCell[] }) => {
            handleFileSelect(fileName, fileContent);
            setDialogOpen(false);
          }} />
        </DialogContent>
      </Dialog>
    );
}
