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
import BetaTag from '@/components/BetaTag'

import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
  channelId: z.string().min(5, { message: "Channel ID is required" }),
  slackBotToken: z.string().min(30, { message: "Slack Bot Token is required" }),
})

//TODO: Add a way to test the connection to Slack
//TODO: Add doc to the form to get the channel id and bot token
export default function MicrosoftTeamsForm({onHandleCreateConnector, handleCloseDialog}: ConnectorsButtonProps & {handleCloseDialog: () => void}) {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelId: '',
      slackBotToken: ''
    }
  });

  //TODO: Possibly enable multiple posthog connectors for different API keys. This is a temporary fix to prevent duplicate connectors.
  //If the connector is already in the list, don't add it again
  const onSubmit = async (credentials: z.infer<typeof formSchema>) => {
    console.log("Credentials submitting...", credentials);
    setIsConnecting(true);
    
    try {
      const res = await onHandleCreateConnector('microsoftteams', credentials);
      console.log("Response from onHandleCreateIntegration", res);
      
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
          Integrate with Slack 
          <BetaTag className="ml-2" />
        </h2>
        <p className="text-muted-foreground">
          Connect Slack to your notebook to send and receive messages.
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

          <FormField
            control={form.control}
            name="channelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slack Channel ID</FormLabel>
                <FormControl>
                  <Input placeholder="12354" {...field} />
                </FormControl>
                <FormDescription>
                  To find your Channel ID:
                  <br />
                  1. Right-click your Slack channel
                  <br />
                  2. Click &quot;View channel details&quot;
                  <br />
                  3. Scroll to bottom for Channel ID
                </FormDescription>
                <FormMessage />
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
