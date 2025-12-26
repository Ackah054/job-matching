// RBAC middleware for protecting routes
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public routes that don't need authentication
  const publicRoutes = ["/", "/login", "/register", "/about"]

  // Role-specific routes
  const roleRoutes: Record<string, string[]> = {
    job_seeker: ["/dashboard", "/jobs", "/applications", "/profile"],
    employer: ["/dashboard", "/jobs", "/jobs/create", "/candidates", "/messages"],
    admin: ["/admin"],
  }

  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify token
  const decoded = await verifyToken(token)

  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Check role-based access
  const userRole = decoded.role
  const allowedRoutes = roleRoutes[userRole] || []

  // Check if user has access to this route
  const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route))

  if (!hasAccess && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Add user info to request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", decoded.userId)
  requestHeaders.set("x-user-role", decoded.role)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
