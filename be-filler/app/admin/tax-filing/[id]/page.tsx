"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    CreditCard,
    Download,
    Eye
} from "lucide-react"
import Cookies from "js-cookie"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface ITaxFiling {
    _id: string
    userId: string
    year: string
    income: number
    deductions: number
    createdAt: string
    updatedAt?: string
    status: string
    personalInfo: {
        fullName: string
        cnic: string
        email?: string
        dateOfBirth?: string
        nationality?: string
        residentialStatus?: string
    }
    assignedTo?: string
    filingType: string
    payment?: {
        amount?: number
        method?: string
        transactionId?: string
        submittedAt?: string
        notes?: string
        paymentProof?: string
    }
    history?: Array<{
        status: string
        remarks: string
        updatedAt: string
    }>
    documents?: Array<{
        _id: string
        docType: string
        fileName: string
        filePath: string
        uploadedAt: string
        status: string
    }>
    family?: {
        spouse: boolean
        children: number
    }
}

export default function AdminTaxFilingDetails() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const taxFilingId = params?.id as string
    const [filing, setFiling] = useState<ITaxFiling | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const pageRef = useRef<HTMLDivElement>(null)

    const fetchFilingDetails = async () => {
        try {
            const token = Cookies.get('token')
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/documents/tax-filings/${taxFilingId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch filing details')
            }

            const data = await response.json()
            const filingData = data.data.taxFilings[0]
            setFiling({
                _id: filingData._id,
                userId: filingData.userId,
                year: filingData.year,
                income: filingData.income,
                deductions: filingData.deductions,
                createdAt: filingData.createdAt,
                updatedAt: filingData.updatedAt || filingData.createdAt,
                status: filingData.status || 'pending',
                personalInfo: {
                    fullName: filingData.user?.fullName || 'N/A',
                    cnic: filingData.user?.cnic || 'N/A',
                    email: filingData.user?.email || 'N/A',
                    dateOfBirth: filingData.personalInfo?.dateOfBirth,
                    nationality: filingData.personalInfo?.nationality,
                    residentialStatus: filingData.personalInfo?.residentialStatus
                },
                assignedTo: filingData.assignedTo || '',
                filingType: filingData.filingType || 'individual',
                payment: filingData.payment,
                history: filingData.history,
                documents: filingData.documentSummary?.documents || [],
                family: filingData.family
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load filing details.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFilingDetails()
    }, [taxFilingId, toast])

    const updateStatus = async (status: string, remarks: string) => {
        setUpdating(true)
        try {
            const token = Cookies.get('token')
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/documents/tax-filings/${taxFilingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status, remarks })
            })

            if (!response.ok) {
                throw new Error('Failed to update status')
            }

            toast({
                title: "Success",
                description: `Filing status updated to ${status}`,
            })

            fetchFilingDetails()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status.",
                variant: "destructive",
            })
        } finally {
            setUpdating(false)
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

            pdf.save(`tax-filing-${taxFilingId}.pdf`)
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate PDF. Please try again.",
            })
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
            pending_verification: { color: "bg-orange-100 text-orange-800", icon: Clock },
            under_review: { color: "bg-blue-100 text-blue-800", icon: FileText },
            completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
            rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
        }

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
        const Icon = config.icon

        return (
            <Badge className={config.color}>
                <Icon className="h-3 w-3 mr-1" />
                {status.replace('_', ' ').toUpperCase()}
            </Badge>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading filing details...</p>
                </div>
            </div>
        )
    }

    if (!filing) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Filing Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested tax filing could not be found.</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        )
    }

    return (
        <div ref={pageRef} className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Filings
                    </Button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Tax Filing Details
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Filing ID: {taxFilingId}
                            </p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                            {getStatusBadge(filing.status)}
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
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Full Name</span>
                                        <p className="font-medium">{filing.personalInfo?.fullName || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">CNIC</span>
                                        <p className="font-medium">{filing.personalInfo?.cnic || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Email</span>
                                        <p className="font-medium">{filing.personalInfo?.email || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Date of Birth</span>
                                        <p className="font-medium">
                                            {filing.personalInfo?.dateOfBirth
                                                ? new Date(filing.personalInfo.dateOfBirth).toLocaleDateString()
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Nationality</span>
                                        <p className="font-medium">{filing.personalInfo?.nationality || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Residential Status</span>
                                        <p className="font-medium">{filing.personalInfo?.residentialStatus || "N/A"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Filing Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Tax Year</span>
                                        <p className="font-medium">{filing.year || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Filing Type</span>
                                        <p className="font-medium capitalize">{filing.filingType || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Income</span>
                                        <p className="font-medium">{filing.income?.toLocaleString() || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Deductions</span>
                                        <p className="font-medium">{filing.deductions?.toLocaleString() || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Family</span>
                                        <p className="font-medium">
                                            {filing.family
                                                ? `Spouse: ${filing.family.spouse ? 'Yes' : 'No'}, Children: ${filing.family.children}`
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {filing.payment && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        Payment Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-500">Amount</span>
                                            <p className="font-medium text-lg text-green-600">
                                                Rs. {filing.payment.amount?.toLocaleString() || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Payment Method</span>
                                            <p className="font-medium capitalize">
                                                {filing.payment.method?.replace('_', ' ') || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Transaction ID</span>
                                            <p className="font-medium font-mono">
                                                {filing.payment.transactionId || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Submitted At</span>
                                            <p className="font-medium">
                                                {filing.payment.submittedAt
                                                    ? new Date(filing.payment.submittedAt).toLocaleString()
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    {filing.payment.notes && (
                                        <div className="mt-4">
                                            <span className="text-sm text-gray-500">Notes</span>
                                            <p className="text-sm bg-gray-50 p-3 rounded mt-1">
                                                {filing.payment.notes}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {filing.payment?.paymentProof && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Proof</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(filing.payment?.paymentProof, '_blank')}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Image
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    const link = document.createElement('a')
                                                    link.href = filing.payment?.paymentProof || ''
                                                    link.download = `payment_proof_${taxFilingId}.jpg`
                                                    link.click()
                                                }}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                        <div className="border rounded-lg overflow-hidden">
                                            <img
                                                src={filing.payment.paymentProof}
                                                alt="Payment Proof"
                                                className="w-full h-64 object-contain bg-gray-100"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-image.jpg'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {filing.documents && filing.documents.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {filing.documents.map((doc) => (
                                            <div key={doc._id} className="border p-3 rounded-md bg-gray-50">
                                                <p className="text-sm">
                                                    <span className="font-semibold">Type:</span> {doc.docType}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">File Name:</span> {doc.fileName}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">Status:</span> {doc.status.toUpperCase()}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">Uploaded At:</span>{" "}
                                                    {new Date(doc.uploadedAt).toLocaleString()}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(doc.filePath, '_blank')}
                                                    className="mt-2"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Document
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {filing.status === 'pending_verification' && (
                                    <>
                                        <Button
                                            onClick={() => updateStatus('under_review', 'Payment verified, filing under review')}
                                            disabled={updating}
                                            className="w-full"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Verify Payment & Start Review
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => updateStatus('rejected', 'Payment verification failed')}
                                            disabled={updating}
                                            className="w-full"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject Payment
                                        </Button>
                                    </>
                                )}
                                {filing.status === 'under_review' && (
                                    <>
                                        <Button
                                            onClick={() => updateStatus('completed', 'Tax filing completed successfully')}
                                            disabled={updating}
                                            className="w-full"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Mark as Completed
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => updateStatus('rejected', 'Filing rejected after review')}
                                            disabled={updating}
                                            className="w-full"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject Filing
                                        </Button>
                                    </>
                                )}
                                {filing.status === 'pending' && (
                                    <Button
                                        onClick={() => updateStatus('pending_verification', 'Filing submitted for payment verification')}
                                        disabled={updating}
                                        className="w-full"
                                    >
                                        <Clock className="h-4 w-4 mr-2" />
                                        Mark as Pending Verification
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Filing History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {filing.history?.map((entry, index) => (
                                        <div key={index} className="border-l-2 border-gray-200 pl-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {entry.status.replace('_', ' ')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {entry.remarks}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(entry.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-500">Assigned To</span>
                                    <p className="font-medium">
                                        {filing.assignedTo ? filing.personalInfo.fullName : "Unassigned"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Last Updated</span>
                                    <p className="font-medium">
                                        {new Date(filing.updatedAt || filing.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Documents</span>
                                    <p className="font-medium">
                                        {filing.documents?.length || 0} uploaded
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}