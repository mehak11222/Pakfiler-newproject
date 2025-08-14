"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
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

interface ITaxFiling {
    _id: string
    taxYear: string
    filingType: string
    status: string
    personalInfo: any
    assignedTo?: string
}

interface UpdateFilingStatusDto {
    status: "pending" | "under_review" | "completed" | "rejected"
}

export default function TaxFilingManagement() {
    const router = useRouter()
    const { toast } = useToast()
    const [taxFilings, setTaxFilings] = useState<ITaxFiling[]>([])
    const [filteredFilings, setFilteredFilings] = useState<ITaxFiling[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filters, setFilters] = useState({
        taxYear: "",
        filingType: "",
        status: "",
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [userCache, setUserCache] = useState<Record<string, string>>({})
    const itemsPerPage = 10
    const user = getCurrentUser()

    useEffect(() => {
        if (user?.role !== "accountant") return;
        const fetchTaxFilings = async () => {
            const token = Cookies.get('token')
            try {
                const response = await fetch("https://backend-production-5fad.up.railway.app/api/admin/documents/tax-filings", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                if (!response.ok) throw new Error("Failed to fetch tax filings")
                const filings = await response.json()
                const adaptedFilings = filings.map((filing: any) => ({
                    _id: filing._id,
                    taxYear: filing.year || filing.taxYear,
                    filingType: filing.filingType,
                    status: filing.status,
                    personalInfo: filing.personalInfo || {
                        fullName: filing.user?.fullName || "N/A",
                        cnic: filing.user?.cnic || "N/A",
                        email: filing.user?.email || "N/A",
                    },
                    assignedTo: filing.assignedTo,
                }))
                setTaxFilings(adaptedFilings)
                setFilteredFilings(adaptedFilings)

                // Fetch user names for unique assignedTo IDs
                const uniqueUserIds: string[] = Array.from(
                    new Set(filings.map((filing: any) => filing.assignedTo).filter((id: string) => !!id))
                ) as string[]
                const userPromises = uniqueUserIds.map(async (userId: string) => {
                    try {
                        const userResponse: Response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                            headers: {
                               'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                            },
                        })
                        if (!userResponse.ok) throw new Error(`Failed to fetch user ${userId}`)
                        const user = await userResponse.json()
                        return { userId, fullName: user?.fullName || "N/A" }
                    } catch (error) {
                        console.error(`Error fetching user ${userId}:`, error)
                        return { userId, fullName: "N/A" }
                    }
                })
                const userResults = await Promise.all(userPromises)
                const newUserCache = Object.fromEntries(
                    userResults.map(({ userId, fullName }) => [userId, fullName])
                )
                setUserCache(newUserCache)
            } catch (e) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch tax filings. Please try again.",
                })
            } finally {
                setLoading(false)
            }
        }
        fetchTaxFilings()
    }, [toast, user.token])

    useEffect(() => {
        let result = taxFilings

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (filing) =>
                    filing.personalInfo?.fullName.toLowerCase().includes(query) ||
                    filing.personalInfo?.cnic.toLowerCase().includes(query)
            )
        }

        // Apply filters
        if (filters.taxYear && filters.taxYear !== "all") {
            result = result.filter((filing) => filing.taxYear.toString() === filters.taxYear)
        }
        if (filters.filingType && filters.filingType !== "all") {
            result = result.filter((filing) => filing.filingType === filters.filingType)
        }
        if (filters.status && filters.status !== "all") {
            result = result.filter((filing) => filing.status === filters.status)
        }

        setFilteredFilings(result)
        setCurrentPage(1)
    }, [searchQuery, filters, taxFilings])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const handleViewFiling = (filingId: string) => {
        router.push(`/accountant/tax-filing/${filingId}`)
    }

    const handleStatusChange = async (filingId: string, newStatus: UpdateFilingStatusDto["status"]) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/documents/tax-filings/${filingId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            })
            if (!response.ok) throw new Error("Failed to update status")
            const updatedFiling = await response.json()

            setTaxFilings((prev) =>
                prev.map((filing) =>
                    filing._id === filingId ? { ...filing, status: updatedFiling.status } : filing
                )
            )

            toast({
                title: "Success",
                description: "Tax filing status updated successfully",
            })
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update tax filing status. Please try again.",
            })
        }
    }

    const totalPages = Math.ceil(filteredFilings.length / itemsPerPage)
    const paginatedFilings = filteredFilings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const taxYears = Array.from(new Set(taxFilings.map((filing) => filing.taxYear))).sort(
        (a, b) => parseInt(b) - parseInt(a)
    )

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
                                <Label htmlFor="taxYear" className="text-sm font-medium">
                                    Tax Year
                                </Label>
                                <Select
                                    value={filters.taxYear}
                                    onValueChange={(value) => handleFilterChange("taxYear", value)}
                                >
                                    <SelectTrigger id="taxYear" className="w-[120px] mt-1">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {taxYears.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="filingType" className="text-sm font-medium">
                                    Filing Type
                                </Label>
                                <Select
                                    value={filters.filingType}
                                    onValueChange={(value) => handleFilterChange("filingType", value)}
                                >
                                    <SelectTrigger id="filingType" className="w-[120px] mt-1">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="individual">Individual</SelectItem>
                                        <SelectItem value="business">Business</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="status" className="text-sm font-medium">
                                    Status
                                </Label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) => handleFilterChange("status", value)}
                                >
                                    <SelectTrigger id="status" className="w-[120px] mt-1">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
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
                                            <th className="p-3 font-medium">Tax Year</th>
                                            <th className="p-3 font-medium">Filing Type</th>
                                            <th className="p-3 font-medium">Assigned to</th>
                                            <th className="p-3 font-medium">Status</th>
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
                                                <tr key={filing._id} className="border-b">
                                                    <td className="p-3">{filing.personalInfo?.fullName || "N/A"}</td>
                                                    <td className="p-3">{filing.personalInfo?.cnic || "N/A"}</td>
                                                    <td className="p-3">{filing.taxYear}</td>
                                                    <td className="p-3 capitalize">{filing.filingType}</td>
                                                    <td className="p-3">{filing.assignedTo ? userCache[filing.assignedTo] || "N/A" : "N/A"}</td>
                                                    <td className="p-3">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${filing.status === "completed"
                                                                ? "bg-green-100 text-green-800"
                                                                : filing.status === "rejected"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : filing.status === "under_review"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                                }`}
                                                        >
                                                            {filing.status.replace("_", " ").toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewFiling(filing._id)}
                                                            className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                                                            aria-label={`View filing for ${filing.personalInfo?.fullName || "N/A"}`}
                                                        >
                                                            View
                                                        </Button>
                                                        <Select
                                                            value={filing.status}
                                                            onValueChange={(value) =>
                                                                handleStatusChange(filing._id, value as UpdateFilingStatusDto["status"])
                                                            }
                                                        >
                                                            <SelectTrigger className="w-1/3">
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
                                        {Math.min(currentPage * itemsPerPage, filteredFilings.length)} of{" "}
                                        {filteredFilings.length} filings
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