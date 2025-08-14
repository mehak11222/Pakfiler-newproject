"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { TaxFilingService, ITaxFiling } from "@/services/taxFiling.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export default function TaxFilingDetailsPage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [filing, setFiling] = useState<ITaxFiling | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        console.log("TaxFilingDetailsPage useEffect triggered")
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

        const fetchTaxFiling = async () => {
            try {
                const id = params?.id as string
                console.log("Fetching tax filing with id:", id)
                if (!id) {
                    throw new Error("Tax filing ID is missing")
                }
                const taxService = new TaxFilingService()
                const filingData = await taxService.getById(id)
                console.log("Tax filing fetched:", filingData)
                if (!filingData) {
                    throw new Error("Tax filing not found")
                }
                if (filingData.user !== currentUser.id) {
                    console.log("Unauthorized access to tax filing")
                    router.push("/tax-returns")
                    return
                }
                setFiling(filingData)
            } catch (err: any) {
                console.error("Error fetching tax filing:", err.message, err.response?.data, err.response?.status)
                setError(`Failed to load tax filing: ${err.message} `)
            } finally {
                console.log("Fetch completed, setting loading to false")
                setLoading(false)
            }
        }

        fetchTaxFiling()
    }, [router, params?.id])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container px-4 mx-auto py-8 mt-16 text-center text-red-500">
                <p>{error}</p>
                <div className="mt-4 space-x-4">
                    <Button onClick={() => window.location.reload()} className="bg-[#af0e0e] hover:bg-[#8a0b0b]">
                        Retry
                    </Button>
                    <Link href="/tax-returns">
                        <Button variant="outline" className="border-[#af0e0e] text-[#af0e0e] hover:bg-[#af0e0e] hover:text-white">
                            Back to Tax Returns
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    if (!user || !filing) {
        return <div className="container px-4 mx-auto py-8 mt-16 text-center text-red-500">Failed to load tax filing data</div>
    }

    return (
        <div className="container px-4 mx-auto py-8 mt-16">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Tax Filing Details</h1>
                    <p className="text-muted-foreground">Details for tax filing {filing.taxYear}</p>
                </div>
                <Link href="/tax-returns">
                    <Button className="bg-[#af0e0e] hover:bg-[#8a0b0b]">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tax Returns
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tax Filing Information</CardTitle>
                    <CardDescription>Summary of your tax filing for {filing.taxYear}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">General Information</h3>
                            <dl className="space-y-2">
                                <div className="flex">
                                    <dt className="font-medium w-1/3">Tax Year:</dt>
                                    <dd className="w-2/3">{filing.taxYear}</dd>
                                </div>
                                <div className="flex">
                                    <dt className="font-medium w-1/3">Filing Date:</dt>
                                    <dd className="w-2/3">{formatDate(filing.createdAt || "")}</dd>
                                </div>
                                <div className="flex">
                                    <dt className="font-medium w-1/3">Status:</dt>
                                    <dd className="w-2/3">
                                        <span
                                            className={`inline - flex items - center px - 2 py - 1 rounded - full text - xs ${filing.status === "completed"
                                                ? "text-green-800 dark:text-green-400"
                                                : filing.status === "under_review"
                                                    ? " text-yellow-800 dark:text-yellow-400"
                                                    : "text-red-800 dark:text-red-400"
                                                } `}
                                        >
                                            {filing.status === "completed" ? "Completed" :
                                                filing.status === "under_review" ? "Pending" : "Rejected"}
                                        </span>
                                    </dd>
                                </div>
                                <div className="flex">
                                    <dt className="font-medium w-1/3">Filed By:</dt>
                                    <dd className="w-2/3">{filing.filedBy || "N/A"}</dd>
                                </div>
                                <div className="flex">
                                    <dt className="font-medium w-1/3">Last Updated:</dt>
                                    <dd className="w-2/3">{formatDate(filing.updatedAt ? filing.updatedAt.toISOString() : "")}</dd>
                                </div>
                            </dl>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Financial Details</h3>
                            <dl className="space-y-2">
                                <div className="flex">
                                    <dt className="font-medium w-1/3">Gross Income:</dt>
                                    <dd className="w-2/3">{formatCurrency(filing.grossIncome)}</dd>
                                </div>
                                <div className="flex">
                                    <dt className="font-medium w-1/3">Tax Paid:</dt>
                                    <dd className="w-2/3">{formatCurrency(filing.taxPaid)}</dd>
                                </div>
                                <div className="flex">
                                    <dt className="font-medium w-1/3">Refund:</dt>
                                    <dd className="w-2/3">
                                        {filing.grossIncome > filing.taxPaid ? (
                                            <span className="text-green-600">
                                                {formatCurrency(filing.grossIncome - filing.taxPaid)}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                    {filing.documents && filing.documents.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Attached Documents</h3>
                            <ul className="space-y-2">
                                {filing.documents.map((doc: { id?: string; fileUrl?: string; name?: string } | string, idx: number) => (
                                    <li key={typeof doc === "string" ? doc : doc.id ?? idx} className="flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-[#af0e0e]" />
                                        <a
                                            href={typeof doc === "string" ? doc : doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#af0e0e] hover:underline"
                                        >
                                            {typeof doc === "string" ? "Document" : doc.name || "Document"}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {filing.notes && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                            <p className="text-sm text-muted-foreground">{filing.notes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}