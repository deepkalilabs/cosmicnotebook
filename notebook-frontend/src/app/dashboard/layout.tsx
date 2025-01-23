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
    href: "#",
    icon: <Plug className="h-4 w-4" />,
  },
  {
    title: "All Jobs",
    href: "/dashboard/jobs",
    icon: <Activity className="h-4 w-4" />,
  }
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r bg-background">
      <div className="flex h-[60px] items-center border-b px-6">
        <span className="font-semibold">Cosmic Notebook</span>
      </div>
      <nav className="space-y-1 p-2">
        {sidebarNavItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start gap-2"
            asChild
          >
            <a href={item.href}>
              {item.icon}
              <span>{item.title}</span>
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

      const userData = {
        id: authUser.id,
        email: authUser.email
      };
      
      setUser(userData);

      //Find and store the users organization they belong to
      const { data: orgUser, error: orgError } = await supabase
      .from('org_users')
      .select('*')
      .eq('user_id', authUser.id)
      .single();
      console.log(orgUser);
      debugger;

      if (orgError) {
        console.error('Error getting organization:', orgError);
        setOrgUsers([]);
        return;
      }
      setOrgUsers([orgUser]);
    };
    
    checkAuth();
  }, [router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}