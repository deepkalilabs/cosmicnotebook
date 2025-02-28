import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Settings, Trash2 } from "lucide-react";
import MarimoFileComponent from '@/components/marimo/MarimoFileComponent';
import { User } from "@/app/types";
import { MarimoFile } from '@/app/types';
import { useRouter } from "next/navigation";

export const NotebookCard = ({ marimo_notebook, user, onDeleteNotebook }: { marimo_notebook: MarimoFile, user: User, onDeleteNotebook: (notebook_id: string) => void }) => {
  const router = useRouter();
  const formattedDate = new Date(marimo_notebook.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="group hover:shadow-md transition-all duration-300 border-border/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <h4 className="text-lg font-medium">{marimo_notebook.name}</h4>
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`notebook/${marimo_notebook.id}/settings?name=${encodeURIComponent(marimo_notebook.name)}`);
              }}
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNotebook(marimo_notebook?.id || '');
              }}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
            </Button>
          </div>
        </div>
        
        {marimo_notebook.description && (
          <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
            {marimo_notebook.description}
          </p>
        )}
        
        <div className="flex flex-col space-y-5">
          <div className="text-xs text-muted-foreground font-medium">
            Last modified: {formattedDate}
          </div>
          
          <div className="w-full">
            <MarimoFileComponent 
              file={marimo_notebook} 
              returnUrl={document.location.href} 
              user_id={user?.id || ''} 
              notebook_id={marimo_notebook.id}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};