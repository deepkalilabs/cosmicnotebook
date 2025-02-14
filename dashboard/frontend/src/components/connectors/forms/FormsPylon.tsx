"use client"

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { ConnectorsButtonProps } from '@/app/types'

const formSchema = z.object({
  oauth_token: z.string().min(5, { message: "OAuth Bearer Token is required" }),
})

export default function PylonForm({onHandleCreateConnector, handleCloseDialog}: ConnectorsButtonProps & {handleCloseDialog: () => void}) {
  const [isConnecting, setIsConnecting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        oauth_token: '',
    }
  });

  const onSubmit = async (credentials: z.infer<typeof formSchema>) => {
    console.log("Credentials submitting...", credentials);
    setIsConnecting(true);
    
    try {
        await onHandleCreateConnector('pylon', credentials);
        handleCloseDialog();
        setIsConnecting(false);
  
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
            Integrate with Pylon 
            </h2>
            <p className="text-muted-foreground">
            Connect Pylon to your notebook to read and write data from Pylon.
            </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <FormField
            control={form.control}
            name="oauth_token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pylon OAuth Bearer Token</FormLabel>
                <FormControl>
                  <Input placeholder="xoxb-1234567890" {...field} />
                </FormControl>
                <FormDescription>
                  To find your OAuth Bearer Token: 
                  <br />
                  1. Go to the Pylon Account Settings
                  <br />
                  2. Click on &quot;API Tokens&quot;
                  <br />
                  3. Create and copy the OAuth Bearer Token
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
