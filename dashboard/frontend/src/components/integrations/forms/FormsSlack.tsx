"use client"

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useOrgUserStore } from '@/app/store'
import { ConnectorsButtonProps } from '@/app/types'
import BetaTag from '@/components/BetaTag'

const formSchema = z.object({
  slack_bot_token: z.string().min(30, { message: "Slack Bot Token is required" }),
})

//TODO: Add a way to test the connection to Slack
//TODO: Add doc to the form to get the channel id and bot token
export default function SlackForm({onHandleCreateConnector, handleCloseDialog}: ConnectorsButtonProps & {handleCloseDialog: () => void}) {
  const [isConnecting, setIsConnecting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          slack_bot_token: '',
      }
    });
  
    const onSubmit = async (credentials: z.infer<typeof formSchema>) => {
      console.log("Credentials submitting...", credentials);
      setIsConnecting(true);
      
      try {
          await onHandleCreateConnector('slack', credentials);
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
            name="slack_bot_token"
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
  