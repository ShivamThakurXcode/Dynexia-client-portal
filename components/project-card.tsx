import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import { formatDate, getStatusColor } from "@/lib/utils"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    status: string
    dueDate: Date
    progress: number
    description: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColor = getStatusColor(project.status)

  // Format date
  const formattedDate = formatDate(project.dueDate.toString())

  return (
    <Card className="gradient-border overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
          <Badge variant="outline" className="ml-2">
            <span className={`mr-1.5 h-2 w-2 rounded-full ${statusColor}`} />
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
        <div className="mt-4 text-sm">
          <span className="text-muted-foreground">Due: </span>
          <span>{formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/projects/${project.id}`}>
            View Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
