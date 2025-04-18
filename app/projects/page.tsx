import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectCard } from "@/components/project-card"
import { Search } from "lucide-react"

export default function ProjectsPage() {
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
    {
      id: "4",
      name: "Marketing Campaign",
      status: "Planning",
      dueDate: "2024-01-15",
      progress: 10,
      description: "Q1 marketing campaign for new product launch",
    },
    {
      id: "5",
      name: "E-commerce Integration",
      status: "On Hold",
      dueDate: "2024-03-10",
      progress: 30,
      description: "Integrate online store with existing website",
    },
    {
      id: "6",
      name: "Content Strategy",
      status: "In Progress",
      dueDate: "2023-12-20",
      progress: 45,
      description: "Develop content strategy for blog and social media",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader heading="My Projects" text="View and manage all your projects." />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>You have {projects.length} active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search projects..." className="pl-8" />
              </div>
              <Button variant="outline">Filter</Button>
              <Button>New Project</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((project) => project.status === "In Progress")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="planning" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((project) => project.status === "Planning")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="review" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((project) => project.status === "Review")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
