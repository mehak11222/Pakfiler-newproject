// "use client"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { environment } from "@/environment/environment"
import { Dice1 } from "lucide-react"
// Server-side authentication functions

interface User {
    token: string
    user: {
        id: string
        email: string
        fullName: string
        role?: string
    }
}

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
    const user = cookieStore.get("user")
    if (!user) {
        return null
    }
    return user
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Check authentication and role on the server
    const isAuth = await isAuthenticatedServer()
    if (!isAuth) {
        redirect("/auth/login")
    }

    const currentUserCookie = await getCurrentUserServer()
    if (!currentUserCookie) {
        redirect("/auth/login")
    }
    let currentUser = null
    try {
        currentUser = JSON.parse(currentUserCookie.value)
    } catch (e) {
        redirect("/auth/login")
    }
    if (currentUser && currentUser.role === "user") {
        redirect("/dashboard")
    }
    if (currentUser && currentUser.role === "accountant") {
        redirect("/dashboard/accountant")
    }

    return (
        <div>

            {children}
        </div>
    )
}