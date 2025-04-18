"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/db"
import { authOptions } from "@/lib/auth"

const onboardingSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  industry: z.string(),
  projectType: z.string(),
  projectGoals: z.string(),
  inspirationWebsites: z.string().optional(),
  brandColors: z.string().optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  additionalInfo: z.string().optional(),
})

export async function submitOnboarding(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = onboardingSchema.safeParse({
    companyName: formData.get("companyName"),
    website: formData.get("website"),
    industry: formData.get("industry"),
    projectType: formData.get("projectType"),
    projectGoals: formData.get("projectGoals"),
    inspirationWebsites: formData.get("inspirationWebsites"),
    brandColors: formData.get("brandColors"),
    timeline: formData.get("timeline"),
    budget: formData.get("budget"),
    additionalInfo: formData.get("additionalInfo"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields. Please check your input.",
    }
  }

  const data = validatedFields.data

  try {
    // Check if user already has onboarding data
    const existingOnboarding = await prisma.onboarding.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (existingOnboarding) {
      // Update existing onboarding data
      const onboarding = await prisma.onboarding.update({
        where: {
          userId: session.user.id,
        },
        data: {
          ...data,
          completed: true,
        },
      })

      revalidatePath("/onboarding")
      return { onboarding }
    } else {
      // Create new onboarding data
      const onboarding = await prisma.onboarding.create({
        data: {
          ...data,
          completed: true,
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      })

      revalidatePath("/onboarding")
      return { onboarding }
    }
  } catch (error) {
    console.error("Error submitting onboarding:", error)
    return { error: "Failed to submit onboarding information" }
  }
}

export async function getOnboardingData() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const onboarding = await prisma.onboarding.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    return { onboarding }
  } catch (error) {
    console.error("Error fetching onboarding data:", error)
    return { error: "Failed to fetch onboarding data" }
  }
}
