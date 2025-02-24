/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

"use client";

import { useEffect } from 'react';
import { Uppy } from '@uppy/core';
import { FileInput } from '@uppy/react';
import { Button } from '@/components/ui/button';
import '@uppy/core/dist/style.min.css';
import { NotebookUploadProps } from '@/app/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const uppy = new Uppy({
  restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ['.py', '.ipynb']
  }
});

export default function NotebookUpload({ onFileSelect }: NotebookUploadProps) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFileSelect = (file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onFileSelect(file.name, JSON.parse(content) as any);
      };
      reader.readAsText(file.data);
    };

    uppy.on('file-added', handleFileSelect);

    return () => {
      uppy.off('file-added', handleFileSelect);
    };
  }, [onFileSelect]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload Notebook</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Notebook</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FileInput
            uppy={uppy}
            pretty={false}
            inputName="files"
            locale={{
              strings: {
                chooseFiles: 'Select Python File',
                noFiles: 'No Python file selected',
              }        
            }}
          >
            {({ openPicker }) => (
              <Button onClick={openPicker}>
                Select Python File
              </Button>
            )}
          </FileInput>
        </div>
      </DialogContent>
    </Dialog>
  );
}