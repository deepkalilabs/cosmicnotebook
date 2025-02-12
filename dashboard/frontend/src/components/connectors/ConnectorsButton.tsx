"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import { FormsPosthog, FormsDBT, FormsClickhouse, FormsSnowflake, FormsLooker, FormsAmplitude, FormsRedshift, FormsSlack} from './forms'
import { ConnectorsButtonProps } from '@/app/types'
import { useConnectorHook } from '@/hooks/useConnectorHook'


interface DataSource {
  id: string;
  name: string;
  available: boolean;
  icon: string;
  form: React.ReactNode;
}

export function ConnectorsButton({
  onHandleCreateConnector,
}: ConnectorsButtonProps) {
  const { isDialogOpen, handleOpenDialog, handleCloseDialog } = useConnectorHook();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
 
  const handleDialog = () => {
    if (isDialogOpen) {
      handleCloseDialog();
      handleReset();
    } else {
      handleOpenDialog();
    }
  }
  const handleReset = () => setSelectedSource(null);


  const [dataSources] = useState<DataSource[]>([
    { id: 'posthog', name: 'PostHog', available: true, icon: `https://img.logo.dev/posthog.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsPosthog onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog}/> },
    { id: 'slack', name: 'Slack', available: true, icon: `https://img.logo.dev/slack.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsSlack onHandleCreateConnector={onHandleCreateConnector} handleCloseDialog={handleCloseDialog}/> },
    { id: 'dbt', name: 'dbt', available: false, icon: `https://img.logo.dev/dbt.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsDBT /> },
    { id: 'clickhouse', name: 'ClickHouse', available: false, icon: `https://img.logo.dev/clickhouse.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsClickhouse /> },
    { id: 'snowflake', name: 'Snowflake', available: false, icon: `https://img.logo.dev/snowflake.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsSnowflake /> },
    { id: 'looker', name: 'Looker', available: false, icon: `https://img.logo.dev/looker.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsLooker /> },
    { id: 'amplitude', name: 'Amplitude', available: false, icon: `https://img.logo.dev/amplitude.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsAmplitude /> },
    { id: 'redshift', name: 'Redshift', available: false, icon: `https://img.logo.dev/aws.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, form: <FormsRedshift /> },
  ]);

  return (
    <Sheet open={isDialogOpen} onOpenChange={handleDialog}>
      <SheetHeader>
        <SheetTitle>
          <SheetTrigger asChild>
            <Button variant="default" className="justify-end gap-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Data Source
            </Button>
          </SheetTrigger>
        </SheetTitle>
      </SheetHeader>
    
      <SheetContent className="w-[35vw] sm:max-w-[35vw]">
        <div className="py-1">
          {selectedSource ? (
            <>
              <Button variant="ghost" onClick={handleReset} className="mb-4 text-blue-500">
                ← Back to connectors
              </Button>
              {dataSources.find(source => source.id === selectedSource)?.form}
            </>
          ) : (
            <>
              <SheetHeader>
                <SheetTitle>Choose a connector</SheetTitle>
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
