"use client"

import { useState } from "react"
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

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample project data
  const project = {
    id: params.id,
    name: "Website Redesign",
    status: "In Progress",
    dueDate: "2023-12-15",
    startDate: "2023-10-01",
    progress: 65,
    description:
      "Complete overhaul of company website with new branding, improved user experience, and modern design elements.",
    client: "Acme Corporation",
    team: ["John Doe", "Jane Smith", "Robert Johnson"],
    milestones: [
      { name: "Planning & Research", status: "Completed", date: "2023-10-15" },
      { name: "Wireframing", status: "Completed", date: "2023-10-30" },
      { name: "Design", status: "In Progress", date: "2023-11-20" },
      { name: "Development", status: "Not Started", date: "2023-12-05" },
      { name: "Testing & Launch", status: "Not Started", date: "2023-12-15" },
    ],
  }

  // Format dates
  const formattedDueDate = new Date(project.dueDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const formattedStartDate = new Date(project.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const statusColor = {
    Completed: "bg-green-500",
    "In Progress": "bg-blue-500",
    Planning: "bg-amber-500",
    Review: "bg-purple-500",
    "On Hold": "bg-gray-500",
    "Not Started": "bg-gray-400",
  }

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
                  <span
                    className={`mr-1.5 h-2 w-2 rounded-full ${statusColor[project.status as keyof typeof statusColor]}`}
                  />
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
                    {project.team.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-medium"
                      >
                        {member
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    ))}
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
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="relative pl-6 pb-4 last:pb-0">
                    <div
                      className={`absolute left-0 top-1.5 h-3 w-3 rounded-full ${statusColor[milestone.status as keyof typeof statusColor]}`}
                    />
                    {index < project.milestones.length - 1 && (
                      <div className="absolute left-1.5 top-4 bottom-0 w-px bg-border" />
                    )}
                    <div>
                      <p className="font-medium">{milestone.name}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{milestone.status}</span>
                        <span>
                          {new Date(milestone.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <FileUploader />
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Project Files</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Website_Wireframes.pdf</p>
                          <p className="text-xs text-muted-foreground">2.4 MB • Uploaded 2 weeks ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Brand_Guidelines.pdf</p>
                          <p className="text-xs text-muted-foreground">3.8 MB • Uploaded 1 month ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Homepage_Design.png</p>
                          <p className="text-xs text-muted-foreground">1.2 MB • Uploaded 1 week ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
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
