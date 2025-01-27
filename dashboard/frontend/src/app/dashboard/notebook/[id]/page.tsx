'use client'

import { useParams, useSearchParams } from 'next/navigation';
import NotebookPage from '@/components/notebook/NotebookPage';
import { useUserStore } from '@/app/store';
import { useEffect } from 'react';

export default function Notebook() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const id = params.id as string;
  const name = searchParams.get('name') || '';
  const returnUrl = searchParams.get('returnUrl') || '';

  // if (!user?.id) {
  //   return <div>Loading...</div>;
  // }

  // return (
  //   <NotebookPage notebookId={id} userId={user.id} name={name}/>
  // )
  useEffect(() => {
    // TODO: Set up notebook name/id
    const notebookUrl = 'http://localhost:2718/?file=new_notebook.py';
    
    // Store the return URL before redirecting
    sessionStorage.setItem('returnUrl', returnUrl);
    window.location.replace(notebookUrl);
  }, []);
}