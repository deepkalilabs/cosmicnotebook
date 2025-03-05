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
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw new Error('Failed to get session');
        }
     
        if (!session?.user?.email) {
          router.push('/auth/signin?error=No valid session found');
          return;
        }
     
        const allowedGmails = ['shikharsakhuja@gmail.com', 'charlesjavelona@gmail.com'];
        
        if (session.user.email.includes('gmail.com') && !allowedGmails.includes(session.user.email)) {
          await supabase.auth.signOut();
          router.push('/auth/signin?error=Please use your work email address');
          return;
        }


        document.cookie = `auth_token=${session.access_token}; path=/; secure; SameSite=Strict; HttpOnly; expires=${new Date(Date.now() + 15 * 60 * 1000).toUTCString()}`;
        console.log('Client - Setting auth_token:', session.access_token);
        router.push('/dashboard/projects');
     
        const domain = session.user.email.split('@')[1];
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('domain', domain)
          .single();
     
        if (orgError && orgError.code !== 'PGRST116') { // Ignore not found error
          console.error('Organization fetch error:', orgError);
          throw new Error('Failed to fetch organization');
        }
     
        if (!org) {
          const { data: newOrg, error: createOrgError } = await supabase
            .from('organizations')
            .insert({
              name: domain.split('.')[0],
              domain,
              created_by: session.user.id
            })
            .select('id')
            .single();
     
          if (createOrgError) {
            console.error('Organization creation error:', createOrgError);
            throw new Error('Failed to create organization');
          }
     
          const { error: orgUserError } = await supabase
            .from('org_users')
            .insert({
              org_id: newOrg.id,
              user_id: session.user.id
            });
     
          if (orgUserError) {
            console.error('Org user creation error:', orgUserError);
            throw new Error('Failed to link user to organization');
          }

          setUser({
            id: session.user.id,
            email: session.user.email,
            token: session.access_token
          });
        }


      // Redirect with token as query parameter
      const returnUrl = sessionStorage.getItem('returnUrl') || '/dashboard/projects';
      sessionStorage.removeItem('returnUrl');
      //const redirectUrl = `${returnUrl}?token=${encodeURIComponent(session.access_token)}`;
      const redirectUrl = `${returnUrl}`
      console.log('Redirecting to:', redirectUrl);
      router.push(redirectUrl);

      } catch (error) {
        console.error('Auth callback error:', error);
        const message = error instanceof Error ? error.message : 'Authentication failed';
        router.push(`/auth/signin?error=${encodeURIComponent(message)}`);
      }
     };

    handleAuthCallback();
  }, [router]);

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