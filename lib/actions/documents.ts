"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { put } from "@vercel/blob"

import prisma from "@/lib/db"
import { authOptions } from "@/lib/auth"

const documentSchema = z.object({
  name: z.string().min(1, "File name is required"),
  projectId: z.string().optional(),
  description: z.string().optional(),
  documentType: z.string().optional(),
})

export async function getDocuments(projectId?: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const whereClause = projectId
      ? { projectId }
      : {
          OR: [
            { userId: session.user.id },
            {
              project: {
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
            },
          ],
        }

    const documents = await prisma.document.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return { documents }
  } catch (error) {
    console.error("Error fetching documents:", error)
    return { error: "Failed to fetch documents" }
  }
}

export async function uploadDocument(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const file = formData.get("file") as File
  const projectId = formData.get("projectId") as string
  const description = formData.get("description") as string
  const documentType = formData.get("documentType") as string

  if (!file) {
    return { error: "No file provided" }
  }

  try {
    // Check if project exists and user has access
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          team: true,
        },
      })

      if (!project) {
        return { error: "Project not found" }
      }

      const isTeamMember = project.team.some((member) => member.userId === session.user.id)
      if (project.userId !== session.user.id && !isTeamMember) {
        return { error: "Unauthorized" }
      }
    }

    // Upload file to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        name: file.name,
        url: blob.url,
        size: file.size,
        type: file.type,
        description,
        documentType,
        user: {
          connect: {
            id: session.user.id,
          },
        },
        ...(projectId && {
          project: {
            connect: {
              id: projectId,
            },
          },
        }),
      },
    })

    if (projectId) {
      revalidatePath(`/projects/${projectId}`)
    }
    revalidatePath("/documents")

    return { document }
  } catch (error) {
    console.error("Error uploading document:", error)
    return { error: "Failed to upload document" }
  }
}

export async function deleteDocument(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    // Check if user has access to this document
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            team: true,
          },
        },
      },
    })

    if (!document) {
      return { error: "Document not found" }
    }

    // Check if user is document owner, project owner, or team member
    const isProjectTeamMember = document.project?.team.some((member) => member.userId === session.user.id)
    if (
      document.userId !== session.user.id &&
      document.project?.userId !== session.user.id &&
      !isProjectTeamMember &&
      session.user.role !== "admin"
    ) {
      return { error: "Unauthorized" }
    }

    // Delete document from database
    await prisma.document.delete({
      where: { id },
    })

    // Note: We're not deleting from Vercel Blob here as it would require additional setup
    // In a production app, you would want to delete the file from storage as well

    if (document.projectId) {
      revalidatePath(`/projects/${document.projectId}`)
    }
    revalidatePath("/documents")

    return { success: true }
  } catch (error) {
    console.error("Error deleting document:", error)
    return { error: "Failed to delete document" }
  }
}
