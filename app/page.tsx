import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 grid-pattern">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to <span className="gradient-text">Dynexia</span> Client Portal
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Your professional workspace for project management, communication, and collaboration.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/auth/login">
                    Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/register">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-stretch">
              <div className="glass-card rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Project Management</h3>
                  <p className="text-muted-foreground">
                    Track your projects, view progress, and manage deliverables in one place.
                  </p>
                </div>
              </div>
              <div className="glass-card rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Communication</h3>
                  <p className="text-muted-foreground">
                    Message your team, provide feedback, and stay updated on project developments.
                  </p>
                </div>
              </div>
              <div className="glass-card rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">File Sharing</h3>
                  <p className="text-muted-foreground">
                    Securely upload, download, and share project files and documents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
