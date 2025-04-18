import type { LucideIcon } from "lucide-react"

interface NotificationCardProps {
  notification: {
    id: string
    title: string
    description: string
    time: string
    icon: LucideIcon
  }
}

export function NotificationCard({ notification }: NotificationCardProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="rounded-full p-1.5 bg-primary/10 text-primary">
        <notification.icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-xs text-muted-foreground">{notification.description}</p>
        <p className="text-xs text-muted-foreground">{notification.time}</p>
      </div>
    </div>
  )
}
