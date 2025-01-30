import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MessageCircle, Rocket, Settings, Trash2 } from "lucide-react";
import MarimoFileComponent from '@/components/marimo/MarimoFileComponent';
import { User } from "@/app/types";
import { MarimoFile } from '@/app/types';
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';

export const NotebookCard = ({ marimo_notebook, user, onDeleteNotebook }: { marimo_notebook: MarimoFile, user: User, onDeleteNotebook: (notebook_id: string) => void }) => {
  const router = useRouter();

  return (
    <Card 
        className="group hover:shadow-lg transition-all duration-200 border-border/50"
    >
        <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-lg font-semibold tracking-tight">{marimo_notebook.name}</h4>
            </div>

            <div className="flex items-center space-x-0">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`notebook/${marimo_notebook.id}/settings?name=${encodeURIComponent(marimo_notebook.name)}`);
                    }}
                >
                    <Settings className="h-2 w-2 text-muted-foreground hover:text-primary" />
                </Button>
                
                <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement delete notebook

                    onDeleteNotebook(marimo_notebook?.id || '');
                }}
                >
                <Trash2 className="h-2 w-2 text-muted-foreground hover:text-red-500" />
                </Button>
            </div>
        </div>
        </CardHeader>
        <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground/90 line-clamp-2">
            {!marimo_notebook.description || ""}
        </p>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center">
            <div className="flex flex-col flex-wrap items-center">
            {marimo_notebook.description ? marimo_notebook.description : ""} 
            <br/>
            Last modified: {new Date(marimo_notebook.updated_at).toLocaleDateString()}
            </div>
            </div>
        </div>
        </CardContent>
        <CardFooter className="pt-4">
        <MarimoFileComponent file={marimo_notebook} returnUrl={document.location.href} user_id={user?.id || ''} notebook_id={marimo_notebook.id}/>
        </CardFooter>
    </Card>
  );
};
