"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { signIn } from "next-auth/react"

import prisma from "@/lib/db"

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function registerUser(formData: FormData) {
  const validatedFields = userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields. Please check your input.",
    }
  }

  const { name, email, password } = validatedFields.data

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    return {
      error: "User with this email already exists",
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "client", // Default role for new users
    },
  })

  // Sign in the user
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  })

  redirect("/onboarding")
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      error: "Email and password are required",
    }
  }

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  })

  if (result?.error) {
    return {
      error: "Invalid email or password",
    }
  }

  redirect("/dashboard")
}
