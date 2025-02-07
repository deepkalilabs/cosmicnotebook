import { BookTemplate } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"

export const Templates = () => {

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
          {templateData.templates.map((template) => (
            <Card 
              key={template.id} 
              className="group relative overflow-hidden transition-colors hover:bg-muted/50 flex flex-col"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <BookTemplate className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold">{template.name}</h4>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col mt-auto w-full">
                <div className="flex items-center py-4">
                  <span className="text-xs bg-secondary px-2.5 py-0.5 rounded-md text-secondary-foreground">
                    {template.example_customer}
                  </span>
                </div>
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
    );
}