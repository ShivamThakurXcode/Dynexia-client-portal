import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string
    const description = formData.get("description") as string
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check if project exists and user has access
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          team: true,
        },
      })

      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      const isTeamMember = project.team.some((member) => member.userId === session.user.id)
      if (project.userId !== session.user.id && !isTeamMember) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
