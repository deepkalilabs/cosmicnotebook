"use client"

import { Notebook, Activity, Clock, Rocket, Cable } from "lucide-react"
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useUserStore, useNotebookDetailStore } from "@/app/store";
import { useEffect } from "react";
import { WebsocketContextProvider } from "@/contexts/websocket-context-provider";
import { CSPostHogProvider } from "@/app/provider";

const getNotebookNavItems = (id: string, name: string) => [
  {
    title: "Overview",
    href: `/dashboard/notebook/${id}/settings?name=${encodeURIComponent(name)}`,
    icon: <Activity className="h-4 w-4" />,
  },
  {
    title: "Notebook",
    href: `/dashboard/notebook/${id}?name=${encodeURIComponent(name)}`,
    icon: <Notebook className="h-4 w-4" />,
  },
  {
    title: "Deployment",
    href: `/dashboard/notebook/${id}/deployment?name=${encodeURIComponent(name)}`,
    icon: <Rocket className="h-4 w-4" />,
  },
  {
    title: "Integrations",
    href: `/dashboard/notebook/${id}/integrations?name=${encodeURIComponent(name)}`,
    icon: <Cable className="h-4 w-4" />,
  },
  {
    title: "Jobs",
    href: `/dashboard/notebook/${id}/jobs?name=${encodeURIComponent(name)}`,
    icon: <Activity className="h-4 w-4" />,
  },
  {
    title: "Schedule",
    href: `/dashboard/notebook/${id}/schedules?name=${encodeURIComponent(name)}`,
    icon: <Clock className="h-4 w-4" />,
  },
]

function TopNav() {
  const params = useParams()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const id = params.id as string
  const name = searchParams.get('name') || ''
  
  const items = getNotebookNavItems(id, name)

  return (
    <div className="flex flex-col -mt-3">
      <div className="relative">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border -z-10" />
          <nav className="flex px-6 gap-2">
            {items.map((item) => {
              const itemPath = item.href.split('?')[0]
              const currentPath = pathname.split('?')[0]
              const isActive = itemPath === currentPath

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm hover:text-foreground relative",
                    isActive
                      ? "text-foreground font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
  )
}
// function SidebarNav() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const id = params.id as string;
//   const name = searchParams.get('name') || '';
  
//   const items = getNotebookNavItems(id, name);

//   return (
//     <nav className="grid items-start gap-1">
//       {items.map((item) => {

//         const itemPath = item.href.split('?')[0];
//         const currentPath = pathname.split('?')[0];
//         const isActive = itemPath === currentPath;

//         return (
//           <Link
//             key={item.href}
//             href={item.href}
//           className={cn(
//             "flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
//             isActive
//               ? "bg-accent text-accent-foreground font-medium" 
//               : "text-muted-foreground"
//           )}
//         >
//           {item.icon}
//           {item.title}
//           </Link>
//         )
//       })}
//     </nav>
//   )
// }

// function Sidebar() {
//   return (
//     <div className="w-[240px] border-r bg-background">
//       <div className="flex h-14 items-center border-b px-6">
//         <span className="font-medium">Notebook Settings</span>
//       </div>
//       <div className="py-2 px-2">
//         <SidebarNav />
//       </div>
//     </div>
//   )
// }

export default function NotebookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUserStore();
  const params = useParams();
  const notebookId = params.id as string;
  const { notebookDetails, setNotebookDetails } = useNotebookDetailStore();

  useEffect(() => {
      if (user && notebookId) {
          fetch(`/api/notebook_details/${notebookId}`).then(res => {
            console.log('notebook details response:', res);
            return res.json();
          })
          .then((notebookDetailsData) => {
            setNotebookDetails(notebookDetailsData);
          })
      }
  }, [user, notebookId]);

  if (!notebookDetails) {
    return <div>Loading...</div>
  }

  console.log("notebookDetails", notebookDetails);

  return (
    <CSPostHogProvider>
    <WebsocketContextProvider notebookDetails={notebookDetails}>
      <div className="flex flex-col h-full">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-2">
          {children}
          </main>
        </div>
      </WebsocketContextProvider>
      </CSPostHogProvider>
    )
} 