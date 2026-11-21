
"use client"

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

import {
  LayoutDashboard,
  CalendarDays,
  Scissors,
  UserRound,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react"

// Step 1: Role type
type UserRole = "customer" | "admin"

// Step 2: Menu item interface
interface MenuItem {
  name: string
  url: string
  icon: LucideIcon
  isFooter?: boolean
}

// Step 3: Menu items
const menuItemByRole: Record<UserRole, MenuItem[]> = {
  customer: [
    {
      name: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Appointments",
      url: "/dashboard/my-appointments",
      icon: CalendarDays,
    },
    {
      name: "Browse Services",
      url: "/dashboard/browse-services",
      icon: Scissors,
    },
    {
      name: "My Profile",
      url: "/dashboard/my-profile",
      icon: UserRound,
    },
    {
      name: "View Salon Site",
      url: "/",
      icon: Store,
      isFooter: true,
    },
  ],

  admin: [
    {
      name: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Appointments",
      url: "/dashboard/appointments",
      icon: CalendarDays,
    },
    {
      name: "Manage Services",
      url: "/dashboard/manage-services",
      icon: Scissors,
    },
    {
      name: "Customers",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      name: "My Profile",
      url: "/dashboard/my-profile",
      icon: UserRound,
    },
    {
      name: "View Salon Site",
      url: "/",
      icon: Store,
      isFooter: true,
    },
  ],
}

// Step 4: Dashboard Sidebar
export function DashboardSidebar() {
  const { data: session } = useSession()

  const role: UserRole =
    session?.user?.role === "admin" ? "admin" : "customer"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <h2 className="font-bold text-xl">SalonBook</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pt-6">
          <SidebarMenu>
            {menuItemByRole[role]
              .filter((item) => !item.isFooter)
              .map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton render={<a href={item.url} />}>
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {menuItemByRole[role]
            .filter((item) => item.isFooter)
            .map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton render={<a href={item.url} />}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

