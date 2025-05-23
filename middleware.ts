import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log("[Middleware] Request received:", {
    path: request.nextUrl.pathname,
    headers: Object.fromEntries(request.headers.entries()),
    cookies: request.cookies.getAll().reduce((acc, cookie) => ({
      ...acc,
      [cookie.name]: cookie.value
    }), {})
  })

  // Get the Firebase auth token from the Authorization header
  const authHeader = request.headers.get("Authorization")
  const isAuthenticated = authHeader?.startsWith("Bearer ")

  console.log("[Middleware] Auth check:", {
    hasAuthHeader: !!authHeader,
    isAuthenticated,
    path: request.nextUrl.pathname
  })

  // If the user is not logged in and trying to access a protected route
  if (!isAuthenticated && !request.nextUrl.pathname.startsWith("/login")) {
    console.log("[Middleware] Redirecting to login - not authenticated")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is logged in and trying to access the login page
  if (isAuthenticated && request.nextUrl.pathname.startsWith("/login")) {
    console.log("[Middleware] Redirecting to welcome - already authenticated")
    return NextResponse.redirect(new URL("/welcome", request.url))
  }

  console.log("[Middleware] Allowing request to proceed")
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 