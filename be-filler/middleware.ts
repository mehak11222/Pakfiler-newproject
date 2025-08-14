import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    console.log(`Middleware triggered for: ${request.url}`)
    console.log(`Current pathname: ${request.nextUrl.pathname}`)

    // Get the token from cookies
    const token = request.cookies.get("token")?.value
    console.log(`Token exists: ${!!token}`)

    // Define protected routes
    const protectedPaths = ["/user", "/dashboard", "/profile"]

    // Check if the current path is a protected route
    const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )

    console.log(`Is protected path: ${isProtectedPath}`)

    // If the path is protected and no token is found
    if (isProtectedPath && !token) {
        console.log("No token found, redirecting to /auth/login")
        const loginUrl = new URL("/auth/login", request.url)
        console.log(`Redirect URL: ${loginUrl.toString()}`)
        return NextResponse.redirect(loginUrl)
    }

    // Optional: Basic token validation (if you want to check token format)
    if (isProtectedPath && token) {
        try {
            // You can add basic token validation here if needed
            // For example, check if it's a valid JWT format
            console.log("Token found, allowing access")
        } catch (error) {
            console.log("Invalid token, redirecting to login")
            return NextResponse.redirect(new URL("/auth/login", request.url))
        }
    }

    console.log("Allowing request to proceed")
    return NextResponse.next()
}

export const config = {
    matcher: [
        "/user/:path*",
        "/dashboard/:path*",
        "/profile/:path*"
    ],
}