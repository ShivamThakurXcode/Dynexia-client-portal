"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/db"
import { authOptions } from "@/lib/auth"

const invoiceSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  status: z.string(),
  dueDate: z.string().datetime(),
  projectId: z.string().optional(),
})

export async function getInvoices() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const whereClause = session.user.role === "admin" ? {} : { userId: session.user.id }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { invoices }
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return { error: "Failed to fetch invoices" }
  }
}

export async function createInvoice(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  // Only admins can create invoices
  if (session.user.role !== "admin") {
    return { error: "Unauthorized" }
  }

  const amount = Number.parseFloat(formData.get("amount") as string)
  const status = formData.get("status") as string
  const dueDate = formData.get("dueDate") as string
  const projectId = formData.get("projectId") as string
  const userId = formData.get("userId") as string

  const validatedFields = invoiceSchema.safeParse({
    amount,
    status,
    dueDate,
    projectId,
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields. Please check your input.",
    }
  }

  try {
    const invoice = await prisma.invoice.create({
      data: {
        amount,
        status,
        dueDate: new Date(dueDate),
        user: {
          connect: {
            id: userId,
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

    revalidatePath("/invoices")
    return { invoice }
  } catch (error) {
    console.error("Error creating invoice:", error)
    return { error: "Failed to create invoice" }
  }
}

export async function updateInvoiceStatus(id: string, status: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    // Check if user has access to this invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    })

    if (!invoice) {
      return { error: "Invoice not found" }
    }

    // Only admin or invoice owner can update status
    if (invoice.userId !== session.user.id && session.user.role !== "admin") {
      return { error: "Unauthorized" }
    }

    // Update invoice status
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: { status },
    })

    revalidatePath("/invoices")
    return { invoice: updatedInvoice }
  } catch (error) {
    console.error("Error updating invoice status:", error)
    return { error: "Failed to update invoice status" }
  }
}
