'use client';

import { useState, useEffect, Suspense } from 'react'; 
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Player from '@/components/audio/Player';
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'next/navigation';  // Add this import if not already present


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

function MeetingViewContent({ meeting }: { meeting: Meeting }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1); 

    const highlightText = (text: string) => {
        if (!searchTerm) return text;
        
        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, i) => 
            part.toLowerCase() === searchTerm.toLowerCase() 
                ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark>
                : part
        );
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm) {
            const matches = meeting?.transcript.match(new RegExp(searchTerm, 'gi'));
            const matchCount = matches?.length || 0;

            if (matchCount > 0) {
                console.log(currentMatchIndex);
                setCurrentMatchIndex((prev) => {
                    const nextIndex = prev + 1;
                    const newIndex = nextIndex >= matchCount ? 0 : nextIndex;
                    
                    const marks = document.querySelectorAll('mark');
                    if (marks[newIndex]) {
                        marks[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    return newIndex;
                })
            }
        }
    };
    
    
    return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
        {/* Left Column - Topics */}
        <div className="w-full lg:w-1/4 p-4 border-b lg:border-b-0 lg:border-r overflow-y-auto">
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
        <div className="w-full lg:w-2/4 p-4 border-b lg:border-b-0 lg:border-r overflow-y-auto">
          <ScrollArea className="h-[calc(100vh-16rem)] lg:h-full">
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
        <div className="w-full lg:w-1/4 p-4 overflow-y-auto">
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Transcript</h2>
                  <button
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: meeting.title,
                            text: `Check out this meeting transcript: ${meeting.title}`,
                            url: window.location.href,
                          });
                        } catch (err) {
                          console.log('Share failed:', err);
                        }
                      } else {
                        // Fallback to copy
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    title="Share"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                    >
                      <path
                        d="M2.5 3.5C2.5 2.67157 3.17157 2 4 2H7.75C8.57843 2 9.25 2.67157 9.25 3.5V4.5C9.25 4.77614 9.02614 5 8.75 5C8.47386 5 8.25 4.77614 8.25 4.5V3.5C8.25 3.22386 8.02614 3 7.75 3H4C3.72386 3 3.5 3.22386 3.5 3.5V11.5C3.5 11.7761 3.72386 12 4 12H7.75C8.02614 12 8.25 11.7761 8.25 11.5V10.5C8.25 10.2239 8.47386 10 8.75 10C9.02614 10 9.25 10.2239 9.25 10.5V11.5C9.25 12.3284 8.57843 13 7.75 13H4C3.17157 13 2.5 12.3284 2.5 11.5V3.5ZM6.75 7.5C6.75 7.22386 6.97386 7 7.25 7H11.75C12.0261 7 12.25 7.22386 12.25 7.5C12.25 7.77614 12.0261 8 11.75 8H7.25C6.97386 8 6.75 7.77614 6.75 7.5ZM7.25 5C6.97386 5 6.75 5.22386 6.75 5.5C6.75 5.77614 6.97386 6 7.25 6H13.75C14.0261 6 14.25 5.77614 14.25 5.5C14.25 5.22386 14.0261 5 13.75 5H7.25ZM7.25 9C6.97386 9 6.75 9.22386 6.75 9.5C6.75 9.77614 6.97386 10 7.25 10H10.75C11.0261 10 11.25 9.77614 11.25 9.5C11.25 9.22386 11.0261 9 10.75 9H7.25Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                    Share
                  </button>
                </div>
                <input 
                  type="text" 
                  placeholder="Search transcript"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentMatchIndex(-1); // Reset index when search term changes
                  }}
                  onKeyDown={handleSearchKeyDown}
                  className="px-3 py-1 text-sm border rounded-md w-full sm:w-40"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-16rem)]">
                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="whitespace-pre-wrap font-mono text-sm">
                        {highlightText(meeting.transcript)}
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
      <div className="h-16 border-t bg-background sticky bottom-0">
        <section className="flex h-full items-center px-4">
              <Player />
        </section>
      </div>
    </div>
    )
}

export default function MeetingView() {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const meetingId = searchParams.get('id');

  console.log(meetingId);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchMeeting = async () => {
      try {
         // Fetch transcript from public directory
         const transcriptResponse = await fetch(`/${meetingId}.txt`);
         const transcriptText = await transcriptResponse.text();

         const summaryResponse = await fetch(`/${meetingId}_summary.txt`);
         const summaryText = await summaryResponse.text();

         const tagsResponse = await fetch(`/${meetingId}_tags.json`);
         const tags = await tagsResponse.json();
        // Simulate API call
        const meetingObject = {
          id: '1',
          title:  `${meetingId} meeting`,
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
    <Suspense fallback={<div>Loading...</div>}>
        <MeetingViewContent meeting={meeting} />
    </Suspense>
  );
}
