"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { DocumentService, IDocument } from "@/services/document.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatDate } from "@/lib/utils"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import Link from "next/link"
import { ArrowRight, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { axiosInstance } from "@/lib/ApiClient"

export default function WealthStatementsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [documents, setDocuments] = useState<IDocument[]>([])
    const [filteredDocuments, setFilteredDocuments] = useState<IDocument[]>([])
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [error, setError] = useState<string | null>(null)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [uploadType, setUploadType] = useState<string>("")
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        console.log("WealthStatementsPage useEffect triggered")
        const isAuth = isAuthenticated()
        console.log("isAuthenticated:", isAuth)
        if (!isAuth) {
            console.log("Redirecting to /auth/login due to unauthenticated user")
            router.push("/auth/login")
            return
        }

        const currentUser = getCurrentUser()
        console.log("Current user:", currentUser)
        if (!currentUser || !currentUser.id) {
            console.log("Redirecting to /auth/login due to missing or invalid user")
            router.push("/auth/login")
            return
        }

        setUser(currentUser)

        if (currentUser.role === "admin") {
            console.log("Redirecting to /dashboard/admin")
            router.push("/dashboard/admin")
            return
        }
        if (currentUser.role === "accountant") {
            console.log("Redirecting to /dashboard/accountant")
            router.push("/dashboard/accountant")
            return
        }
    }, [router])

    useEffect(() => {
        if (user?.id) {
            fetchDocuments()
        }
    }, [user])

    const fetchDocuments = async () => {
        if (!user?.id) {
            console.error("Cannot fetch documents: user.id is undefined")
            setError("Failed to load documents: User ID is missing")
            setLoading(false)
            return
        }

        try {
            console.log("Fetching documents for userId:", user.id)
            const documentService = new DocumentService()
            const response = await documentService.getByUser(user.id)
            console.log("API response:", response)
            console.log("Response status:", documentService.lastResponse?.status)
            console.log("Response headers:", documentService.lastResponse?.headers)
            const allDocuments = response || []
            console.log("All documents fetched:", allDocuments)
            const documentTypes = [...new Set(allDocuments.map(doc => doc.type))]
            console.log("Available document types:", documentTypes)
            const wealthDocuments = allDocuments
            console.log("Documents to display:", wealthDocuments)
            setDocuments(wealthDocuments)
            setFilteredDocuments(wealthDocuments)
            if (wealthDocuments.length === 0) {
                console.log("No documents found for user")
                setError("No documents found. Upload documents to view your wealth statements.")
            }
        } catch (err: any) {
            console.error("Error fetching documents:", err.message, err.response?.data, err.response?.status)
            setError(`Failed to load documents: ${err.message} `)
        } finally {
            console.log("Fetch completed, setting loading to false")
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log("Status filter updated to:", statusFilter)
        if (statusFilter === "all") {
            setFilteredDocuments(documents)
        } else {
            const filtered = documents.filter(doc => doc.status === statusFilter)
            console.log("Filtered documents by status:", filtered)
            setFilteredDocuments(filtered)
        }
    }, [statusFilter, documents])

    const handleStatusFilterChange = (value: string) => {
        console.log("Status filter changed to:", value)
        setStatusFilter(value)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!uploadFile) {
            toast({ title: "Error", description: "Please select a file", variant: "destructive" })
            return
        }
        if (!uploadType) {
            toast({ title: "Error", description: "Please select a document type", variant: "destructive" })
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", uploadFile)
            formData.append("name", uploadFile.name)
            formData.append("type", uploadType)
            formData.append("userId", user.id)

            const response = await axiosInstance.post(
                "https://backend-production-5fad.up.railway.app/api/v1/secure/document/post-docs",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            )
            console.log("Document uploaded:", response)
            toast({ title: "Success", description: "Document uploaded successfully" })
            setIsUploadModalOpen(false)
            setUploadFile(null)
            setUploadType("")
            await fetchDocuments()
        } catch (err: any) {
            console.error("Upload error:", err.message, err.response?.data)
            toast({ title: "Error", description: `Failed to upload: ${err.message} `, variant: "destructive" })
        } finally {
            setIsUploading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <div className="mt-4 space-x-4">
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                    <Button
                        onClick={() => setIsUploadModalOpen(true)}
                        variant="outline"
                        className="border-[#af0e0e] text-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                    >
                        <Upload className="h-4 w-4 mr-2" /> Upload Documents
                    </Button>
                </div>
            </div>
        )
    }

    if (!user) {
        return <div className="text-center py-8 text-red-500">Failed to load user data</div>
    }

    return (
        <div className="container px-4 mx-auto py-8 mt-16">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Wealth Statements</h1>
                    <p className="text-muted-foreground">View and manage your assets and liabilities declarations</p>
                </div>
                <Button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-[#af0e0e] hover:bg-[#8a0b0b]"
                >
                    <Upload className="h-4 w-4 mr-2" /> Upload Document
                </Button>
            </div>

            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-muted-foreground">Document File</label>
                            <Input
                                type="file"
                                accept=".pdf,image/png,image/jpeg"
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Document Type</label>
                            <Select onValueChange={setUploadType} value={uploadType} disabled={isUploading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NTN">NTN</SelectItem>
                                    <SelectItem value="TaxReturn">Tax Return</SelectItem>
                                    <SelectItem value="SalarySlip">Salary Slip</SelectItem>
                                    <SelectItem value="CNIC">CNIC</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsUploadModalOpen(false)}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="bg-[#af0e0e] hover:bg-[#8a0b0b]"
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Your Wealth Statements</CardTitle>
                            <CardDescription>All your filed wealth statements</CardDescription>
                        </div>
                        <Select onValueChange={handleStatusFilterChange} value={statusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        {filteredDocuments.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Statement</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Filing Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Total Assets</TableHead>
                                        <TableHead>Total Liabilities</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDocuments.map(doc => (
                                        <TableRow key={doc.id}>
                                            <TableCell>{doc.name || "Unknown"}</TableCell>
                                            <TableCell>{doc.type}</TableCell>
                                            <TableCell>{formatDate(doc.createdAt || "")}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline - flex items - center px - 2 py - 1 rounded - full text - xs ${doc.status === "approved"
                                                        ? " text-green-800 dark:text-green-400"
                                                        : doc.status === "pending"
                                                            ? "text-yellow-800 dark:text-yellow-400"
                                                            : "text-red-800 dark:text-red-400"
                                                        } `}
                                                >
                                                    {doc.status === "approved" ? "Approved" :
                                                        doc.status === "pending" ? "Pending" : "Rejected"}
                                                </span>
                                            </TableCell>
                                            <TableCell>{formatCurrency(1000000)}</TableCell>
                                            <TableCell>{formatCurrency(200000)}</TableCell>
                                            <TableCell>
                                                <Link href={`/dashboard/wealth-statements/${doc._id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">
                                <p>No documents found.</p>
                                <Button
                                    onClick={() => setIsUploadModalOpen(true)}
                                    variant="outline"
                                    className="mt-4 border-[#af0e0e] text-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                                >
                                    <Upload className="h-4 w-4 mr-2" /> Upload Documents
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Wealth Statement Overview</CardTitle>
                            <CardDescription>Summary of your assets and liabilities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                You have {documents.filter(d => d.status === "approved").length} approved,
                                {documents.filter(d => d.status === "pending").length} pending, and
                                {documents.filter(d => d.status === "rejected").length} rejected documents.
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <RecentActivity />
                </div>
            </div>
        </div>
    )
}