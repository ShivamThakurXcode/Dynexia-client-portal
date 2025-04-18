"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/db"
import { authOptions } from "@/lib/auth"

const messageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  projectId: z.string().optional(),
})

export async function getMessages(projectId?: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const whereClause = projectId
      ? { projectId }
      : {
          OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
        }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return { messages }
  } catch (error) {
    console.error("Error fetching messages:", error)
    return { error: "Failed to fetch messages" }
  }
}

export async function getConversations() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    // Get all users the current user has messaged with
    const conversations = await prisma.user.findMany({
      where: {
        OR: [
          {
            receivedMessages: {
              some: {
                senderId: session.user.id,
              },
            },
          },
          {
            sentMessages: {
              some: {
                receiverId: session.user.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    })

    // For each user, get the latest message
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (user) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              {
                senderId: session.user.id,
                receiverId: user.id,
              },
              {
                senderId: user.id,
                receiverId: session.user.id,
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        // Count unread messages
        const unreadCount = await prisma.message.count({
          where: {
            senderId: user.id,
            receiverId: session.user.id,
            read: false,
          },
        })

        return {
          ...user,
          lastMessage,
          unread: unreadCount,
          online: Math.random() > 0.5, // Mock online status
        }
      }),
    )

    return { conversations: conversationsWithLastMessage }
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return { error: "Failed to fetch conversations" }
  }
}

export async function sendMessage(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = messageSchema.safeParse({
    content: formData.get("content"),
    projectId: formData.get("projectId"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields. Please check your input.",
    }
  }

  const { content, projectId } = validatedFields.data
  const receiverId = formData.get("receiverId") as string

  if (!receiverId && !projectId) {
    return { error: "Either receiverId or projectId is required" }
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        sender: {
          connect: {
            id: session.user.id,
          },
        },
        ...(receiverId && {
          receiver: {
            connect: {
              id: receiverId,
            },
          },
        }),
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
    } else {
      revalidatePath("/messages")
    }

    return { message }
  } catch (error) {
    console.error("Error sending message:", error)
    return { error: "Failed to send message" }
  }
}

export async function markMessagesAsRead(senderId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    })

    revalidatePath("/messages")
    return { success: true }
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return { error: "Failed to mark messages as read" }
  }
}
