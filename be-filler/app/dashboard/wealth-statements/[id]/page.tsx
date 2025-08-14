"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { DocumentService, IDocument } from "@/services/document.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { ArrowLeft, FileText, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WealthStatementDetailPage() {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [document, setDocument] = useState<IDocument | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        console.log("WealthStatementDetailPage useEffect triggered")
        const isAuth = isAuthenticated()
        console.log("isAuthenticated:", isAuth)
        if (!isAuth) {
            console.log("Redirecting to /auth/login")
            router.push("/auth/login")
            return
        }

        const currentUser = getCurrentUser()
        console.log("Current user:", currentUser)
        if (!currentUser || !currentUser.id) {
            console.log("Redirecting to /auth/login due to missing user")
            router.push("/auth/login")
            return
        }

        setUser(currentUser)

        const fetchDocument = async () => {
            try {
                const id = params.id as string
                console.log("Fetching document with ID:", id)
                const documentService = new DocumentService()
                const doc = await documentService.getById(id)
                console.log("Document fetched:", doc)
                setDocument(doc)
            } catch (err: any) {
                console.error("Error fetching document:", err.message, err.response?.data)
                setError(`Failed to load document: ${err.message} `)
            } finally {
                console.log("Fetch completed, setting loading to false")
                setLoading(false)
            }
        }

        fetchDocument()
    }, [router, params.id])

    const handleViewDocument = () => {
        if (document?.fileUrl) {
            console.log("Opening document URL:", document.fileUrl)
            window.open(document.fileUrl, "_blank")
        } else {
            toast({
                title: "Error",
                description: "Document file not available",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !document) {
        return (
            <div className="container px-4 mx-auto py-8 mt-16 text-center text-red-500">
                <p>{error || "Document not found"}</p>
                <Button onClick={() => router.push("/dashboard/wealth-statements")} className="mt-4 bg-[#af0e0e] hover:bg-[#8a0b0b]">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Wealth Statements
                </Button>
            </div>
        )
    }

    return (
        <div className="container px-4 mx-auto py-8 mt-16">
            <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/wealth-statements")}
                className="mb-6 hover:bg-[#af0e0e]/10"
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Wealth Statements
            </Button>
            <h1 className="text-3xl font-bold mb-2">Wealth Statement Details</h1>
            <p className="text-muted-foreground mb-8">Detailed view of your wealth statement</p>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-[#af0e0e]" />
                            Document Information
                        </CardTitle>
                        <CardDescription>Metadata and status details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="text-lg font-semibold">{document.name || "Unknown"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Type</p>
                                <p className="text-lg font-semibold">{document.type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge
                                    variant="outline"
                                    className={
                                        document.status === "approved"
                                            ? "border-green-500 text-green-500"
                                            : document.status === "pending"
                                                ? "border-yellow-500 text-yellow-500"
                                                : "border-red-500 text-red-500"
                                    }
                                >
                                    {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Filing Date</p>
                                <p className="text-lg font-semibold">{formatDate(document.createdAt || "")}</p>
                            </div>
                            {document.notes && (
                                <div className="col-span-1 md:col-span-2">
                                    <p className="text-sm text-muted-foreground">Notes</p>
                                    <p className="text-lg">{document.notes}</p>
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={handleViewDocument}
                            className="mt-6 bg-[#af0e0e] hover:bg-[#8a0b0b]"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Document
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Assets and Liabilities</CardTitle>
                        <CardDescription>Summary of declared assets and liabilities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Assets</p>
                                <p className="text-lg font-semibold">{formatCurrency(1000000)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Liabilities</p>
                                <p className="text-lg font-semibold">{formatCurrency(200000)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {document.reviewLogs && document.reviewLogs.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Review History</CardTitle>
                            <CardDescription>History of reviews and status updates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reviewed By</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Notes</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {document.reviewLogs.map((log, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{log.reviewedBy || "Unknown"}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        log.status === "approved"
                                                            ? "border-green-500 text-green-500"
                                                            : log.status === "pending"
                                                                ? "border-yellow-500 text-yellow-500"
                                                                : "border-red-500 text-red-500"
                                                    }
                                                >
                                                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{log.notes || "-"}</TableCell>
                                            <TableCell>{formatDate(log.reviewedAt)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}