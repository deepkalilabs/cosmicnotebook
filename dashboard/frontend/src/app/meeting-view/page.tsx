'use client';
import MeetingViewContent from '@/components/meeting-content/MeetingContent';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


// Make the page com, useSearchParamsponent a server component
export default function MeetingView() {
    const searchParams = useSearchParams();
    const meetingId = searchParams.get('id');

    if (!meetingId) {
        return <div>Meeting not found</div>;
    }
    
  return (
        <Suspense fallback={<div>Loading...</div>}>
          <MeetingViewContent meetingId={meetingId} />
        </Suspense>
  );
}
