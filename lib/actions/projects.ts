"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/db"
import { authOptions } from "@/lib/auth"

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string(),
  dueDate: z.string().datetime(),
  startDate: z.string().datetime(),
})

export async function getProjects() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          {
            team: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      include: {
        milestones: true,
        team: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return { projects }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return { error: "Failed to fetch projects" }
  }
}

export async function getProjectById(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        milestones: true,
        team: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        documents: true,
      },
    })

    if (!project) {
      return { error: "Project not found" }
    }

    // Check if user has access to this project
    const isTeamMember = project.team.some((member) => member.userId === session.user.id)
    if (project.userId !== session.user.id && !isTeamMember) {
      return { error: "Unauthorized" }
    }

    return { project }
  } catch (error) {
    console.error("Error fetching project:", error)
    return { error: "Failed to fetch project" }
  }
}

export async function createProject(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate"),
    startDate: formData.get("startDate"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields. Please check your input.",
    }
  }

  const { name, description, status, dueDate, startDate } = validatedFields.data

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        status,
        dueDate: new Date(dueDate),
        startDate: new Date(startDate),
        progress: 0,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    revalidatePath("/projects")
    return { project }
  } catch (error) {
    console.error("Error creating project:", error)
    return { error: "Failed to create project" }
  }
}

export async function updateProject(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    // Check if user has access to this project
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        team: true,
      },
    })

    if (!existingProject) {
      return { error: "Project not found" }
    }

    const isTeamMember = existingProject.team.some((member) => member.userId === session.user.id)
    if (existingProject.userId !== session.user.id && !isTeamMember) {
      return { error: "Unauthorized" }
    }

    const validatedFields = projectSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      status: formData.get("status"),
      dueDate: formData.get("dueDate"),
      startDate: formData.get("startDate"),
    })

    if (!validatedFields.success) {
      return {
        error: "Invalid fields. Please check your input.",
      }
    }

    const { name, description, status, dueDate, startDate } = validatedFields.data
    const progress = Number.parseInt(formData.get("progress") as string) || existingProject.progress

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        status,
        dueDate: new Date(dueDate),
        startDate: new Date(startDate),
        progress,
      },
    })

    revalidatePath(`/projects/${id}`)
    revalidatePath("/projects")
    return { project }
  } catch (error) {
    console.error("Error updating project:", error)
    return { error: "Failed to update project" }
  }
}

export async function deleteProject(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    // Check if user has access to this project
    const existingProject = await prisma.project.findUnique({
      where: { id },
    })

    if (!existingProject) {
      return { error: "Project not found" }
    }

    if (existingProject.userId !== session.user.id && session.user.role !== "admin") {
      return { error: "Unauthorized" }
    }

    // Delete project
    await prisma.project.delete({
      where: { id },
    })

    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { error: "Failed to delete project" }
  }
}
