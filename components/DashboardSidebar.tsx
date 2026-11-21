import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { Plus } from "lucide-react"

const menuItemByRole = {
  customer: [],
  admin: [],
}

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const role = session?.user?.role || "customer"
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {
            // menuItemByRole[role].map((item) => (
            //   <SidebarMenuItem key={item.name}>
            //     <SidebarMenuButton render={<a href={item.url} />}>
            //       <item.icon />
            //       <span>{item.name}</span>
            //     </SidebarMenuButton>
            //   </SidebarMenuItem>
            // ))
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
