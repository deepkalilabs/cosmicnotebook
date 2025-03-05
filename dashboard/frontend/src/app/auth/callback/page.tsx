'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useUserStore } from '@/app/store';


export default function AuthCallback() {
  const router = useRouter();
  const { setUser } = useUserStore();


  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw new Error('Failed to get session');
        }

        if (!session?.user?.email) {
          throw new Error('No valid session found');
        }

        // Set cookies first before any redirects or other operations
        const response = await fetch('/api/auth/set-cookies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to set auth cookies');
        }

        console.log('Cookies set successfully');

        // Email validation
        const allowedGmails = ['shikharsakhuja@gmail.com', 'charlesjavelona@gmail.com'];
        if (session.user.email.includes('gmail.com') && !allowedGmails.includes(session.user.email)) {
          await supabase.auth.signOut();
          throw new Error('Please use your work email address');
        }

        // Set user in store
        setUser({
          id: session.user.id,
          email: session.user.email,
          token: session.access_token,
          refreshToken: session.refresh_token
        });

        // Organization handling
        const domain = session.user.email.split('@')[1];
        await handleOrganization(session.user.id, domain);

        // Finally, redirect
        const returnUrl = sessionStorage.getItem('returnUrl') || '/dashboard/projects';
        sessionStorage.removeItem('returnUrl');
        router.push(returnUrl);

      } catch (error) {
        console.error('Auth callback error:', error);
        const message = error instanceof Error ? error.message : 'Authentication failed';
        router.push(`/auth/signin?error=${encodeURIComponent(message)}`);
      }
    };

    handleCallback();
  }, [router, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Completing authentication...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

async function handleOrganization(userId: string, domain: string) {
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .eq('domain', domain)
    .single();

  if (orgError && orgError.code !== 'PGRST116') {
    throw new Error('Failed to fetch organization');
  }

  if (!org) {
    const { data: newOrg, error: createOrgError } = await supabase
      .from('organizations')
      .insert({
        name: domain.split('.')[0],
        domain,
        created_by: userId
      })
      .select('id')
      .single();

    if (createOrgError) {
      throw new Error('Failed to create organization');
    }

    const { error: orgUserError } = await supabase
      .from('org_users')
      .insert({
        org_id: newOrg.id,
        user_id: userId
      });

    if (orgUserError) {
      throw new Error('Failed to link user to organization');
    }
  }
}