import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { FileText, FolderOpen, Search, Upload } from "lucide-react"

export default function DocumentsPage() {
  // Sample data
  const documents = [
    {
      id: "1",
      name: "Website_Wireframes.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedBy: "John Doe",
      uploadedAt: "2023-11-01T10:30:00",
      project: "Website Redesign",
    },
    {
      id: "2",
      name: "Brand_Guidelines.pdf",
      type: "pdf",
      size: "3.8 MB",
      uploadedBy: "Jane Smith",
      uploadedAt: "2023-10-15T14:45:00",
      project: "Brand Identity",
    },
    {
      id: "3",
      name: "Homepage_Design.png",
      type: "png",
      size: "1.2 MB",
      uploadedBy: "Robert Johnson",
      uploadedAt: "2023-11-10T09:15:00",
      project: "Website Redesign",
    },
    {
      id: "4",
      name: "App_Wireframes.zip",
      type: "zip",
      size: "5.7 MB",
      uploadedBy: "John Doe",
      uploadedAt: "2023-11-05T16:20:00",
      project: "Mobile App Development",
    },
    {
      id: "5",
      name: "Marketing_Plan_Q4.docx",
      type: "docx",
      size: "1.8 MB",
      uploadedBy: "Jane Smith",
      uploadedAt: "2023-10-28T11:30:00",
      project: "Marketing Campaign",
    },
    {
      id: "6",
      name: "Project_Timeline.xlsx",
      type: "xlsx",
      size: "0.9 MB",
      uploadedBy: "Robert Johnson",
      uploadedAt: "2023-11-12T13:45:00",
      project: "Website Redesign",
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return (
          <div className="rounded-md bg-red-100 p-2 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <FileText className="h-6 w-6" />
          </div>
        )
      case "docx":
        return (
          <div className="rounded-md bg-blue-100 p-2 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            <FileText className="h-6 w-6" />
          </div>
        )
      case "xlsx":
        return (
          <div className="rounded-md bg-green-100 p-2 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <FileText className="h-6 w-6" />
          </div>
        )
      case "png":
      case "jpg":
      case "jpeg":
        return (
          <div className="rounded-md bg-purple-100 p-2 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
            <FileText className="h-6 w-6" />
          </div>
        )
      case "zip":
      case "rar":
        return (
          <div className="rounded-md bg-amber-100 p-2 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            <FileText className="h-6 w-6" />
          </div>
        )
      default:
        return (
          <div className="rounded-md bg-gray-100 p-2 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <FileText className="h-6 w-6" />
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader heading="Documents" text="Upload, download, and manage your project files." />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>Access and organize your project files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search documents..." className="pl-8" />
              </div>
              <Button variant="outline">
                <FolderOpen className="mr-2 h-4 w-4" />
                Browse
              </Button>
              <Button asChild>
                <Link href="/documents/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Files</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="shared">Shared with Me</TabsTrigger>
            <TabsTrigger value="projects">By Project</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(document.type)}
                    <div>
                      <p className="font-medium">{document.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{document.size}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(document.uploadedAt)}</span>
                        <span className="mx-2">•</span>
                        <span>{document.project}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            <div className="grid gap-4">
              {documents
                .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
                .slice(0, 3)
                .map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(document.type)}
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{document.size}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(document.uploadedAt)}</span>
                          <span className="mx-2">•</span>
                          <span>{document.project}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="shared" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No shared documents yet.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/documents/upload">Upload a document</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Website Redesign</h3>
                <div className="grid gap-4">
                  {documents
                    .filter((doc) => doc.project === "Website Redesign")
                    .map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center space-x-4">
                          {getFileIcon(document.type)}
                          <div>
                            <p className="font-medium">{document.name}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>{document.size}</span>
                              <span className="mx-2">•</span>
                              <span>{formatDate(document.uploadedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Mobile App Development</h3>
                <div className="grid gap-4">
                  {documents
                    .filter((doc) => doc.project === "Mobile App Development")
                    .map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center space-x-4">
                          {getFileIcon(document.type)}
                          <div>
                            <p className="font-medium">{document.name}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>{document.size}</span>
                              <span className="mx-2">•</span>
                              <span>{formatDate(document.uploadedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
