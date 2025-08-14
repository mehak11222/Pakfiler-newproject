"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { TaxFilingService, ITaxFiling } from "@/services/taxFiling.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency, formatDate } from "@/lib/utils"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import Link from "next/link"
import { ArrowRight, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { axiosInstance } from "@/lib/ApiClient"

export default function TaxReturnsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [taxFilings, setTaxFilings] = useState<ITaxFiling[]>([])
    const [filteredFilings, setFilteredFilings] = useState<ITaxFiling[]>([])
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [error, setError] = useState<string | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [formData, setFormData] = useState<{
        taxYear: number
        filingType: string
        grossIncome: number
        taxPaid: number
        documentType: string
        notes: string
    }>({
        taxYear: new Date().getFullYear(),
        filingType: "individual",
        grossIncome: 0,
        taxPaid: 0,
        documentType: "Other",
        notes: "",
    })
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        console.log("TaxReturnsPage useEffect triggered")
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

        const fetchTaxFilings = async () => {
            try {
                console.log("Fetching tax filings for user:", currentUser.id)
                const taxService = new TaxFilingService()
                const filings = await taxService.getByUser(currentUser.id)
                console.log("Tax filings fetched:", filings)
                setTaxFilings(filings)
                setFilteredFilings(filings)
            } catch (err: any) {
                console.error("Error fetching tax filings:", err.message, err.response?.data)
                setError("Failed to load tax filings. Please try again.")
            } finally {
                console.log("Fetch completed, setting loading to false")
                setLoading(false)
            }
        }

        fetchTaxFilings()
    }, [router])

    useEffect(() => {
        console.log("Status filter updated to:", statusFilter)
        if (statusFilter === "all") {
            setFilteredFilings(taxFilings)
        } else {
            setFilteredFilings(taxFilings.filter((filing) => filing.status === statusFilter))
        }
    }, [statusFilter, taxFilings])

    const handleStatusFilterChange = (value: string) => {
        console.log("Status filter changed to:", value)
        setStatusFilter(value)
    }

    const handleFormChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const validTypes = ["application/pdf", "image/png", "image/jpeg"]
        const maxSize = 10 * 1024 * 1024 // 10MB
        const validFiles: File[] = []

        files.forEach((file) => {
            if (!validTypes.includes(file.type)) {
                toast({
                    title: "Invalid File Type",
                    description: `${file.name} is not a supported type(PDF, PNG, JPEG)`,
                    variant: "destructive",
                })
                return
            }
            if (file.size > maxSize) {
                toast({
                    title: "File Too Large",
                    description: `${file.name} exceeds 10MB`,
                    variant: "destructive",
                })
                return
            }
            validFiles.push(file)
        })

        setSelectedFiles((prev) => [...prev, ...validFiles])
    }

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleAddFiling = async () => {
        if (!formData.taxYear || isNaN(formData.taxYear) || formData.grossIncome < 0 || formData.taxPaid < 0) {
            toast({ title: "Error", description: "Invalid tax year, gross income, or tax paid", variant: "destructive" })
            return
        }
        if (!["individual", "business"].includes(formData.filingType)) {
            toast({ title: "Error", description: "Invalid filing type", variant: "destructive" })
            return
        }
        if (selectedFiles.length > 0 && !formData.documentType) {
            toast({ title: "Error", description: "Please select a document type", variant: "destructive" })
            return
        }

        setIsSubmitting(true)
        try {
            const taxService = new TaxFilingService()
            const documentIds: string[] = []

            // Upload documents
            for (const file of selectedFiles) {
                try {
                    const uploadFormData = new FormData()
                    uploadFormData.append("file", file)
                    uploadFormData.append("name", file.name)
                    uploadFormData.append("type", formData.documentType)
                    uploadFormData.append("userId", user.id)
                    uploadFormData.append("notes", formData.notes)

                    const response = await axiosInstance.post(
                        "https://backend-production-5fad.up.railway.app/api/v1/secure/document/post-docs",
                        uploadFormData,
                        {
                            headers: { "Content-Type": "multipart/form-data" },
                        }
                    )

                    if (response.data && (response.data.id || response.data._id)) {
                        documentIds.push(response.data.id || response.data._id)
                    } else {
                        throw new Error(`Document created but no ID returned for ${file.name}`)
                    }
                } catch (fileError: any) {
                    toast({
                        title: "Document Upload Failed",
                        description: `Failed to upload ${file.name}: ${fileError.response?.data?.message || fileError.message} `,
                        variant: "destructive",
                    })
                    continue
                }
            }

            // Create tax filing
            const payload = {
                taxYear: Number(formData.taxYear),
                filingType: formData.filingType,
                grossIncome: Number(formData.grossIncome),
                taxPaid: Number(formData.taxPaid),
                documents: documentIds,
            }

            const newFiling = await taxService.create(user.id, payload)
            setTaxFilings((prev) => [...prev, newFiling])
            setFilteredFilings((prev) => [...prev, newFiling])

            toast({
                title: "Success",
                description: `Tax filing created successfully${documentIds.length > 0 ? ` with ${documentIds.length} document(s)` : ""} `,
            })
            setIsAddModalOpen(false)
            setFormData({
                taxYear: new Date().getFullYear(),
                filingType: "individual",
                grossIncome: 0,
                taxPaid: 0,
                documentType: "Other",
                notes: "",
            })
            setSelectedFiles([])
        } catch (err: any) {
            console.error("Create filing error:", err.message, err.response?.data)
            const errorMessage = err.message.includes("Unexpected field")
                ? "Invalid file field. Please try again."
                : `Failed to create filing: ${err.message} `
            toast({ title: "Error", description: errorMessage, variant: "destructive" })
        } finally {
            setIsSubmitting(false)
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
                <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
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
                    <h1 className="text-3xl font-bold">Tax Returns</h1>
                    <p className="text-muted-foreground">View and manage your tax filings</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#af0e0e] hover:bg-[#8a0b0b]"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Filing
                </Button>
            </div>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Tax Filing</DialogTitle>
                        <DialogDescription>
                            Fill in the details and upload documents to create a new tax filing.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="taxYear" className="text-right">
                                Tax Year
                            </Label>
                            <Input
                                id="taxYear"
                                type="number"
                                value={formData.taxYear}
                                onChange={(e) => handleFormChange("taxYear", Number.parseInt(e.target.value))}
                                className="col-span-3"
                                min={2000}
                                max={new Date().getFullYear()}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="filingType" className="text-right">
                                Filing Type
                            </Label>
                            <Select
                                value={formData.filingType}
                                onValueChange={(value) => handleFormChange("filingType", value)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select filing type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="individual">Individual</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="grossIncome" className="text-right">
                                Gross Income
                            </Label>
                            <Input
                                id="grossIncome"
                                type="number"
                                value={formData.grossIncome}
                                onChange={(e) => handleFormChange("grossIncome", Number.parseFloat(e.target.value))}
                                className="col-span-3"
                                min={0}
                                step="0.01"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="taxPaid" className="text-right">
                                Tax Paid
                            </Label>
                            <Input
                                id="taxPaid"
                                type="number"
                                value={formData.taxPaid}
                                onChange={(e) => handleFormChange("taxPaid", Number.parseFloat(e.target.value))}
                                className="col-span-3"
                                min={0}
                                step="0.01"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="documentType" className="text-right">
                                Document Type
                            </Label>
                            <Select
                                value={formData.documentType}
                                onValueChange={(value) => handleFormChange("documentType", value)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select document type" />
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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleFormChange("notes", e.target.value)}
                                placeholder="Add any notes"
                                className="col-span-3"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="documents" className="text-right">
                                Documents
                            </Label>
                            <div className="col-span-3 space-y-2">
                                <Input
                                    id="documents"
                                    type="file"
                                    multiple
                                    accept=".pdf,image/png,image/jpeg"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                />
                                {selectedFiles.length > 0 && (
                                    <div className="text-sm text-muted-foreground">
                                        <p>Selected files:</p>
                                        <ul className="list-disc pl-4">
                                            {selectedFiles.map((file, index) => (
                                                <li key={index} className="flex items-center justify-between">
                                                    <span>
                                                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFile(index)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsAddModalOpen(false)
                                setSelectedFiles([])
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleAddFiling}
                            disabled={isSubmitting}
                            className="bg-[#af0e0e] hover:bg-[#8a0b0b]"
                        >
                            {isSubmitting ? "Submitting..." : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Your Tax Filings</CardTitle>
                            <CardDescription>All your filed tax returns</CardDescription>
                        </div>
                        <Select onValueChange={handleStatusFilterChange} value={statusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="under_review">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        {filteredFilings.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tax Year</TableHead>
                                        <TableHead>Filing Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tax Amount</TableHead>
                                        <TableHead>Refund</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredFilings.map((filing) => (
                                        <TableRow key={String(filing.id ?? filing._id)}>
                                            <TableCell>{filing.taxYear}</TableCell>
                                            <TableCell>{formatDate(filing.createdAt || "")}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline - flex items - center px - 2 py - 1 rounded - full text - xs ${filing.status === "completed"
                                                        ? " text-green-800 dark:text-green-400"
                                                        : filing.status === "under_review"
                                                            ? "text-yellow-800 dark:text-yellow-400"
                                                            : "text-red-800 dark:text-red-400"
                                                        } `}
                                                >
                                                    {filing.status === "completed"
                                                        ? "Completed"
                                                        : filing.status === "under_review"
                                                            ? "Pending"
                                                            : "Rejected"}
                                                </span>
                                            </TableCell>
                                            <TableCell>{formatCurrency(filing.taxPaid)}</TableCell>
                                            <TableCell>
                                                {filing.grossIncome > filing.taxPaid ? (
                                                    <span className="text-green-600">
                                                        {formatCurrency(filing.grossIncome - filing.taxPaid)}
                                                    </span>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/dashboard/tax-returns/${filing._id}`}>
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
                            <p className="text-sm text-muted-foreground">No tax filings found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tax Filing Overview</CardTitle>
                            <CardDescription>Summary of your tax filing status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                You have {taxFilings.filter((f) => f.status === "completed").length} completed,
                                {taxFilings.filter((f) => f.status === "under_review").length} pending, and
                                {taxFilings.filter((f) => f.status === "rejected").length} rejected filings.
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