import { AppSidebar } from "../app-sidebar"

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-auto bg-background">{children}</div>
    </div>
  )
}
