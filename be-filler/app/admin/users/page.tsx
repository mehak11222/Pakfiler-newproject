"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import Unauthorized from "@/components/Unauthorized"

// Function to get token from cookies
const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null
    }
    return null
}

interface IUser {
    _id: string
    fullName: string
    email: string
    role: string
    status: string
    cnic: string
    phone: string
    createdAt?: string
    updatedAt?: string
    __v?: number
}

export default function UsersTable() {
    const router = useRouter()
    const { toast } = useToast()
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const itemsPerPage = 10
    const userRed = getCurrentUser()

    if (userRed?.role !== 'admin') {
        return <Unauthorized />
    }

    // Fetch all users from the API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = getCookie('token') // Get token from cookies
                if (!token) {
                    throw new Error('No authentication token found')
                }

                const response = await fetch('https://backend-production-5fad.up.railway.app/api/user/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch users')
                }

                const result = await response.json()
                console.log("Fetched users:", result) // Debug backend response
                setUsers(result.data)
                setTotalPages(result.totalPages)
            } catch (error) {
                console.error("Fetch users error:", error)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch users. Please try again.",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [toast])

    // Update user role
    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const token = getCookie('token') // Get token from cookies
            if (!token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`https://backend-production-5fad.up.railway.app/api/user/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            })

            if (!response.ok) {
                throw new Error('Failed to update role')
            }

            setUsers(users.map((user) =>
                user._id === userId ? { ...user, role: newRole } : user
            ))
            toast({
                title: "Success",
                description: "User role updated successfully.",
            })
        } catch (error) {
            console.error("Update role error:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update role. Please try again.",
            })
        }
    }

    // Update user status
    const handleStatusChange = async (userId: string, newStatus: string) => {
        try {
            const token = getCookie('token') // Get token from cookies
            if (!token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`https://backend-production-5fad.up.railway.app/api/user/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!response.ok) {
                throw new Error('Failed to update status')
            }

            setUsers(users.map((user) =>
                user._id === userId ? { ...user, status: newStatus } : user
            ))
            toast({
                title: "Success",
                description: "User status updated successfully.",
            })
        } catch (error) {
            console.error("Update status error:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update status. Please try again.",
            })
        }
    }

    // Navigate to user detail page
    const handleViewUser = (userId: string) => {
        router.push(`/admin/users/${userId}`)
    }

    // Capitalize text for display
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

    // Pagination calculations
    const paginatedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="container px-4 mx-auto py-8 mt-16">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    View and manage all users in the system
                </p>
            </div>

            <Card className="w-full border shadow-sm">
                <CardHeader className="bg-gray-50">
                    <CardTitle className="text-xl">Users List</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 font-medium">Full Name</th>
                                        <th className="p-3 font-medium">Email</th>
                                        <th className="p-3 font-medium">Role</th>
                                        <th className="p-3 font-medium">Status</th>
                                        <th className="p-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-3 text-center text-muted-foreground">
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedUsers.map((user) => {
                                            console.log(`User ${user._id} status: ${user.status}`) // Debug status
                                            const statusValue = user.status?.toLowerCase() === "active" ? "active" :
                                                user.status?.toLowerCase() === "inactive" ? "inactive" : "inactive"
                                            return (
                                                <tr key={user._id} className="border-b">
                                                    <td className="p-3">{user.fullName}</td>
                                                    <td className="p-3">{user.email}</td>
                                                    <td className="p-3">
                                                        <Select
                                                            value={user.role}
                                                            onValueChange={(value) => handleRoleChange(user._id, value)}
                                                        >
                                                            <SelectTrigger className="w-[120px] border-[#af0e0e] text-[#af0e0e]">
                                                                <SelectValue placeholder="Select role" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                                <SelectItem value="accountant">Accountant</SelectItem>
                                                                <SelectItem value="user">User</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="p-3">
                                                        <Select
                                                            value={statusValue}
                                                            onValueChange={(value) => handleStatusChange(user._id, value)}
                                                        >
                                                            <SelectTrigger className="w-[120px] border-[#af0e0e] text-[#af0e0e]">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="active">{capitalize("active")}</SelectItem>
                                                                <SelectItem value="inactive">{capitalize("inactive")}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="p-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewUser(user._id)}
                                                            className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                                                            aria-label={`View user ${user.fullName}`}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                                        {Math.min(currentPage * itemsPerPage, users.length)} of{" "}
                                        {users.length} users
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((prev) => prev - 1)}
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage((prev) => prev + 1)}
                                            aria-label="Next page"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}