"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard-header"
import { FileUploader } from "@/components/file-uploader"
import { MessageList } from "@/components/message-list"
import { ArrowLeft, Calendar, Clock, FileText, Users } from "lucide-react"
import { getProjectById } from "@/lib/actions/projects"
import { uploadDocument } from "@/lib/actions/documents"
import { useToast } from "@/components/ui/use-toast"
import { formatDate, getStatusColor } from "@/lib/utils"

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await getProjectById(params.id)
        if (result?.error) {
          setError(result.error)
        } else if (result?.project) {
          setProject(result.project)
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        setError("Failed to load project details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("projectId", params.id)
        formData.append("description", "Uploaded from project details page")
        formData.append("documentType", "project-file")

        const result = await uploadDocument(formData)

        if (result?.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: `${file.name} uploaded successfully`,
          })

          // Refresh project data to show new document
          const updatedProject = await getProjectById(params.id)
          if (updatedProject?.project) {
            setProject(updatedProject.project)
          }
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error || "Failed to load project"}</p>
        <Button asChild>
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  // Format dates
  const formattedDueDate = formatDate(project.dueDate)
  const formattedStartDate = formatDate(project.startDate)

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader heading={project.name} text={project.description}>
        <Button variant="outline" size="sm" asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </DashboardHeader>

      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Project Details</CardTitle>
                <Badge variant="outline">
                  <span className={`mr-1.5 h-2 w-2 rounded-full ${getStatusColor(project.status)}`} />
                  {project.status}
                </Badge>
              </div>
              <CardDescription>Overview of the project details and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{formattedStartDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{formattedDueDate}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Team Members</h3>
                  <div className="flex items-center space-x-2">
                    {project.team && project.team.length > 0 ? (
                      project.team.map((member: any) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-medium"
                          title={member.user.name}
                        >
                          {member.user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No team members assigned yet</p>
                    )}
                    <div className="flex items-center justify-center h-8 w-8 rounded-full border border-dashed border-muted-foreground text-muted-foreground">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Key milestones and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.milestones && project.milestones.length > 0 ? (
                  project.milestones.map((milestone: any, index: number) => (
                    <div key={milestone.id} className="relative pl-6 pb-4 last:pb-0">
                      <div
                        className={`absolute left-0 top-1.5 h-3 w-3 rounded-full ${getStatusColor(milestone.status)}`}
                      />
                      {index < project.milestones.length - 1 && (
                        <div className="absolute left-1.5 top-4 bottom-0 w-px bg-border" />
                      )}
                      <div>
                        <p className="font-medium">{milestone.name}</p>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{milestone.status}</span>
                          <span>{formatDate(milestone.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No milestones defined yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="notes">Notes & Feedback</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>Detailed information about the project goals and scope</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Project Description</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Project Goals</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Improve user experience and navigation</li>
                    <li>Implement new brand identity across the website</li>
                    <li>Optimize for mobile devices and improve performance</li>
                    <li>Increase conversion rates and user engagement</li>
                    <li>Implement modern design principles and accessibility standards</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Project Scope</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Complete redesign of all website pages</li>
                    <li>New information architecture and navigation</li>
                    <li>Responsive design for all device sizes</li>
                    <li>Integration with existing CMS</li>
                    <li>SEO optimization</li>
                    <li>Performance optimization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliverables" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Deliverables</CardTitle>
                <CardDescription>Upload and download project files and deliverables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Upload Files</h3>
                  <FileUploader onFilesSelected={handleFileUpload} />
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Project Files</h3>
                  {project.documents && project.documents.length > 0 ? (
                    <div className="space-y-3">
                      {project.documents.map((document: any) => (
                        <div key={document.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-primary" />
                            <div>
                              <p className="font-medium">{document.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(document.size)} • Uploaded {formatDate(document.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(document.url, "_blank")}>
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No files uploaded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notes & Feedback</CardTitle>
                <CardDescription>Share notes and feedback about the project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Add Note</h3>
                  <div className="space-y-4">
                    <Textarea placeholder="Type your note or feedback here..." className="min-h-[120px]" />
                    <Button>Submit Note</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Previous Notes</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Design Feedback</p>
                        <Badge variant="outline">Client</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        I really like the new homepage design, but could we make the call-to-action buttons more
                        prominent? Also, the color scheme looks great!
                      </p>
                      <p className="text-xs text-muted-foreground">Added by John Doe • 3 days ago</p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Wireframe Review</p>
                        <Badge variant="outline">Team</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        The navigation structure looks good. We should consider adding a search feature to improve user
                        experience. Let's discuss this in our next meeting.
                      </p>
                      <p className="text-xs text-muted-foreground">Added by Jane Smith • 1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Messages</CardTitle>
                <CardDescription>Communicate with your team about this project</CardDescription>
              </CardHeader>
              <CardContent>
                <MessageList projectId={params.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
