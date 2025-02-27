"use client"

import { Home, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/ui/sidebar"
import { supabase } from '@/lib/supabase';
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CSPostHogProvider } from "../provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useUserStore, useOrgUserStore } from "@/app/store"
import { toast } from "@/hooks/use-toast";


const sidebarNavItems = [
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "All Jobs",
    href: "/dashboard/jobs",
    icon: <Activity className="h-4 w-4" />,
  }
]

function AppSidebar() {
  const { orgUsers } = useOrgUserStore();
  const orgId = orgUsers[0]?.org_id;

  const copyOrgId = () => {
    if (orgId) {
      navigator.clipboard.writeText(orgId);
      toast({
        title: "Org ID copied to clipboard",
        description: "You can now paste it into your connector configuration.",
      });
    }
  };

  return (
    <Sidebar className="border-r bg-background">
      <div className="flex flex-col h-[85px] justify-center border-b px-6 pt-2">
        <h1 className="text-xl font-bold tracking-tight truncate">Cosmic Notebook</h1>
        {orgId && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mt-2">Org ID: {orgId}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 mt-2"
              onClick={copyOrgId}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </Button>
          </div>
        )}
      </div>
      <nav className="space-y-1 p-2">
        {sidebarNavItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start gap-2 data-[collapsed=true]:justify-center"
            asChild
          >
            <a href={item.href}>
              {item.icon}
              <span className="data-[collapsed=true]:hidden">{item.title}</span>
            </a>
          </Button>
        ))}
      </nav>
    </Sidebar>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { setOrgUsers } = useOrgUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session || !session.user) {
        setUser(null);
        router.push('/auth/signin');
        return;
      }

      console.log('Session', {user: session.user, token: session.access_token});

      if(!session.user.email || !session.user.id) {
        setUser(null);
        router.push('/auth/signin');
        return;
      }

      const userData = {
        id: session.user.id,
        email: session.user.email,
        token: session.access_token
      };
      
      setUser(userData);

      //Find and store the users organization they belong to
      //TODO Switch to backend call
      const { data: orgUser, error: orgError } = await supabase
        .from('org_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      console.log('Org User', orgUser);

      if (orgError) {
        console.log('Error getting organization:', orgError);
        setOrgUsers([]);
        return;
      }
      setOrgUsers([orgUser]);
    };
    
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed', {event, session});
      if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/auth/signin');
      } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        checkAuth();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [router, setUser, setOrgUsers]);

  return (
    <CSPostHogProvider>
      <SidebarProvider>
        {/* <SidebarTrigger className="fixed left-0 top-[14px] z-20" /> */}
        <AppSidebar />
        <main className="flex-1 pl-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    </CSPostHogProvider>
  )
}