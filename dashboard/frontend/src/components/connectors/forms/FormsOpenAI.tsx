"use client"

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { ConnectorsButtonProps } from '@/app/types'

const formSchema = z.object({
  api_key: z.string().min(5, { message: "API Key is required" }),
})

export default function FormsOpenAI({onHandleCreateConnector, handleCloseDialog}: ConnectorsButtonProps & {handleCloseDialog: () => void}) {
  const [isConnecting, setIsConnecting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        api_key: '',
    }
  });

  const onSubmit = async (credentials: z.infer<typeof formSchema>) => {
    console.log("Credentials submitting...", credentials);
    setIsConnecting(true);
    
    try {
      const res = await onHandleCreateConnector('openai', credentials);
      console.log("Response from onHandleCreateConnector", res);
      
      if (res && res.error) {
        form.setError("root", { 
          message: res.error
        });
        setIsConnecting(false);
        return;
      }
    
      handleCloseDialog();
      setIsConnecting(false);
      console.log("Integration: ", res.data);
      //addIntegration(res.data.body as unknown as IntegrationCredentials);
      toast({
        title: "Success",
        description: "Integration created",
        variant: "default"
      });

  
    } catch (err) {
      console.error("Error connecting to Pylon", err);
      form.setError("root", { 
        message: "Failed to connect to Pylon. Please check your credentials." 
      });
      setIsConnecting(false);
      throw err; // Re-throw the error to be handled by the caller
    } 
  };

  return (  
    <Form {...form}>
        <div>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            Integrate with OpenAI 
            </h2>
            <p className="text-muted-foreground">
            Connect with OpenAI in your notebook and run AI workflows.
            </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <FormField
            control={form.control}
            name="api_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OpenAI API Key</FormLabel>
                <FormControl>
                  <Input placeholder="sk-1234567890" {...field} />
                </FormControl>
                <FormDescription>
                  To find your API Key: 
                  <br />
                  1. Go to the OpenAI Account Settings
                  <br />
                  2. Click on &quot;APIs&quot;
                  <br />
                  3. Create and copy the API Key
                </FormDescription>
              </FormItem>
            )}
          />

          {form.formState.errors.root && <FormMessage>{form.formState.errors.root.message}</FormMessage>}

          <Button type="submit" disabled={isConnecting}>
            {isConnecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Connect
          </Button>
        </form>
        
    </Form>
  )
}
