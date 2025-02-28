import { BookTemplate } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { asTemplateURL } from "@/lib/marimo/urls"
import { useUserStore } from "@/app/store"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from 'uuid';

const TemplateButton = ({ user_id, notebook_id, template_id, template_date }: { user_id: string, notebook_id: string, template_id: string, template_date: string }) => {
  const router = useRouter();
  const [ nameNotebook, setNameNotebook ] = useState('');
  const [ openNotebookNameDialog, setOpenNotebookNameDialog ] = useState(false);
  const [ redirectMarimo, setRedirectMarimo ] = useState(false)

  const formattedDate = new Date(template_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  useEffect(() => {
    if (!redirectMarimo) return
    
    const filename = nameNotebook.split('.')[0]
    const notebook_url = asTemplateURL(filename + ".py", user_id, notebook_id, template_id)
    router.push(notebook_url.toString());
  }, [redirectMarimo])

  return (
    <>
      <div className="flex flex-col space-y-5 pb-4">
        <div className="text-xs text-muted-foreground font-medium">
          Last modified: {formattedDate}
        </div>
      </div>
      <Button 
        className="w-full"
        variant="default"
        onClick={() => {
          sessionStorage.setItem('returnUrl', document.location.href);
          setOpenNotebookNameDialog(true);
        }}>
        <BookTemplate className="mr-2 h-4 w-4" />
        Use Template
      </Button>
      
      <Dialog open={openNotebookNameDialog} onOpenChange={setOpenNotebookNameDialog}>
        <DialogContent> 
          <DialogHeader>
            <DialogTitle>
              Use the template.
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Give the template a name.
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

export const Templates = () => {
  const { user } = useUserStore();
  const user_id = user?.id;
  const [templateData, setTemplateData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchTemplateData = async () => {
      const templateData = await fetch("/api/templates").then(res => res.json())
      setTemplateData(templateData)
      setIsLoading(false)
    }
    fetchTemplateData()
  }, [])

  console.log(templateData)

  if (!user_id) {
    return <div>Loading...</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
    
  return (
      <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Templates</h3>
        <Button variant="outline">
          Request Template
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {templateData.templates.map((template: any) => (
          <Card 
            key={template.id} 
            className="group hover:shadow-md transition-all duration-300 border-border/30 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <BookTemplate className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="text-lg font-medium">{template.name}</h4>
                </div>
              </div>
              
              {template.description && (
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {template.description}
                </p>
              )}
              
              <div className="flex flex-col space-y-5">
                {template.example_customer && (
                  <div className="text-xs text-muted-foreground font-medium">
                    Example: <span className="bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">
                      {template.example_customer}
                    </span>
                  </div>
                )}
                
                <div className="w-full mt-auto">
                  {template.available ? (
                    <TemplateButton 
                      user_id={user_id}
                      notebook_id={uuidv4()}
                      template_id={template.id}
                      template_date={template.created_at}
                    />
                  ) : (
                      <Button 
                        className="w-full mt-auto"
                        variant="default"
                        disabled
                    >
                      Template will be available soon
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div> 
  );
}