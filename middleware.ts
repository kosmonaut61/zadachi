import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the Firebase auth token from the Authorization header
  const authHeader = request.headers.get("Authorization")
  const isAuthenticated = authHeader?.startsWith("Bearer ")

  // If the user is not logged in and trying to access a protected route
  if (!isAuthenticated && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is logged in and trying to access the login page
  if (isAuthenticated && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/welcome", request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 