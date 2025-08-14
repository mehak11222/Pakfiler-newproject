"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { Loader2, FileText, CheckCircle, Clock, XCircle, FileCheck, FileSearch, FileX, Download } from "lucide-react"
import { Bar } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"
import { getCurrentUser } from "@/lib/auth"
import Unauthorized from "@/components/Unauthorized"
import Cookies from "js-cookie"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface IUser {
    _id: string
    fullName: string
    email: string
    cnic: string
    role: "user" | "accountant" | "admin"
    status: "pending" | "approved" | "rejected" | "active" | "inactive"
}

interface DocumentStats {
    total: number
    approved: number
    pending: number
    rejected: number
}

interface TaxFilingStats {
    total: number
    pending: number
    underReview: number
    completed: number
    rejected: number
}

interface TimelineData {
    date: string
    ntn: number
    business: number
    gst: number
    total: number
}

export default function UserDetail() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [user, setUser] = useState<IUser | null>(null)
    const [documentStats, setDocumentStats] = useState<DocumentStats | null>(null)
    const [taxFilingStats, setTaxFilingStats] = useState<TaxFilingStats | null>(null)
    const [timelineData, setTimelineData] = useState<TimelineData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const pageRef = useRef<HTMLDivElement>(null)

    const userId = params?.id as string
    const currentUser = getCurrentUser()
    if (currentUser?.role !== "admin") {
        return <Unauthorized />
    }

    useEffect(() => {
        let isMounted = true
        const fetchUserData = async () => {
            try {
                const token = Cookies.get('token')
                if (!token) {
                    throw new Error("No authentication token found")
                }

                console.log("Fetching user data for userId:", userId)

                // Fetch documents for the user
                const documentsResponse = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/documents?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!documentsResponse.ok) {
                    console.log("Documents API status:", documentsResponse.status)
                    throw new Error('Failed to fetch user documents')
                }

                const documentsData = await documentsResponse.json()
                console.log("Documents API response:", documentsData)

                // Extract user data from documents
                const userData = documentsData.data.documents.find((doc: any) => doc.user?._id === userId)?.user
                if (!userData) {
                    setError("No user data found for the provided ID")
                    setLoading(false)
                    return
                }

                if (isMounted) {
                    setUser({
                        _id: userData._id,
                        fullName: userData.fullName,
                        email: userData.email,
                        cnic: userData.cnic,
                        role: userData.role || "user", // Fallback as role is not in API response
                        status: userData.status || "pending", // Fallback as status is not in API response
                    })

                    // Calculate document stats
                    const docStats: DocumentStats = {
                        total: documentsData.data.documents.length || 0,
                        approved: documentsData.data.documents.filter((doc: any) => doc.status === "approved").length || 0,
                        pending: documentsData.data.documents.filter((doc: any) => doc.status === "pending").length || 0,
                        rejected: documentsData.data.documents.filter((doc: any) => doc.status === "rejected").length || 0,
                    }
                    setDocumentStats(docStats)

                    // Fetch tax filing stats
                    const taxFilingsResponse = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/documents/tax-filings?userId=${userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })

                    if (!taxFilingsResponse.ok) {
                        throw new Error('Failed to fetch tax filings')
                    }

                    const taxFilingsData = await taxFilingsResponse.json()
                    const taxStats: TaxFilingStats = {
                        total: taxFilingsData.data.taxFilings.length || 0,
                        pending: taxFilingsData.data.taxFilings.filter((filing: any) => filing.status === "pending").length || 0,
                        underReview: taxFilingsData.data.taxFilings.filter((filing: any) => filing.status === "under_review").length || 0,
                        completed: taxFilingsData.data.taxFilings.filter((filing: any) => filing.status === "completed").length || 0,
                        rejected: taxFilingsData.data.taxFilings.filter((filing: any) => filing.status === "rejected").length || 0,
                    }
                    setTaxFilingStats(taxStats)

                    // Fetch timeline data
                    const timelineResponse = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/documents/timeline?days=30&userId=${userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })

                    if (!timelineResponse.ok) {
                        throw new Error('Failed to fetch timeline data')
                    }

                    const timelineData = await timelineResponse.json()
                    setTimelineData(timelineData.data.timeline)
                }
            } catch (error: any) {
                if (isMounted) {
                    console.error("Fetch error:", error)
                    setError(error.message || "Failed to load user data")
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to load user data. Please try again.",
                    })
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        if (userId) {
            fetchUserData()
        }

        return () => {
            isMounted = false
        }
    }, [userId, toast])

    const handleRoleChange = async (newRole: string) => {
        if (!user) return
        try {
            const token = Cookies.get('token')
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/users/${user._id}/role`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            })

            if (!response.ok) {
                throw new Error('Failed to update user role')
            }

            setUser({ ...user, role: newRole as "user" | "accountant" | "admin" })
            toast({
                title: "Success",
                description: "User role updated successfully.",
            })
        } catch (error: any) {
            console.error("Update role error:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update role. Please try again.",
            })
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        if (!user) return
        try {
            const token = Cookies.get('token')
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/users/${user._id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (!response.ok) {
                throw new Error('Failed to update user status')
            }

            setUser({ ...user, status: newStatus as "pending" | "rejected" | "approved" | "active" | "inactive" })
            toast({
                title: "Success",
                description: "User status updated successfully.",
            })
        } catch (error: any) {
            console.error("Update status error:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update status. Please try again.",
            })
        }
    }

    const handleDownloadPDF = async () => {
        if (!pageRef.current) return

        try {
            const canvas = await html2canvas(pageRef.current, { scale: 2 })
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const imgWidth = 210
            const pageHeight = 297
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            let heightLeft = imgHeight
            let position = 0

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }

            pdf.save(`user-details-${userId}.pdf`)
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate PDF. Please try again.",
            })
        }
    }

    const documentChartData = {
        labels: ["Approved", "Pending", "Rejected"],
        datasets: [
            {
                label: "Documents",
                data: documentStats
                    ? [documentStats.approved, documentStats.pending, documentStats.rejected]
                    : [0, 0, 0],
                backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
                borderColor: ["#ffffff", "#ffffff", "#ffffff"],
                borderWidth: 2,
            },
        ],
    }

    const taxFilingChartData = {
        labels: ["Pending", "Under Review", "Completed", "Rejected"],
        datasets: [
            {
                label: "Tax Filings",
                data: taxFilingStats
                    ? [
                        taxFilingStats.pending,
                        taxFilingStats.underReview,
                        taxFilingStats.completed,
                        taxFilingStats.rejected,
                    ]
                    : [0, 0, 0, 0],
                backgroundColor: ["#F59E0B", "#3B82F6", "#10B981", "#EF4444"],
                borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
                borderWidth: 2,
            },
        ],
    }

    const timelineChartData = {
        labels: timelineData.map((entry) => entry.date),
        datasets: [
            {
                label: "NTN Documents",
                data: timelineData.map((entry) => entry.ntn),
                backgroundColor: "#10B981",
                borderColor: "#ffffff",
                borderWidth: 2,
            },
            {
                label: "Business Documents",
                data: timelineData.map((entry) => entry.business),
                backgroundColor: "#F59E0B",
                borderColor: "#ffffff",
                borderWidth: 2,
            },
            {
                label: "GST Documents",
                data: timelineData.map((entry) => entry.gst),
                backgroundColor: "#3B82F6",
                borderColor: "#ffffff",
                borderWidth: 2,
            },
            {
                label: "Total Documents",
                data: timelineData.map((entry) => entry.total),
                backgroundColor: "#EF4444",
                borderColor: "#ffffff",
                borderWidth: 2,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            title: {
                display: true,
                font: {
                    size: 16,
                },
            },
        },
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto shadow-lg border border-gray-200">
                    <CardHeader className="bg-gray-100">
                        <CardTitle className="text-2xl text-primary">User Not Found</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-gray-600">{error || "No user found with the specified ID."}</p>
                        <Button
                            variant="outline"
                            className="mt-4 text-primary border-primary hover:bg-primary hover:text-white transition-colors"
                            onClick={() => router.push("/admin/users")}
                        >
                            Back to Users
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

    return (
        <div ref={pageRef} className="container mx-auto px-4 py-8 mt-10">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">{user.fullName}</h1>
                    <p className="text-gray-500 text-sm mt-2">User details, document, and tax filing statistics</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPDF}
                    className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                    aria-label="Download PDF"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1 shadow-lg border border-gray-200">
                    <CardHeader className="bg-gray-100">
                        <CardTitle className="text-2xl text-primary">User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Full Name</p>
                                <p className="text-lg font-semibold">{user.fullName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-lg">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">CNIC</p>
                                <p className="text-lg">{user.cnic}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">ID</p>
                                <p className="text-lg font-mono">{user._id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Role</p>
                                <Select value={user.role} onValueChange={handleRoleChange}>
                                    <SelectTrigger className="w-full border-primary text-primary focus:ring-primary">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="accountant">Accountant</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <Select value={user.status || "inactive"} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-full border-primary text-primary focus:ring-primary">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            onClick={() => router.push("/admin/users")}
                        >
                            Back to Users
                        </Button>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-lg border border-gray-200">
                        <CardHeader className="bg-gray-100">
                            <CardTitle className="text-2xl text-primary">Document Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {documentStats ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <FileText className="h-6 w-6 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Total Documents</p>
                                                <p className="text-lg font-bold">{documentStats.total}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <CheckCircle className="h-6 w-6 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Approved</p>
                                                <p className="text-lg font-bold">{documentStats.approved}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <Clock className="h-6 w-6 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                                <p className="text-lg font-bold">{documentStats.pending}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <XCircle className="h-6 w-6 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Rejected</p>
                                                <p className="text-lg font-bold">{documentStats.rejected}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-64">
                                        <Bar
                                            data={documentChartData}
                                            options={{
                                                ...chartOptions,
                                                plugins: {
                                                    ...chartOptions.plugins,
                                                    title: {
                                                        display: true,
                                                        text: "Document Status Distribution",
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-600">No document statistics available.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border border-gray-200">
                        <CardHeader className="bg-gray-100">
                            <CardTitle className="text-2xl text-primary">Tax Filing Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {taxFilingStats ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <FileText className="h-6 w-6 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Total Filings</p>
                                                <p className="text-lg font-bold">{taxFilingStats.total}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <Clock className="h-6 w-6 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                                <p className="text-lg font-bold">{taxFilingStats.pending}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <FileSearch className="h-6 w-6 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Under Review</p>
                                                <p className="text-lg font-bold">{taxFilingStats.underReview}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <FileCheck className="h-6 w-6 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Completed</p>
                                                <p className="text-lg font-bold">{taxFilingStats.completed}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <FileX className="h-6 w-6 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Rejected</p>
                                                <p className="text-lg font-bold">{taxFilingStats.rejected}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-64">
                                        <Bar
                                            data={taxFilingChartData}
                                            options={{
                                                ...chartOptions,
                                                plugins: {
                                                    ...chartOptions.plugins,
                                                    title: {
                                                        display: true,
                                                        text: "Tax Filing Status Distribution",
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-600">No tax filing statistics available.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border border-gray-200">
                        <CardHeader className="bg-gray-100">
                            <CardTitle className="text-2xl text-primary">Document Upload Timeline (Last 30 Days)</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {timelineData.length > 0 ? (
                                <div className="h-64">
                                    <Bar
                                        data={timelineChartData}
                                        options={{
                                            ...chartOptions,
                                            plugins: {
                                                ...chartOptions.plugins,
                                                title: {
                                                    display: true,
                                                    text: "Document Uploads by Type Over Time",
                                                },
                                            },
                                            scales: {
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: "Date",
                                                    },
                                                },
                                                y: {
                                                    title: {
                                                        display: true,
                                                        text: "Number of Documents",
                                                    },
                                                    beginAtZero: true,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-600">No document upload data available for the last 30 days.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}