import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  // Get the pathname of the request
  const path = req.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/reset-password"]
  const isPublicPath = publicPaths.includes(path)

  // If the path is public and the user is authenticated, redirect to dashboard
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If the path is not public and the user is not authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated && !path.startsWith("/api")) {
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${encodeURIComponent(path)}`, req.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
