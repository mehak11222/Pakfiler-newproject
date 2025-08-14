// "use client"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { environment } from "@/environment/environment"
// Server-side authentication functions


async function isAuthenticatedServer() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    if (!token) {
        return false
    }
    return true
}

async function getCurrentUserServer() {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")
    if (!userCookie) {
        return null
    }
    try {
        return JSON.parse(userCookie.value)
    } catch (e) {
        return null
    }
}

export default async function AccountantDashboard({ children }: { children: React.ReactNode }) {
    // Check authentication and role on the server
    const isAuth = await isAuthenticatedServer()
    if (!isAuth) {
        redirect("/auth/login")
    }

    const currentUser = await getCurrentUserServer()
    if (!currentUser) {
        redirect("/auth/login")
    }
    if (currentUser && currentUser.role == "user") {
        redirect("/dashboard")
    }
    if (currentUser && currentUser.role == "admin") {
        redirect("/dashboard/admin")
    }

    return (
        <div>

            {children}
        </div>
    )
}