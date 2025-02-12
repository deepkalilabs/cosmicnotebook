"use client"

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useOrgUserStore, useUserStore, useConnectorStore } from '@/app/store'
import { ConnectorCredentials, ConnectorsButtonProps } from '@/app/types'
import BetaTag from '@/components/BetaTag'

import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
  slackBotToken: z.string().min(30, { message: "Slack Bot Token is required" }),
})

//TODO: Add doc to the form to get the channel id and bot token

export default function FormsSlack({onHandleCreateConnector, handleCloseDialog}: ConnectorsButtonProps & {handleCloseDialog: () => void}) {
  const { user } = useUserStore();
  const { orgUsers } = useOrgUserStore();
  const { addConnector } = useConnectorStore();
  const userId = user?.id || '';
  const orgId = orgUsers[0]?.org_id || '';
  const [isConnecting, setIsConnecting] = useState(false);


  
  // Update Slack install URL with the correct redirect URI
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slackBotToken: ''
    }
  });

  //TODO: Possibly enable multiple posthog connectors for different API keys. This is a temporary fix to prevent duplicate connectors.
  //If the connector is already in the list, don't add it again
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Credentials submitting...", values);
    setIsConnecting(true);
    
    try {
      const res = await onHandleCreateConnector('slack', values, userId, orgId);
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
      addConnector(res.data.body as unknown as ConnectorCredentials);
      toast({
        title: "Success",
        description: "Connector created",
        variant: "default"
      });

    } catch (err) {
      console.error("Error connecting to Slack", err);
      form.setError("root", { 
        message: "Failed to connect to Slack. Please check your credentials." 
      });
      setIsConnecting(false);
      throw err; // Re-throw the error to be handled by the caller
    } 
  };

  return (  
    <Form {...form}>
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          Connect to Slack 
          <BetaTag className="ml-2" />
        </h2>
        <p className="text-muted-foreground">
          Connect Slack to your notebook to read and write messages.
        </p>
        <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
          👉 Need help setting up Slack? Check our <a 
            href="https://github.com/deepkalilabs/cosmicnotebook/blob/integration/docs/notebook/integrations/slack.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary font-medium"
          >
            step-by-step guide
          </a> for detailed instructions.
        </p>
      </div>
      

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <FormField
            control={form.control}
            name="slackBotToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slack Bot Token</FormLabel>
                <FormControl>
                  <Input placeholder="xoxb-1234567890" {...field} />
                </FormControl>
                <FormDescription>
                  To find your Bot Token: 
                  <br />
                  1. Go to the Slack API
                  <br />
                  2. Click on &quot;OAuth & Permissions&quot;
                  <br />
                  3. Copy the Bot User OAuth Token
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
