'use client'

import { useParams, useSearchParams } from 'next/navigation';
import NotebookPage from '@/components/notebook/NotebookPage';
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

  if (!user?.id) {
    console.error("User not found");
    return <div>User not found</div>;
  }

  useEffect(() => {
    const notebookUrl = existingNotebookURL(name, user.id, notebook_id);
    console.log("notebookUrl", notebookUrl);
    // Store the return URL before redirecting
    sessionStorage.setItem('returnUrl', returnUrl);
    window.location.replace(notebookUrl);
  }, []);
}