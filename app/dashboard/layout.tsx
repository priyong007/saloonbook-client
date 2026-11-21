
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { DashboardSidebar } from "@/components/DashboardSidebar"

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <main className="flex-1 min-w-0">
        {/* Dashboard Header */}
        <header className="h-16 flex items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout
