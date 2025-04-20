"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Input } from "../components/ui/input"
import { DashboardHeader } from "../components/dashboard-header"
import { ProjectCard } from "../components/project-card"
import { Search, Plus } from "lucide-react"
import { useToast } from "../hooks/use-toast"

export default function ProjectsPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects")
        setProjects(res.data.data)
      } catch (err) {
        toast({
          title: "Error",
          description: err.response?.data?.error || "Failed to fetch projects",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && project.status === activeTab
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

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
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filter</Button>
              <Button as={Link} to="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="In Progress">In Progress</TabsTrigger>
            <TabsTrigger value="Planning">Planning</TabsTrigger>
            <TabsTrigger value="Review">Review</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => <ProjectCard key={project._id} project={project} />)
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No projects found.</p>
                  <Button variant="outline" className="mt-4" as={Link} to="/projects/new">
                    Create a new project
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
