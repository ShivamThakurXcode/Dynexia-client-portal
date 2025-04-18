import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bell, Clock, FileText, MessageSquare } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectCard } from "@/components/project-card"
import { NotificationCard } from "@/components/notification-card"
import { getProjects } from "@/lib/actions/projects"
import { getMessages } from "@/lib/actions/messages"
import { getDocuments } from "@/lib/actions/documents"
import { formatDate } from "@/lib/utils"

export default async function DashboardPage() {
  const { projects = [], error: projectsError } = (await getProjects()) || {}
  const { messages = [], error: messagesError } = (await getMessages()) || {}
  const { documents = [], error: documentsError } = (await getDocuments()) || {}

  // Create notifications from recent activities
  const notifications = [
    ...messages.slice(0, 3).map((message) => ({
      id: message.id,
      title: "New message received",
      description: `${message.sender.name} sent a message: ${message.content.substring(0, 30)}${message.content.length > 30 ? "..." : ""}`,
      time: formatDate(message.createdAt.toString()),
      icon: MessageSquare,
    })),
    ...documents.slice(0, 2).map((document) => ({
      id: document.id,
      title: "Document uploaded",
      description: `${document.name} was uploaded to ${document.project?.name || "your documents"}`,
      time: formatDate(document.createdAt.toString()),
      icon: FileText,
    })),
  ]

  // Get upcoming tasks from project milestones
  const upcomingTasks = projects
    .flatMap((project) =>
      project.milestones?.map((milestone) => ({
        id: milestone.id,
        title: milestone.name,
        project: project.name,
        dueDate: formatDate(milestone.date.toString()),
      })),
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3)

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
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                )}
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
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <div key={task.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.project}</p>
                      </div>
                      <Badge variant="outline">{task.dueDate}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming tasks</p>
                )}
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
                  Create New Project
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
              {projects.filter((p) => p.status !== "Completed").length > 0 ? (
                projects
                  .filter((p) => p.status !== "Completed")
                  .map((project) => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No active projects yet.</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/projects/new">Create a new project</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.filter((p) => p.status === "Completed").length > 0 ? (
                projects
                  .filter((p) => p.status === "Completed")
                  .map((project) => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No completed projects yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.length > 0 ? (
                projects.map((project) => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No projects found.</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/projects/new">Create your first project</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
