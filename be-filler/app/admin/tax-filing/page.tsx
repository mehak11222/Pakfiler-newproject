"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import Unauthorized from "@/components/Unauthorized"
import Cookies from "js-cookie"

interface ITaxFiling {
    id: string
    userId: string
    createdAt: string
    status: string
    personalInfo: {
        fullName: string
        cnic: string
        email?: string
        occupation?: string
    }
    payment: {
        status: string
        amount: number
    }
    family: {
        spouse: boolean
        children: number
    }
    remarks: string
    processingSteps: any[]
}

interface IFilingSteps {
    taxFiling: {
        id: string
        user: {
            id: string
        }
        createdAt: string
    }
    progress: {
        completedSteps: number
        totalSteps: number
        progressPercentage: number
        isComplete: boolean
        canSubmit: boolean
    }
    steps: Array<{
        stepKey: string
        stepName: string
        description: string
        order: number
        isCompleted: boolean
        completedAt: string | null
        recordCount: number
        summary: Record<string, any>
        data: any
    }>
    completionSummary: {
        taxYearComplete: boolean
        personalInfoComplete: boolean
        incomeDataComplete: boolean
        assetDataComplete: boolean
        liabilitiesComplete: boolean
        wrapUpComplete: boolean
    }
}

export default function TaxFilingManagement() {
    const router = useRouter()
    const { toast } = useToast()
    const [taxFilings, setTaxFilings] = useState<ITaxFiling[]>([])
    const [filteredFilings, setFilteredFilings] = useState<ITaxFiling[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filters, setFilters] = useState({
        status: "",
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [stepsData, setStepsData] = useState<IFilingSteps | null>(null)
    const [stepsLoading, setStepsLoading] = useState(false)
    const [selectedFiling, setSelectedFiling] = useState<string | null>(null)
    const itemsPerPage = 10
    const user = getCurrentUser()

    if (user?.role !== "admin") {
        return <Unauthorized />
    }

    useEffect(() => {
        const fetchTaxFilings = async () => {
            try {
                const token = Cookies.get('token')
                if (!token) {
                    throw new Error("No authentication token found")
                }

                // Build query parameters
                const params = new URLSearchParams()
                params.append('page', currentPage.toString())
                params.append('limit', itemsPerPage.toString())
                
                if (searchQuery) {
                    params.append('search', searchQuery)
                }
                
                if (filters.status && filters.status !== "all") {
                    params.append('status', filters.status)
                }

                const response = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/tax-filings?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch tax filings: ${response.statusText}`)
                }

                const data = await response.json()
                
                if (!data.success || !data.data?.taxFilings) {
                    throw new Error(data.message || "Invalid API response")
                }

                // Map API response to our interface
                const filings = data.data.taxFilings.map((filing: any) => ({
                    id: filing.id,
                    userId: filing.userId,
                    createdAt: filing.createdAt,
                    status: filing.payment?.status || 'pending',
                    personalInfo: {
                        fullName: filing.personalInfo?.fullName || 'N/A',
                        cnic: filing.personalInfo?.cnic || 'N/A',
                        email: filing.personalInfo?.email || 'N/A',
                        occupation: filing.personalInfo?.occupation || 'N/A'
                    },
                    payment: {
                        status: filing.payment?.status || 'pending',
                        amount: filing.payment?.amount || 0
                    },
                    family: {
                        spouse: filing.family?.spouse || false,
                        children: filing.family?.children || 0
                    },
                    remarks: filing.remarks || '',
                    processingSteps: filing.processingSteps || []
                }))

                setTaxFilings(filings)
                setFilteredFilings(filings)
                setTotalPages(data.data.pagination?.totalPages || 1)
                setTotalCount(data.data.pagination?.totalCount || 0)
            } catch (e) {
                console.error("Error fetching tax filings:", e)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: e instanceof Error ? e.message : "Failed to fetch tax filings. Please try again.",
                })
            } finally {
                setLoading(false)
            }
        }
        fetchTaxFilings()
    }, [toast, currentPage, searchQuery, filters.status])

    const fetchFilingSteps = async (userId: string) => {
        try {
            setStepsLoading(true)
            const token = Cookies.get('token')
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`http://localhost:5000/api/filing-steps/admin/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch filing steps: ${response.statusText}`)
            }

            const data = await response.json()
            
            if (!data.success || !data.data) {
                throw new Error(data.message || "Invalid API response")
            }

            setStepsData(data.data)
            setSelectedFiling(userId)
        } catch (e) {
            console.error("Error fetching filing steps:", e)
            toast({
                variant: "destructive",
                title: "Error",
                description: e instanceof Error ? e.message : "Failed to fetch filing steps. Please try again.",
            })
        } finally {
            setStepsLoading(false)
        }
    }

    const updateFilingStatus = async (userId: string, status: string) => {
        try {
            const token = Cookies.get('token')
            if (!token) {
                throw new Error("No authentication token found")
            }

            const response = await fetch(`http://localhost:5000/api/filing-steps/admin/user/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            })

            if (!response.ok) {
                throw new Error(`Failed to update filing status: ${response.statusText}`)
            }

            const data = await response.json()
            
            if (!data.success) {
                throw new Error(data.message || "Failed to update status")
            }

            // Update local state
            setTaxFilings(prev =>
                prev.map(filing =>
                    filing.userId === userId 
                        ? { 
                            ...filing, 
                            payment: { ...filing.payment, status },
                            status
                        } 
                        : filing
                )
            )

            setFilteredFilings(prev =>
                prev.map(filing =>
                    filing.userId === userId 
                        ? { 
                            ...filing, 
                            payment: { ...filing.payment, status },
                            status
                        } 
                        : filing
                )
            )

            toast({
                title: "Success",
                description: "Tax filing status updated successfully",
            })
        } catch (e) {
            console.error("Error updating tax filing status:", e)
            toast({
                variant: "destructive",
                title: "Error",
                description: e instanceof Error ? e.message : "Failed to update tax filing status. Please try again.",
            })
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setCurrentPage(1) // Reset to first page when searching
    }

    const handleFilterChange = (value: string) => {
        setFilters(prev => ({ ...prev, status: value }))
        setCurrentPage(1) // Reset to first page when filtering
    }

    const handleViewFiling = (filingId: string) => {
        router.push(`/admin/tax-filing/${filingId}`)
    }

    const handleViewSteps = (userId: string) => {
        fetchFilingSteps(userId)
    }

    const handleStatusChange = async (filingId: string, newStatus: string) => {
        await updateFilingStatus(filingId, newStatus)
    }

    const paginatedFilings = filteredFilings

    return (
        <div className="container px-4 mx-auto py-8 mt-16">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Tax Filing Management</h1>
                <p className="text-muted-foreground text-sm mt-1">View and manage tax filings</p>
            </div>

            <Card className="w-full border shadow-sm">
                <CardHeader className="bg-gray-50">
                    <CardTitle className="text-xl">Tax Filings</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Label htmlFor="search" className="text-sm font-medium">
                                Search by Name or CNIC
                            </Label>
                            <div className="relative mt-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Enter name or CNIC"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="pl-8"
                                    aria-label="Search tax filings"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <Label htmlFor="status" className="text-sm font-medium">
                                    Status
                                </Label>
                                <Select
                                    value={filters.status}
                                    onValueChange={handleFilterChange}
                                >
                                    <SelectTrigger id="status" className="w-[150px] mt-1">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                            <th className="p-3 font-medium">CNIC</th>
                                            <th className="p-3 font-medium">Occupation</th>
                                            <th className="p-3 font-medium">Family</th>
                                            <th className="p-3 font-medium">Payment Status</th>
                                            <th className="p-3 font-medium">Amount</th>
                                            <th className="p-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedFilings.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-3 text-center text-muted-foreground">
                                                    No tax filings found
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedFilings.map((filing) => (
                                                <tr key={filing.id} className="border-b">
                                                    <td className="p-3">
                                                        {filing.personalInfo.fullName}
                                                    </td>
                                                    <td className="p-3">{filing.personalInfo.cnic}</td>
                                                    <td className="p-3">{filing.personalInfo.occupation}</td>
                                                    <td className="p-3">
                                                        {filing.family.spouse ? "Married" : "Single"}, 
                                                        {filing.family.children > 0 ? ` ${filing.family.children} children` : ' no children'}
                                                    </td>
                                                    <td className="p-3">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${
                                                                filing.payment.status === "completed"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : filing.payment.status === "rejected"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : filing.payment.status === "under_review"
                                                                            ? "bg-yellow-100 text-yellow-800"
                                                                            : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {filing.payment.status.replace("_", " ").toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">${filing.payment.amount.toFixed(2)}</td>
                                                    <td className="p-3 flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewFiling(filing.id)}
                                                            className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewSteps(filing.userId)}
                                                            className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                                                        >
                                                            View Steps
                                                        </Button>
                                                        <Select
                                                            value={filing.payment.status}
                                                            onValueChange={(value) => handleStatusChange(filing.userId, value)}
                                                        >
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Change Status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="under_review">Under Review</SelectItem>
                                                                <SelectItem value="completed">Completed</SelectItem>
                                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                            </SelectContent>
                                                        </Select>
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
                                        {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                                        {totalCount} filings
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

            {/* Steps Modal */}
            {selectedFiling && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <CardHeader className="bg-gray-50 sticky top-0 z-10">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl">
                                    Filing Steps for {taxFilings.find(f => f.userId === selectedFiling)?.personalInfo.fullName}
                                </CardTitle>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setSelectedFiling(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Close
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {stepsLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : stepsData ? (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-blue-800">Progress Summary</h3>
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-blue-700">
                                                    {stepsData.progress.completedSteps} of {stepsData.progress.totalSteps} steps completed
                                                </span>
                                                <span className="text-sm font-medium text-blue-800">
                                                    {stepsData.progress.progressPercentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-blue-200 rounded-full h-2.5 mt-1">
                                                <div 
                                                    className="bg-blue-600 h-2.5 rounded-full" 
                                                    style={{ width: `${stepsData.progress.progressPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                            <div className={`p-2 rounded ${stepsData.completionSummary.taxYearComplete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                Tax Year: {stepsData.completionSummary.taxYearComplete ? 'Complete' : 'Incomplete'}
                                            </div>
                                            <div className={`p-2 rounded ${stepsData.completionSummary.personalInfoComplete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                Personal Info: {stepsData.completionSummary.personalInfoComplete ? 'Complete' : 'Incomplete'}
                                            </div>
                                            <div className={`p-2 rounded ${stepsData.completionSummary.incomeDataComplete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                Income Data: {stepsData.completionSummary.incomeDataComplete ? 'Complete' : 'Incomplete'}
                                            </div>
                                            <div className={`p-2 rounded ${stepsData.completionSummary.assetDataComplete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                Asset Data: {stepsData.completionSummary.assetDataComplete ? 'Complete' : 'Incomplete'}
                                            </div>
                                            <div className={`p-2 rounded ${stepsData.completionSummary.liabilitiesComplete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                Liabilities: {stepsData.completionSummary.liabilitiesComplete ? 'Complete' : 'Incomplete'}
                                            </div>
                                            <div className={`p-2 rounded ${stepsData.completionSummary.wrapUpComplete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                Wrap Up: {stepsData.completionSummary.wrapUpComplete ? 'Complete' : 'Incomplete'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-medium">Detailed Steps</h3>
                                        <div className="space-y-2">
                                            {stepsData.steps.map((step) => (
                                                <div key={step.stepKey} className={`border rounded-lg p-4 ${step.isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium">
                                                                {step.order}. {step.stepName}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                                            <div className="mt-2 text-xs text-gray-500">
                                                                Status: {step.isCompleted ? (
                                                                    <span className="text-green-600">
                                                                        Completed on {new Date(step.completedAt!).toLocaleString()}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-yellow-600">Pending</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            step.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {step.isCompleted ? 'COMPLETED' : 'PENDING'}
                                                        </span>
                                                    </div>
                                                    {step.recordCount > 0 && (
                                                        <div className="mt-3 text-xs text-gray-500">
                                                            Records: {step.recordCount}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    No steps data available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}