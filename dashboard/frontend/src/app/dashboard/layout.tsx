"use client"

import { Home, Activity, Plug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/ui/sidebar"
import { supabase } from '@/lib/supabase';
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useUserStore, useOrgUserStore } from "@/app/store"


const sidebarNavItems = [
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Connectors Admin",
    href: "/dashboard/connectors-admin",
    icon: <Plug className="h-4 w-4" />,
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

  return (
    <Sidebar className="border-r bg-background">
      <div className="flex flex-col h-[85px] justify-center border-b px-6 pt-2">
        <h1 className="text-xl font-bold tracking-tight truncate">Cosmic Notebook</h1>
        {orgId && <span className="text-xs text-muted-foreground mt-2">Org ID: {orgId}</span>}
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
      const { data: { user: authUser }, error } = await supabase.auth.getUser();

      if (error || !authUser || !authUser.email || !authUser.id) {
        setUser(null);
        router.push('/auth/signin');
        return;
      }

      console.log(error, authUser, authUser.email, authUser.id);

      const userData = {
        id: authUser.id,
        email: authUser.email
      };
      
      setUser(userData);

      //Find and store the users organization they belong to
      //TODO Switch to backend call
      const { data: orgUser, error: orgError } = await supabase
        .from('org_users')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      console.log(orgUser);

      if (orgError) {
        console.log('Error getting organization:', orgError);
        setOrgUsers([]);
        return;
      }
      setOrgUsers([orgUser]);
    };
    
    checkAuth();
  }, [router]);

  return (
    <SidebarProvider>
      {/* <SidebarTrigger className="fixed left-0 top-[14px] z-20" /> */}
      <AppSidebar />
      <main className="flex-1 pl-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}