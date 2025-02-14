"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import { useConnectorHook } from '@/hooks/useConnectorHook'
import { IntegrationsButtonProps } from '@/app/types'
import FormsWhatsapp from './forms/FormsWhatsapp'
import FormsSlack from './forms/FormsSlack'
import FormsDiscord from './forms/FormsDiscord'
import FormsTelegram from './forms/FormsTelegram'
import FormsMicrosoftTeams from './forms/FormsMicrosoftTeams'
import FormsPosthog from '@/components/connectors/forms/FormsPosthog'
import FormsDbt from '@/components/connectors/forms/FormsDBT'
import FormsClickhouse from '@/components/connectors/forms/FormsClickHouse'
import FormsSnowflake from '@/components/connectors/forms/FormsSnowflake'
import PylonForm from '@/components/connectors/forms/FormsPylon'
import FormsOpenAI from '@/components/connectors/forms/FormsOpenAI'
import FormsAnthropic from '@/components/connectors/forms/FormsAnthropic'
import FormsOpenRouter from '@/components/connectors/forms/FormsOpenRouter'
import FormsFal from '@/components/connectors/forms/FormsFal'
import FormsLooker from '@/components/connectors/forms/FormsLooker'
import FormsAmplitude from '@/components/connectors/forms/FormsAmplitude'
import FormsRedshift from '@/components/connectors/forms/FormsRedshift'
import FormsModal from '@/components/connectors/forms/FormsModal'

interface DataSource {
    id: string;
    name: string;
    available: boolean;
    icon: string;
    form: React.ReactNode;
}

export function IntegrationsButton({
  notebookId,
  onHandleCreateConnector,
}: IntegrationsButtonProps) {
  const { isDialogOpen, handleOpenDialog, handleCloseDialog } = useConnectorHook();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const [message_connectors] = useState<DataSource[]>([
    //Return a logo based on the name
    // TODO: Clean up functions being passed around. lots of duplicate code across create connectors and integrations.
    { id: 'whatsapp', name: 'WhatsApp', available: false, icon: `https://img.logo.dev/whatsapp.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsWhatsapp onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog} /> },
    { id: 'slack', name: 'Slack', available: true, icon: `https://img.logo.dev/slack.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsSlack onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog} /> },
    { id: 'discord', name: 'Discord', available: false, icon: `https://img.logo.dev/discord.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsDiscord onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog} /> },
    { id: 'telegram', name: 'Telegram', available: false, icon: `https://img.logo.dev/telegram.org?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsTelegram onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog} /> },
    // { id: 'microsoftteams', name: 'Microsoft Teams', available: false, icon: `https://img.logo.dev/teams.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsMicrosoftTeams onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog} /> },
  ]);


  const [customer_relationship_connectors] = useState<DataSource[]>([
    { id: 'posthog', name: 'PostHog', available: true, icon: `https://img.logo.dev/posthog.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsPosthog onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog}/> },
    { id: 'pylon', name: 'Pylon', available: true, icon: `https://img.logo.dev/usepylon.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <PylonForm onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog}/> },
    { id: 'dbt', name: 'dbt', available: false, icon: `https://img.logo.dev/dbt.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsDbt /> },
    { id: 'clickhouse', name: 'ClickHouse', available: false, icon: `https://img.logo.dev/clickhouse.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsClickhouse /> },
    { id: 'snowflake', name: 'Snowflake', available: false, icon: `https://img.logo.dev/snowflake.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsSnowflake /> },
    { id: 'looker', name: 'Looker', available: false, icon: `https://img.logo.dev/looker.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsLooker /> },
    { id: 'amplitude', name: 'Amplitude', available: false, icon: `https://img.logo.dev/amplitude.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsAmplitude /> },
    { id: 'redshift', name: 'Redshift', available: false, icon: `https://img.logo.dev/aws.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsRedshift /> },
    { id: 'salesforce', name: 'Salesforce', available: false, icon: `https://img.logo.dev/salesforce.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsRedshift /> },
  ]);

  const [ai_connectors] = useState<DataSource[]>([
    { id: 'openai', name: 'OpenAI', available: true, icon: `https://img.logo.dev/openai.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsOpenAI onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog} /> },
    { id: 'anthropic', name: 'Anthropic', available: true, icon: `https://img.logo.dev/anthropic.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsAnthropic onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog} /> },
    { id: 'openrouter', name: 'OpenRouter', available: true, icon: `https://img.logo.dev/openrouter.ai?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsOpenRouter onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog} /> },
    { id: 'fal', name: 'fal', available: true, icon: `https://img.logo.dev/fal.ai/?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsFal onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog} /> },
    { id: 'modal', name: 'Modal', available: true, icon: `https://img.logo.dev/modal.com/?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsModal onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog} /> },

  ]);

  const [all_connectors] = useState<DataSource[]>([...message_connectors, ...customer_relationship_connectors, ...ai_connectors]);
 
  const handleDialog = () => {
    if (isDialogOpen) {
      handleCloseDialog();
      handleReset();
    } else {
      handleOpenDialog();
    }
  }

  const handleReset = () => setSelectedSource(null);

  return (
    <Sheet open={isDialogOpen} onOpenChange={handleDialog}>
      <SheetHeader>
        <SheetTitle>
          <SheetTrigger asChild>
            <Button variant="default" className="justify-end gap-2">
              <Plus className="h-4 w-4 mr-2" />
              Browse Connectors
            </Button>
          </SheetTrigger>
        </SheetTitle>
      </SheetHeader>
    
      <SheetContent className="w-[35vw] sm:max-w-[35vw] overflow-y-auto">
        <div className="py-1">
          {selectedSource ? (
            <>
              <Button variant="ghost" onClick={handleReset} className="mb-4 text-blue-500">
                ← Back to integrations
              </Button>
              {all_connectors.find(source => source.id === selectedSource)?.form}
            </>
          ) : (
            <div>
              <SheetHeader>
                <SheetTitle>Choose a messaging integration</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-4 py-4">
                {message_connectors.map((source) => (
                  <Button
                    key={source.id}
                    variant="outline"
                    className={`flex-col h-24 space-y-2 ${!source.available && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!source.available}
                    onClick={() => source.available && setSelectedSource(source.id)}
                  >
                    <img src={source.icon} alt={source.name} className="h-8 w-8" />
                    <span>{source.name}</span>
                  </Button>
                ))}
              </div>

              <div>
                <SheetHeader>
                  <SheetTitle>Choose a data source integration</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                  {customer_relationship_connectors.map((source) => (
                    <Button key={source.id} 
                    variant="outline" 
                    className={`flex-col h-24 space-y-2 ${!source.available && 'opacity-50 cursor-not-allowed'}`} 
                    disabled={!source.available} 
                    onClick={() => source.available && setSelectedSource(source.id)}>
                      <img src={source.icon} alt={source.name} className="h-8 w-8" />
                      <span>{source.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <SheetHeader>
                <SheetTitle>Choose an AI integration</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-4 py-4">
                {ai_connectors.map((source) => (
                  <Button
                    key={source.id}
                    variant="outline"
                    className={`flex-col h-24 space-y-2 ${!source.available && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!source.available}
                    onClick={() => source.available && setSelectedSource(source.id)}
                  >
                    <img src={source.icon} alt={source.name} className="h-8 w-8" />
                    <span>{source.name}</span>
                  </Button>
                ))}
              </div>

              {/* <div className="col-span-3 border-t pt-4">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => window.open('mailto:charlesjavelona@gmail.com')}>
                  <span className="text-blue-500">Email us to suggest a new integration @ charles@agentkali.ai</span>
                </Button>
              </div> */}

            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
