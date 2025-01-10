'use client'

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import NotebookPage from '@/components/notebook/NotebookPage';
import { useUserStore } from '@/app/store';

export default function Notebook() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const id = params.id as string;
  const name = searchParams.get('name') || '';

  if (!user?.id) {
    return <div>Loading...</div>;
  }

  return (
    <NotebookPage notebookId={id} userId={user.id} name={name}/>
  )
}