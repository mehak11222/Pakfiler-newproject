
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getCurrentUser } from "@/lib/auth"
import Unauthorized from "@/components/Unauthorized"
import Cookies from "js-cookie"

interface IUser {
    _id: string
    fullName: string
    email: string
    cnic: string
}

export default function DocumentReports() {
    const router = useRouter()
    const { toast } = useToast()
    const [users, setUsers] = useState<IUser[]>([])
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const user = getCurrentUser()
    if (user?.role !== 'accountant') {
        return <Unauthorized />
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = Cookies.get('token')
                if (!token) {
                    throw new Error("No authentication token found")
                }

                const response = await fetch('https://backend-production-5fad.up.railway.app//api/admin/documents', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch documents')
                }

                const data = await response.json()
                const documents = data.data.documents

                // Extract unique users from documents
                const userMap = new Map<string, IUser>()
                documents.forEach((doc: any) => {
                    if (doc.user && !userMap.has(doc.user._id)) {
                        userMap.set(doc.user._id, {
                            _id: doc.user._id,
                            fullName: doc.user.fullName,
                            email: doc.user.email,
                            cnic: doc.user.cnic
                        })
                    }
                })

                const uniqueUsers = Array.from(userMap.values())
                setUsers(uniqueUsers)
                setFilteredUsers(uniqueUsers)
            } catch (e) {
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

    useEffect(() => {
        let result = users

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (user) =>
                    user.fullName.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query)
            )
        }

        setFilteredUsers(result)
        setCurrentPage(1)
    }, [searchQuery, users])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleViewReports = (userId: string) => {
        router.push(`/accountant/reports/${userId}`)
    }

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="container px-4 mx-auto py-8 mt-16">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Document Reports</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    View user document reports
                </p>
            </div>

            <Card className="w-full border shadow-sm">
                <CardHeader className="bg-gray-50">
                    <CardTitle className="text-xl">User Reports</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Label htmlFor="search" className="text-sm font-medium">
                                Search by Name or Email
                            </Label>
                            <div className="relative mt-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Enter name or email"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="pl-8"
                                    aria-label="Search users"
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 font-medium">Name</th>
                                            <th className="p-3 font-medium">Email</th>
                                            <th className="p-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="p-3 text-center text-muted-foreground">
                                                    No users found
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedUsers.map((user) => (
                                                <tr key={user._id} className="border-b">
                                                    <td className="p-3">{user.fullName || "N/A"}</td>
                                                    <td className="p-3">{user.email || "N/A"}</td>
                                                    <td className="p-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewReports(user._id)}
                                                            className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                                                            aria-label={`View reports for ${user.fullName || "N/A"}`}
                                                        >
                                                            View Reports
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                                        {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
                                        {filteredUsers.length} users
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
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}