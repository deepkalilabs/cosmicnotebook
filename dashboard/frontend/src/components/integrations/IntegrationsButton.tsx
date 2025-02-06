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

interface DataSource {
    id: string;
    name: string;
    available: boolean;
    icon: string;
    form: React.ReactNode;
}

export function IntegrationsButton({
  notebookId,
  onHandleCreateIntegration,
}: IntegrationsButtonProps) {
  const { isDialogOpen, handleOpenDialog, handleCloseDialog } = useConnectorHook();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);



  const [dataSources] = useState<DataSource[]>([
    //Return a logo based on the name
            { id: 'whatsapp', name: 'WhatsApp', available: false, icon: `https://img.logo.dev/whatsapp.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsWhatsapp notebookId={notebookId} onHandleCreateIntegration={onHandleCreateIntegration} handleCloseDialog={handleCloseDialog} /> },
            { id: 'slack', name: 'Slack', available: true, icon: `https://img.logo.dev/slack.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsSlack notebookId={notebookId} onHandleCreateIntegration={onHandleCreateIntegration} handleCloseDialog={handleCloseDialog} /> },
            { id: 'discord', name: 'Discord', available: false, icon: `https://img.logo.dev/discord.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsDiscord notebookId={notebookId} onHandleCreateIntegration={onHandleCreateIntegration} handleCloseDialog={handleCloseDialog} /> },
            { id: 'telegram', name: 'Telegram', available: false, icon: `https://img.logo.dev/telegram.org?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsTelegram notebookId={notebookId} onHandleCreateIntegration={onHandleCreateIntegration} handleCloseDialog={handleCloseDialog} /> },
            { id: 'microsoftteams', name: 'Microsoft Teams', available: false, icon: `https://img.logo.dev/teams.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsMicrosoftTeams notebookId={notebookId} onHandleCreateIntegration={onHandleCreateIntegration} handleCloseDialog={handleCloseDialog} /> },

]);

 
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
              Add Messaging Integration
            </Button>
          </SheetTrigger>
        </SheetTitle>
      </SheetHeader>
    
      <SheetContent className="w-[35vw] sm:max-w-[35vw]">
        <div className="py-1">
          {selectedSource ? (
            <>
              <Button variant="ghost" onClick={handleReset} className="mb-4 text-blue-500">
                ← Back to integrations
              </Button>
              {dataSources.find(source => source.id === selectedSource)?.form}
            </>
          ) : (
            <>
              <SheetHeader>
                <SheetTitle>Choose a messaging integration</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-4 py-4">
                {dataSources.map((source) => (
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

                <div className="col-span-3 border-t pt-4">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => window.open('mailto:charlesjavelona@gmail.com')}>
                    <span className="text-sm text-blue-500">Interested in a new integration? Email us to suggest an integration</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
