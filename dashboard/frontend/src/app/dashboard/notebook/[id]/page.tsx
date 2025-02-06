'use client'

import { useParams, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/app/store';
import { useEffect } from 'react';
import { existingNotebookURL } from '@/lib/marimo/urls';

export default function Notebook() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const notebook_id = params.id as string;
  const name = searchParams.get('name') || '';
  const returnUrl = searchParams.get('returnUrl') || '';

  useEffect(() => {
    if (!user?.id) {
      console.warn("User not found");
      return;
    }

    const notebookUrl = existingNotebookURL(name, user.id, notebook_id);
    console.log("notebookUrl", notebookUrl);
    // Store the return URL before redirecting
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    }
    window.location.replace(notebookUrl);
  }, [name, user, notebook_id, returnUrl]); // Note: using user instead of user.id since user might be null

  return <div>Loading...</div>; // Show loading state while redirecting
}