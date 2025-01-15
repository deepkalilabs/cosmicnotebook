"use client"

import { useState } from 'react'
import { ExternalLinkIcon, Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useUserStore } from '@/app/store'
import { getApiUrl } from '@/app/lib/config'
import { ConnectorsButtonProps } from '@/app/types'


const formSchema = z.object({
  apiKey: z.string().min(30, { message: "API Key is required" }),
  baseUrl: z.string().min(20, { message: "Base URL is required" }),
  userId: z.string().min(5, { message: "User ID is required" })
})

export default function FormsPosthog({onHandleCreateConnector}: ConnectorsButtonProps) {
  const { user } = useUserStore();
  const userId = user?.id || '';
  const notebookId = window.location.pathname.split('/').pop()?.split('?')[0] || '';
  const [isConnecting, setIsConnecting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
      apiKey: '',
      baseUrl: 'https://us.posthog.com',
    },
  });

  //TODO: Possibly enable multiple posthog connectors for different API keys. This is a temporary fix to prevent duplicate connectors.
  //If the connector is already in the list, don't add it again
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setIsConnecting(true);
    
    try {
      const response = await fetch(`${getApiUrl()}/connectors/${userId}/${notebookId}/posthog`);
      console.log("Checking if PostHog is connected", response)
      const data = await response.json();
      const dataBody = JSON.parse(data.body)
      
      const isConnected = dataBody.is_connected;
      console.log("isConnected", isConnected)
      
      if (isConnected) {
        form.setError("root", { 
          message: "PostHog is already connected. Support for multiple connections is in the roadmap." 
        });
        setIsConnecting(false);
        return;
      }

      if (!notebookId) {
        form.setError("root", { message: "Invalid notebook ID" });
        setIsConnecting(false);
        return;
      }

      onHandleCreateConnector(
        'posthog',
        {
          api_key: values.apiKey,
          base_url: values.baseUrl,
        },
        values.userId,
        notebookId
      );
      setTimeout(() => {
        setIsConnecting(false);
      }, 4000);
    } catch (err) {
      //TODO: Load error message from backend
      console.error("Error connecting to PostHog", err);
      form.setError("root", { 
        message: "Failed to connect to PostHog. Please check your credentials." 
      });
      setIsConnecting(false);

    } 
  };

  return (  
    
      <Form {...form}>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Connect to PostHog</h2>
            <p className="text-muted-foreground">
              Connect PostHog to your notebook to create an AI agent to analyze your data.
            </p>
          </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PostHog API Key</FormLabel>
                <FormControl>
                  <Input placeholder="phx_1234..." {...field} />
                </FormControl>
                <FormDescription className="space-y-2">
                  <span className="block">
                    Find your API key in PostHog under Project Settings → Project API Key. Make sure to select the &quot;Read&quot; permission.
                    <a href="https://us.posthog.com/settings/project-settings/api-keys" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                      <ExternalLinkIcon className="w-4 h-4 ml-1" />
                    </a>
                  </span>
                  <span className="block">
                    <a href="https://ooo.mmhmm.app/watch/z_dnV4Ov6cUfTYuy4mHQxM" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-flex items-center">
                      Watch video tutorial
                      <ExternalLinkIcon className="w-4 h-4 ml-1" />
                    </a>
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://us.posthog.com" {...field} />
                </FormControl>
                <FormDescription>
                  Default is us.posthog.com. Change only if you are self-hosting PostHog.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          { form.formState.errors.root && <FormMessage>{form.formState.errors.root.message}</FormMessage> }
          <Button type="submit" disabled={isConnecting}>
            {isConnecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Connect
          </Button>
        </form>
    </Form>
  )
}
