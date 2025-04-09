'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Player from '@/components/audio/Player';


interface Meeting {
  id: string;
  title: string;
  date: string;
  transcript: string;
  summary: string;
}

export default function MeetingView() {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchMeeting = async () => {
      try {
        // Simulate API call
        const mockMeeting = {
          id: '1',
          title: 'Team Sync Meeting',
          date: '2024-03-20',
          transcript: 'This is where the full transcript would go...',
          summary: 'Key points discussed: Project timeline, resource allocation, next steps.',
        };
        setMeeting(mockMeeting);
      } catch (error) {
        console.error('Error fetching meeting:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, []);

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Meeting not found
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Topics */}
        <div className="w-1/4 p-4 border-r">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{meeting.title}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(meeting.date).toLocaleDateString()}
            </p>
            
            {/* Topics Section */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Topics Discussed</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {['Trade shows', 'Field sales', 'Lead management', 'Voice recognition'].map((topic) => (
                    <span key={topic} className="px-3 py-1 bg-secondary rounded-full text-sm text-center">
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Middle Column - Summary and Details */}
        <div className="w-2/4 p-4 border-r">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {/* Summary Section */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Summary</h2>
                </CardHeader>
                <CardContent>
                  <p className="leading-7">{meeting.summary}</p>
                </CardContent>
              </Card>

              {/* Action Items Section */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Action Items</h2>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Follow up on trade show leads</li>
                    <li>Review wearable technology proposal</li>
                    <li>Update CRM system</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Right Column - Transcript */}
        <div className="w-1/4 p-4">
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Transcript</h2>
                <input 
                  type="text" 
                  placeholder="Find or Replace"
                  className="px-3 py-1 text-sm border rounded-md w-40"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-4 p-4">
                  {/* Example transcript messages */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        C
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Charles</span>
                          <span className="text-sm text-muted-foreground">02:45</span>
                        </div>
                        <p>{meeting.transcript}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Audio Player */}
      <div className="h-16 border-t bg-background container-wrapper">
        <section className="flex h-full items-center">
              <Player />
        </section>
      </div>
    </div>
  );
}
