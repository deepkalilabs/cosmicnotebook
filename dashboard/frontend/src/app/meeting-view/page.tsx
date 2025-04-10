'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Player from '@/components/audio/Player';
import ReactMarkdown from 'react-markdown';


interface Meeting {
  id: string;
  title: string;
  date: string;
  transcript: string;
  summary: string;
  topics: string[];
  sentiments: {
    [key: string]: number;
  };
}

export default function MeetingView() {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchMeeting = async () => {
      try {
         // Fetch transcript from public directory
         const transcriptResponse = await fetch('/medme.txt');
         const transcriptText = await transcriptResponse.text();

         const summaryResponse = await fetch('/medme_summary.txt');
         const summaryText = await summaryResponse.text();

         const tagsResponse = await fetch('/medme_tags.json');
         const tags = await tagsResponse.json();
        // Simulate API call
        const meetingObject = {
          id: '1',
          title: 'MedMe Meeting',
          date: '2024-04-04',
          transcript: transcriptText,
          summary: summaryText,
          topics: tags.tags,
          sentiments: tags.sentiments,
        };
        setMeeting(meetingObject);
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
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left Column - Topics */}
        <div className="w-full lg:w-1/4 p-4 border-b lg:border-b-0 lg:border-r">
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
                  {meeting.topics.map((topic) => (
                    <span key={topic} className="px-3 py-1 bg-secondary rounded-full text-sm text-center">
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
             
            {/* Topics Section */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Sentiments</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {Object.entries(meeting.sentiments).map(([sentiment, count]) => (
                    <span key={sentiment} className="px-3 py-1 bg-secondary rounded-full text-sm text-center">
                      {sentiment}: {count}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Middle Column - Summary and Details */}
        <div className="w-full lg:w-2/4 p-4 border-b lg:border-b-0 lg:border-r">
          <ScrollArea className="h-[50vh] lg:h-full">
            <div className="space-y-6">
              {/* Summary Section */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Summary</h2>
                </CardHeader>
                <CardContent>
                  <ReactMarkdown className="leading-7 prose dark:prose-invert max-w-none">
                    {meeting.summary}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Right Column - Transcript */}
        <div className="w-full lg:w-1/4 p-4">
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl font-semibold">Transcript</h2>
                <input 
                  type="text" 
                  placeholder="Find or Replace"
                  className="px-3 py-1 text-sm border rounded-md w-full sm:w-40"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[50vh] lg:h-[calc(100vh-16rem)]">
                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="whitespace-pre-wrap font-mono text-sm">
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
      <div className="h-16 border-t bg-background">
        <section className="flex h-full items-center px-4">
              <Player />
        </section>
      </div>
    </div>
  );
}
