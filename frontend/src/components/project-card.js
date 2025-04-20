import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { ArrowRight } from "lucide-react"
import { formatDate, getStatusColor } from "../utils/helpers"

export function ProjectCard({ project }) {
  const statusColor = getStatusColor(project.status)

  // Format date
  const formattedDate = formatDate(project.dueDate)

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
          <Link to={`/projects/${project._id}`}>
            View Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
