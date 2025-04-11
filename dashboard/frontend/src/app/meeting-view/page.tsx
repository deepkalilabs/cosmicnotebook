'use client';
import MeetingViewContent from '@/components/meeting-content/MeetingContent';
import { Suspense } from 'react';


// Make the page com, useSearchParamsponent a server component
export default function MeetingView() {
 
    
  return (
        <Suspense fallback={<div>Loading...</div>}>
          <MeetingViewContent />
        </Suspense>
  );
}
