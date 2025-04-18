import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bell, Clock, FileText, MessageSquare } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectCard } from "@/components/project-card"
import { NotificationCard } from "@/components/notification-card"

export default function DashboardPage() {
  // Sample data
  const projects = [
    {
      id: "1",
      name: "Website Redesign",
      status: "In Progress",
      dueDate: "2023-12-15",
      progress: 65,
      description: "Complete overhaul of company website with new branding",
    },
    {
      id: "2",
      name: "Mobile App Development",
      status: "Planning",
      dueDate: "2024-02-28",
      progress: 20,
      description: "iOS and Android app for customer engagement",
    },
    {
      id: "3",
      name: "Brand Identity",
      status: "Review",
      dueDate: "2023-11-30",
      progress: 90,
      description: "New logo, color palette, and brand guidelines",
    },
  ]

  const notifications = [
    {
      id: "1",
      title: "New message received",
      description: "John commented on Website Redesign project",
      time: "2 hours ago",
      icon: MessageSquare,
    },
    {
      id: "2",
      title: "Document uploaded",
      description: "New wireframes added to Mobile App project",
      time: "Yesterday",
      icon: FileText,
    },
    {
      id: "3",
      title: "Deadline approaching",
      description: "Brand Identity project due in 3 days",
      time: "Yesterday",
      icon: Clock,
    },
  ]

  const upcomingTasks = [
    {
      id: "1",
      title: "Review homepage design",
      project: "Website Redesign",
      dueDate: "Tomorrow",
    },
    {
      id: "2",
      title: "Approve logo concepts",
      project: "Brand Identity",
      dueDate: "Nov 28",
    },
    {
      id: "3",
      title: "Provide feedback on wireframes",
      project: "Mobile App Development",
      dueDate: "Dec 5",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader heading="Dashboard" text="Welcome to your client portal dashboard." />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="gradient-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center">
                  <Bell className="mr-2 h-4 w-4 text-primary" />
                  Notifications
                </div>
              </CardTitle>
              <CardDescription>Stay updated on your projects</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/notifications">
                  View all notifications
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="gradient-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  Upcoming Tasks
                </div>
              </CardTitle>
              <CardDescription>Tasks requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.project}</p>
                    </div>
                    <Badge variant="outline">{task.dueDate}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/tasks">
                  View all tasks
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="gradient-border md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
              <CardDescription>Common tasks and actions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="justify-start" asChild>
                <Link href="/projects/new">
                  <FileText className="mr-2 h-4 w-4" />
                  View Project Details
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/documents/upload">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Document
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No completed projects yet.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/projects">View all projects</Link>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
