import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { Webhook } from "svix"
import type { WebhookEvent } from "@clerk/nextjs/server"

import prisma from "@/lib/db"

export async function POST(req: Request) {
  // This is an example webhook handler for Clerk authentication
  // You would need to set up Clerk or another auth provider to use this

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return new NextResponse("Webhook secret not set", { status: 500 })
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error: Missing svix headers", { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new NextResponse("Error verifying webhook", { status: 400 })
  }

  // Handle the event
  const eventType = evt.type

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    const email = email_addresses && email_addresses[0]?.email_address
    const name = [first_name, last_name].filter(Boolean).join(" ")

    // Create or update the user in your database
    await prisma.user.upsert({
      where: { email: email },
      update: {
        name: name || undefined,
        image: image_url || undefined,
      },
      create: {
        email: email,
        name: name || undefined,
        image: image_url || undefined,
        role: "client", // Default role
      },
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: true })
}
