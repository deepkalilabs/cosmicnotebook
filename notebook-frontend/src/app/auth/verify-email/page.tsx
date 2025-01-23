'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.email || !session?.user?.id) {
          throw new Error('No authenticated user found');
        }

        const emailDomain = session.user.email.split('@')[1];
        const companyName = emailDomain.split('.')[0];
        let organizationId;
        
        // First try to get existing organization
        const { data: existingOrg, error: getOrgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('domain', emailDomain)
            .single();

        if (getOrgError && getOrgError.code !== 'PGRST116') { // PGRST116 is "not found" error
            console.error('Error checking existing organization:', getOrgError);
            setError(getOrgError.message || 'An unexpected error occurred');
            setIsRedirecting(false);
            return;
        }

        if (existingOrg) {
            organizationId = existingOrg.id;
        } else {
            // Create new organization if none exists
            const { data: newOrganization, error: createOrgError } = await supabase
                .from('organizations')
                .insert({
                    name: companyName,
                    domain: emailDomain,
                    created_by: session.user.id,
                })
                .select()
                .single();

            if (createOrgError) {
                console.error('Error creating organization:', createOrgError);
                setError(createOrgError.message || 'An unexpected error occurred');
                setIsRedirecting(false);
                return;
            }

            organizationId = newOrganization.id;
        }

        // create unique org_users entry
        console.log('Linking user to organization');
        const { data: orgUserData, error: orgUserError } = await supabase
            .from('org_users')
            .insert({
              org_id: organizationId,
              user_id: session.user.id,
            })
            .select()
            .single();

          if (orgUserError) {
            console.error('Error creating link user to organization:', orgUserError);
            setError(orgUserError.message);
            setIsRedirecting(false);
            return;
          }

          console.log('Link user to organization created successfully:', orgUserData);
        

        // Start redirect after a brief delay to show success message
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } catch (error) {
        console.error('Session check error:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setIsRedirecting(false);
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Email Verified</CardTitle>
          <CardDescription className="text-center">
            Your email has been successfully verified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isRedirecting ? (
            <div className="space-y-4">
              <Alert variant="default" className="border-green-500 text-green-500">
                <AlertDescription>
                  Email verification successful! You can now sign in to your account.
                </AlertDescription>
              </Alert>
              <div className="flex justify-center items-center space-x-2">
                <Icons.spinner className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Redirecting to sign in...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                You can now proceed to sign in to your account.
              </p>
              <Button
                className="w-full"
                onClick={() => router.push('/auth/signin')}
              >
                Continue to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}