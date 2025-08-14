
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Pie, Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    ArcElement,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { getCurrentUser } from "@/lib/auth"
import Unauthorized from "@/components/Unauthorized"
import Cookies from "js-cookie"

ChartJS.register(ArcElement, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler)

interface IDocument {
    id: string
    module: string
    docType: string
    fileName: string
    filePath: string
    uploadedAt: string
    status: string
    businessName?: string
    purpose?: string
    gstStatus?: string
}

export default function DocumentReportsDetail() {
    const router = useRouter()
    const params = useParams()
    const id = params && typeof params['id'] === 'string' ? params['id'] : Array.isArray(params?.['id']) ? params?.['id'][0] : undefined
    const { toast } = useToast()
    const [documents, setDocuments] = useState<IDocument[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState({ approved: 1, rejected: 1, pending: 1 })
    const itemsPerPage = 10
    const pageRef = useRef<HTMLDivElement>(null)
    const [reportMetrics, setReportMetrics] = useState({
        totalDocuments: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        documentTypes: {} as Record<string, number>,
        uploadTimeline: [] as { date: string; count: number }[],
    })

    const user = getCurrentUser()
    if (user?.role !== 'accountant') {
        return <Unauthorized />
    }

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const token = Cookies.get('token')
                if (!token) {
                    throw new Error("No authentication token found")
                }

                const response = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/documents?userId=${id}`, {
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
                const docs = data.data.documents.map((doc: any) => ({
                    id: doc._id,
                    module: doc.module,
                    docType: doc.docType,
                    fileName: doc.fileName,
                    filePath: doc.filePath,
                    uploadedAt: doc.uploadedAt,
                    status: doc.status,
                    businessName: doc.businessName,
                    purpose: doc.purpose,
                    gstStatus: doc.gstStatus
                }))

                setDocuments(docs)

                const documentTypes: Record<string, number> = {}
                const uploadTimelineMap: Record<string, number> = {}
                let pending = 0
                let approved = 0
                let rejected = 0

                docs.forEach((doc: IDocument) => {
                    documentTypes[doc.docType] = (documentTypes[doc.docType] || 0) + 1
                    if (doc.status === "pending") pending++
                    else if (doc.status === "approved") approved++
                    else if (doc.status === "rejected") rejected++
                    if (doc.uploadedAt) {
                        const date = new Date(doc.uploadedAt).toISOString().split('T')[0]
                        uploadTimelineMap[date] = (uploadTimelineMap[date] || 0) + 1
                    }
                })

                const uploadTimeline = Object.entries(uploadTimelineMap)
                    .map(([date, count]) => ({ date, count }))
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

                setReportMetrics({
                    totalDocuments: docs.length,
                    pending,
                    approved,
                    rejected,
                    documentTypes,
                    uploadTimeline,
                })
            } catch (e) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch documents. Please try again.",
                })
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchDocuments()
        }
    }, [id, toast])

    const documentTypeChart = {
        data: {
            labels: Object.keys(reportMetrics.documentTypes),
            datasets: [{
                data: Object.values(reportMetrics.documentTypes),
                backgroundColor: ['#af0e0e', '#4a90e2', '#50c878', '#f1c40f', '#9b59b6'],
                borderColor: '#ffffff',
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top" as const, labels: { font: { size: 12 } } },
                title: { display: true, text: 'Document Type Distribution', font: { size: 16 } },
            },
        },
    }

    const uploadTimelineChart = {
        data: {
            labels: reportMetrics.uploadTimeline.map(item => item.date),
            datasets: [{
                label: 'Documents Uploaded',
                data: reportMetrics.uploadTimeline.map(item => item.count),
                borderColor: '#af0e0e',
                backgroundColor: 'rgba(175, 14, 14, 0.2)',
                fill: true,
                tension: 0.4,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top" as const, labels: { font: { size: 12 } } },
                title: { display: true, text: 'Document Upload Timeline', font: { size: 16 } },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Number of Documents', font: { size: 12 } },
                },
                x: {
                    title: { display: true, text: 'Date', font: { size: 12 } },
                },
            },
        },
    }

    const documentStatusChart = {
        data: {
            labels: ['Pending', 'Approved', 'Rejected'],
            datasets: [{
                data: [reportMetrics.pending, reportMetrics.approved, reportMetrics.rejected],
                backgroundColor: ['#d3d3d3', '#50c878', '#af0e0e'],
                borderColor: '#ffffff',
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top" as const, labels: { font: { size: 12 } } },
                title: { display: true, text: 'Document Status Distribution', font: { size: 16 } },
            },
        },
    }

    const handleViewDocument = async (documentId: string) => {
        try {
            const token = Cookies.get('token')
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/documents/${documentId}?reportType=detailed`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch document details')
            }

            router.push(`/accountant/document-management/${documentId}`)
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch document details. Please try again.",
            })
        }
    }

    const getPaginatedDocuments = (status: string) => {
        const filteredDocs = documents.filter(doc => doc.status === status)
        const totalPages = Math.ceil(filteredDocs.length / itemsPerPage)
        const paginatedDocs = filteredDocs.slice(
            (currentPage[status as keyof typeof currentPage] - 1) * itemsPerPage,
            currentPage[status as keyof typeof currentPage] * itemsPerPage
        )
        return { paginatedDocs, totalPages, filteredDocs }
    }

    const renderDocumentTable = (status: string) => {
        const { paginatedDocs, totalPages, filteredDocs } = getPaginatedDocuments(status)
        return (
            <>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 font-medium">Name</th>
                                <th className="p-3 font-medium">GST Status</th>
                                <th className="p-3 font-medium">Type</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDocs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-3 text-center text-muted-foreground">
                                        No {status} documents found
                                    </td>
                                </tr>
                            ) : (
                                paginatedDocs.map((doc) => (
                                    <tr key={doc.id} className="border-b">
                                        <td className="p-3">{doc.fileName || "N/A"}</td>
                                        <td className="p-3">{doc.gstStatus || "N/A"}</td>
                                        <td className="p-3 capitalize">{doc.docType}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${doc.status === "approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : doc.status === "rejected"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {doc.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDocument(doc.id)}
                                                className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                                                aria-label={`View document ${doc.fileName || "N/A"}`}
                                            >
                                                View
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
                            Showing {(currentPage[status as keyof typeof currentPage] - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage[status as keyof typeof currentPage] * itemsPerPage, filteredDocs.length)} of{" "}
                            {filteredDocs.length} documents
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage[status as keyof typeof currentPage] === 1}
                                onClick={() => setCurrentPage(prev => ({ ...prev, [status]: prev[status as keyof typeof prev] - 1 }))}
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage[status as keyof typeof currentPage] === totalPages}
                                onClick={() => setCurrentPage(prev => ({ ...prev, [status]: prev[status as keyof typeof prev] + 1 }))}
                                aria-label="Next page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </>
        )
    }

    const handleDownloadPDF = async () => {
        if (!pageRef.current) return

        try {
            const token = Cookies.get('token')
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/documents/report?reportType=summary&userId=${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch report summary')
            }

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

            pdf.save(`reports-${id}.pdf`)
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate PDF. Please try again.",
            })
        }
    }

    return (
        <div ref={pageRef} className="container px-4 mx-auto py-8 mt-16">
            <div className="mb-8 flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/accountant/reports')}
                    className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                    aria-label="Back to reports"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div className="flex w-full justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Document Reports</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Detailed document reports for the selected user
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadPDF}
                        className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                        aria-label="Download PDF report"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                <Card className="w-full border shadow-sm">
                    <CardHeader className="bg-gray-50">
                        <CardTitle className="text-xl">Report Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Total Documents</Label>
                                    <p className="mt-1 text-lg font-semibold">{reportMetrics.totalDocuments}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Document Status</Label>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
                                            <span>Pending</span>
                                            <span className="font-semibold">{reportMetrics.pending}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
                                            <span>Approved</span>
                                            <span className="font-semibold">{reportMetrics.approved}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
                                            <span>Rejected</span>
                                            <span className="font-semibold">{reportMetrics.rejected}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Document Types</Label>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {Object.keys(reportMetrics.documentTypes).length > 0 ? (
                                            Object.entries(reportMetrics.documentTypes).map(([type, count]) => (
                                                <div
                                                    key={type}
                                                    className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm"
                                                >
                                                    <span className="capitalize">{type}</span>
                                                    <span className="font-semibold">{count}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground col-span-2">
                                                No document types found
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {reportMetrics.totalDocuments > 0 && (
                    <Card className="w-full border shadow-sm">
                        <CardHeader className="bg-gray-50">
                            <CardTitle className="text-xl">Document Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div style={{ height: '250px' }}>
                                <Pie data={documentStatusChart.data} options={documentStatusChart.options} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {reportMetrics.totalDocuments > 0 && (
                    <Card className="w-full border shadow-sm">
                        <CardHeader className="bg-gray-50">
                            <CardTitle className="text-xl">Document Type Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div style={{ height: '250px' }}>
                                <Pie data={documentTypeChart.data} options={documentTypeChart.options} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="w-full border shadow-sm">
                    <CardHeader className="bg-gray-50">
                        <CardTitle className="text-xl">Upload Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : reportMetrics.uploadTimeline.length > 0 ? (
                            <div className="space-y-4">
                                <div style={{ height: '250px' }}>
                                    <Line data={uploadTimelineChart.data} options={uploadTimelineChart.options} />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Upload Details</Label>
                                    <div className="mt-2 space-y-2">
                                        {reportMetrics.uploadTimeline.map((entry, index) => (
                                            <div key={index} className="border p-3 rounded-md bg-gray-50">
                                                <p className="text-sm">
                                                    <span className="font-semibold">Date:</span> {entry.date}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">Documents Uploaded:</span> {entry.count}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-muted">No upload available</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="w-full border shadow-sm">
                    <CardHeader className="bg-gray-50">
                        <CardTitle className="text-xl">Documents by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Tabs defaultValue="pending" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="approved">Approved</TabsTrigger>
                                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                            </TabsList>
                            <TabsContent value="pending">
                                {renderDocumentTable("pending")}
                            </TabsContent>
                            <TabsContent value="approved">
                                {renderDocumentTable("approved")}
                            </TabsContent>
                            <TabsContent value="rejected">
                                {renderDocumentTable("rejected")}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}