
"use client"

import { useState, useEffect, useRef, JSX } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ChevronDown, ChevronUp, Search, Copy, FileText, Download, Save, X } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import Unauthorized from "@/components/Unauthorized"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface ITaxFiling {
    _id: string
    taxYear: string
    filingType: string
    status: string
    personalInfo: any
    incomes: any[]
    taxCredits?: any
    taxDeducted?: any
    wealthStatement?: any
    ntn?: any
    payment?: any
    documents: any[]
    assignedTo?: string
    history?: Array<{ status: string; remarks?: string }>
}

interface UpdateFilingStatusDto {
    status: "pending" | "under_review" | "completed" | "rejected"
    remarks?: string
    assignedTo?: string
}

interface ExtendedUpdateFilingStatusDto extends UpdateFilingStatusDto {
    fullName?: string
}

export default function TaxFilingDetails() {
    const router = useRouter()
    const { toast } = useToast()
    const params = useParams()
    const id = params?.id as string
    const [filing, setFiling] = useState<ITaxFiling | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        personalInfo: true,
        incomes: true,
        taxCredits: false,
        taxDeducted: false,
        wealthStatement: false,
        ntn: false,
        payment: false,
        documents: false,
        statusUpdate: false,
    })
    const [statusUpdate, setStatusUpdate] = useState<ExtendedUpdateFilingStatusDto>({
        status: "under_review",
        remarks: "",
        assignedTo: "",
        fullName: "",
    })
    const [userSuggestions, setUserSuggestions] = useState<{ _id: string; fullName: string }[]>([])
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
    const pageRef = useRef<HTMLDivElement>(null)

    const user = getCurrentUser()
    if (user?.role !== "accountant") {
        return <Unauthorized />
    }

    useEffect(() => {
        const fetchFilingAndUser = async () => {
            try {
                const response = await fetch(`https://backend-production-5fad.up.railway.app/api/admin/documents/tax-filings/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                if (!response.ok) throw new Error("Failed to fetch tax filing")
                const data = await response.json()

                setFiling({
                    _id: data._id,
                    taxYear: data.year || data.taxYear,
                    filingType: data.filingType,
                    status: data.status,
                    personalInfo: data.personalInfo || {
                        fullName: data.user?.fullName || "N/A",
                        cnic: data.user?.cnic || "N/A",
                        email: data.user?.email || "N/A",
                        dateOfBirth: data.personalInfo?.dateOfBirth,
                        nationality: data.personalInfo?.nationality,
                        residentialStatus: data.personalInfo?.residentialStatus,
                    },
                    incomes: data.incomes || [],
                    documents: data.documents || data.documentSummary?.documents || [],
                    payment: data.payment || {},
                    taxCredits: data.taxCredits,
                    taxDeducted: data.taxDeducted,
                    wealthStatement: data.wealthStatement,
                    ntn: data.ntn,
                    assignedTo: data.assignedTo,
                    history: data.history,
                })

                let fullName = ""
                if (data.assignedTo) {
                    try {
                        const userResponse = await fetch(`http://localhost:5000/api/admin/users/${data.assignedTo}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        })
                        if (userResponse.ok) {
                            const userData = await userResponse.json()
                            fullName = userData.fullName
                        }
                    } catch (e) {
                        console.error("Failed to fetch user:", e)
                    }
                }

                setStatusUpdate({
                    status: data.status || "under_review",
                    remarks: data.history?.[data.history.length - 1]?.remarks || "",
                    assignedTo: data.assignedTo || "",
                    fullName,
                })
            } catch (e) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch tax filing details. Please try again.",
                })
                router.push("/accountant/tax-filing")
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchFilingAndUser()
    }, [id, router, toast, user.token])

    useEffect(() => {
        const fetchUserSuggestions = async () => {
            if (statusUpdate.fullName && statusUpdate.fullName.length > 2) {
                try {
                    const response = await fetch(
                        `http://localhost:5000/api/admin/users?search=${encodeURIComponent(statusUpdate.fullName)}`,
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        }
                    )
                    if (!response.ok) throw new Error("Failed to fetch users")
                    const users = await response.json()
                    setUserSuggestions(users || [])
                    setIsSuggestionsOpen(true)
                } catch (e) {
                    console.error("Failed to fetch user suggestions:", e)
                    setUserSuggestions([])
                }
            } else {
                setUserSuggestions([])
                setIsSuggestionsOpen(false)
            }
        }
        const timeout = setTimeout(fetchUserSuggestions, 300)
        return () => clearTimeout(timeout)
    }, [statusUpdate.fullName, user.token])

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied",
            description: "Text copied to clipboard.",
        })
    }

    const handleCopySection = (data: any) => {
        const jsonString = JSON.stringify(data, null, 2)
        navigator.clipboard.writeText(jsonString)
        toast({
            title: "Copied",
            description: "Section data copied as JSON.",
        })
    }

    const handleUpdateStatus = async () => {
        if (!filing) return
        try {
            const updatePayload: UpdateFilingStatusDto = {
                status: statusUpdate.status,
                remarks: statusUpdate.remarks,
                assignedTo: statusUpdate.assignedTo,
            }
            const response = await fetch(`http://localhost:5000/api/admin/documents/tax-filings/${filing._id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(updatePayload),
            })
            if (!response.ok) throw new Error("Failed to update status")
            const updatedFiling = await response.json()
            setFiling((prev) => prev ? { ...prev, ...updatedFiling } : prev)
            toast({
                title: "Success",
                description: "Tax filing status updated successfully.",
            })
            setOpenSections((prev) => ({ ...prev, statusUpdate: false }))
        } catch (e) {
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

            pdf.save(`tax-filing-${id}.pdf`)
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate PDF. Please try again.",
            })
        }
    }

    const resetStatusUpdate = () => {
        setStatusUpdate({
            status: (filing?.status as "under_review" | "completed" | "rejected" | "pending") || "under_review",
            remarks: filing?.history?.[filing.history.length - 1]?.remarks || "",
            assignedTo: filing?.assignedTo || "",
            fullName: filing?.assignedTo ? statusUpdate.fullName : "",
        })
        setUserSuggestions([])
        setIsSuggestionsOpen(false)
    }

    const selectUser = (user: { _id: string; fullName: string }) => {
        setStatusUpdate((prev) => ({
            ...prev,
            assignedTo: user._id,
            fullName: user.fullName,
        }))
        setIsSuggestionsOpen(false)
    }

    const isUrl = (str: string) => {
        try {
            new URL(str)
            return true
        } catch {
            return false
        }
    }

    const formatCurrency = (value: string | number) => {
        if (!value) return "N/A"
        const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^\d]/g, ""))
        return isNaN(numericValue) ? "N/A" : `PKR ${numericValue.toLocaleString()}`
    }

    const renderNestedObject = (obj: any, depth: number = 0, sectionKey?: string): JSX.Element => {
        if (!obj || typeof obj !== "object") {
            return <span className="text-sm text-gray-700">{obj?.toString() || "N/A"}</span>
        }

        if (sectionKey === "incomes" && obj.businessEntries && Array.isArray(obj.businessEntries)) {
            return (
                <div className="space-y-4">
                    <div className="font-medium text-sm text-gray-900">Business Entries</div>
                    {obj.businessEntries.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {obj.businessEntries.map((entry: any, index: number) => (
                                <div
                                    key={entry.id || index}
                                    className="border rounded-lg p-3 bg-white shadow-sm"
                                >
                                    <div className="space-y-2">
                                        <div className="font-medium text-sm">{entry.businessName || "Unnamed Business"}</div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {entry.businessType || "N/A"}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-muted-foreground">Annual Income:</span>
                                                <div className="font-medium">{formatCurrency(entry.businessIncome)}</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Expenses:</span>
                                                <div className="font-medium">{formatCurrency(entry.businessExpenses)}</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Net Income:</span>
                                                <div className="font-medium text-green-600">
                                                    {formatCurrency(Number(entry.businessIncome) - Number(entry.businessExpenses))}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(JSON.stringify(entry, null, 2))}
                                            className="text-[#af0e0e]"
                                        >
                                            <Copy className="h-4 w-4 mr-1" />
                                            Copy Entry
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No business entries provided</p>
                    )}
                    {obj.otherIncomeInflows && Array.isArray(obj.otherIncomeInflows) && (
                        <>
                            <div className="font-medium text-sm text-gray-900 mt-4">Other Income Inflows</div>
                            {obj.otherIncomeInflows.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    {obj.otherIncomeInflows.map((inflow: any, index: number) => (
                                        <div
                                            key={inflow.id || index}
                                            className="border rounded-lg p-3 bg-white shadow-sm"
                                        >
                                            <div className="space-y-2">
                                                <div className="font-medium text-sm capitalize">{inflow.type || "N/A"}</div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-muted-foreground">Amount:</span>
                                                        <div className="font-medium">{formatCurrency(inflow.amount)}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Description:</span>
                                                        <div className="font-medium">{inflow.description || "N/A"}</div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCopy(JSON.stringify(inflow, null, 2))}
                                                    className="text-[#af0e0e]"
                                                >
                                                    <Copy className="h-4 w-4 mr-1" />
                                                    Copy Inflow
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No other income inflows provided</p>
                            )}
                        </>
                    )}
                </div>
            )
        }

        return (
            <div className={`space-y-2 ${depth > 0 ? "ml-6" : ""}`}>
                {Object.entries(obj).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-[150px_1fr] gap-4 items-start">
                        <span className="font-medium text-sm text-gray-900 capitalize truncate">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        {Array.isArray(value) && key !== "businessEntries" && key !== "otherIncomeInflows" ? (
                            <div className="space-y-2">
                                {value.map((item, index) => (
                                    <div key={index} className="text-sm">
                                        <strong className="text-gray-700">Item {index + 1}:</strong>
                                        {renderNestedObject(item, depth + 1, sectionKey)}
                                    </div>
                                ))}
                            </div>
                        ) : typeof value === "object" && value !== null ? (
                            renderNestedObject(value, depth + 1, sectionKey)
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">{typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : "N/A"}</span>
                                {(typeof value === "string" || typeof value === "number" || typeof value === "boolean") && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCopy(String(value))}
                                                    aria-label={`Copy ${key}`}
                                                >
                                                    <Copy className="h-4 w-4 text-[#af0e0e]" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Copy to clipboard</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {depth === 0 && sectionKey && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopySection(obj)}
                        className="mt-2 text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                    >
                        Copy Section as JSON
                    </Button>
                )}
            </div>
        )
    }

    const filteredFiling = () => {
        if (!searchQuery || !filing) return filing
        const query = searchQuery.toLowerCase()
        const searchableFields = JSON.stringify(filing).toLowerCase()
        return searchableFields.includes(query) ? filing : null
    }

    const displayedFiling = filteredFiling()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!displayedFiling) {
        return (
            <div className="text-center py-8 text-red-500">
                {searchQuery ? "No data matches your search" : "Tax filing not found"}
            </div>
        )
    }

    return (
        <div ref={pageRef} className="container px-4 mx-auto py-8 mt-16">
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tax Filing Details</h1>
                <p className="text-gray-500 text-sm mt-1">
                    View all details for tax filing ID: {id}
                </p>
            </div>

            <Card className="w-full border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#af0e0e] to-[#8a0b0b] text-white">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">Filing Overview</CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="w-64">
                                <Label htmlFor="search" className="text-sm font-medium text-white">
                                    Search Data
                                </Label>
                                <div className="relative mt-1">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="search"
                                        placeholder="Search fields..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-8 bg-white/90 border-gray-300 focus:ring-2 focus:ring-[#af0e0e] transition-all duration-300"
                                        aria-label="Search tax filing data"
                                    />
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownloadPDF}
                                className="text-white border-white hover:bg-white hover:text-[#af0e0e]"
                                aria-label="Download PDF"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6 bg-white">
                    {/* Personal Info */}
                    <Collapsible
                        open={openSections.personalInfo}
                        onOpenChange={() => toggleSection("personalInfo")}
                    >
                        <CollapsibleTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]">
                                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                                    {openSections.personalInfo ? (
                                        <ChevronUp className="h-5 w-5 text-[#af0e0e]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#af0e0e]" />
                                    )}
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 fade-in">
                            {filing?.personalInfo ? (
                                renderNestedObject(filing.personalInfo, 0, "personalInfo")
                            ) : (
                                <p className="text-sm text-gray-500">No personal information provided</p>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Incomes */}
                    <Collapsible
                        open={openSections.incomes}
                        onOpenChange={() => toggleSection("incomes")}
                    >
                        <CollapsibleTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]">
                                <h2 className="text-lg font-semibold text-gray-900">Incomes</h2>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                                    {openSections.incomes ? (
                                        <ChevronUp className="h-5 w-5 text-[#af0e0e]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#af0e0e]" />
                                    )}
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 fade-in">
                            {filing?.incomes && filing.incomes.length > 0 ? (
                                <Tabs defaultValue={filing.incomes[0]?.type || "salary"}>
                                    <TabsList className="flex flex-wrap gap-2 bg-transparent border-b border-gray-200">
                                        {filing.incomes.map((income) => (
                                            <TabsTrigger
                                                key={income.type}
                                                value={income.type}
                                                className="capitalize text-gray-700 data-[state=active]:text-[#af0e0e] data-[state=active]:border-b-2 data-[state=active]:border-[#af0e0e] data-[state=active]:bg-transparent hover:text-[#af0e0e] transition-all duration-200"
                                            >
                                                {income.type}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {filing.incomes.map((income) => (
                                        <TabsContent key={income.type} value={income.type} className="mt-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-900">Income Type</Label>
                                                    <p className="text-sm text-gray-700 capitalize">{income.type}</p>
                                                </div>
                                                {income.type === "business" ? (
                                                    renderNestedObject({ businessEntries: (income as any).businessEntries, otherIncomeInflows: (income as any).otherIncomeInflows }, 0, "incomes")
                                                ) : (
                                                    renderNestedObject(income.details, 0, "incomes")
                                                )}
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            ) : (
                                <p className="text-sm text-gray-500">No income data provided</p>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Tax Credits */}
                    <Collapsible
                        open={openSections.taxCredits}
                        onOpenChange={() => toggleSection("taxCredits")}
                    >
                        <CollapsibleTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]">
                                <h2 className="text-lg font-semibold text-gray-900">Tax Credits</h2>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                                    {openSections.taxCredits ? (
                                        <ChevronUp className="h-5 w-5 text-[#af0e0e]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#af0e0e]" />
                                    )}
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 fade-in">
                            {filing?.taxCredits ? (
                                renderNestedObject(filing.taxCredits, 0, "taxCredits")
                            ) : (
                                <p className="text-sm text-gray-500">No tax credits provided</p>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Tax Deducted */}
                    <Collapsible
                        open={openSections.taxDeducted}
                        onOpenChange={() => toggleSection("taxDeducted")}
                    >
                        <CollapsibleTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]">
                                <h2 className="text-lg font-semibold text-gray-900">Tax Deducted</h2>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                                    {openSections.taxDeducted ? (
                                        <ChevronUp className="h-5 w-5 text-[#af0e0e]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#af0e0e]" />
                                    )}
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 fade-in">
                            {filing?.taxDeducted ? (
                                renderNestedObject(filing.taxDeducted, 0, "taxDeducted")
                            ) : (
                                <p className="text-sm text-gray-500">No tax deducted data provided</p>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Wealth Statement */}
                    <Collapsible
                        open={openSections.wealthStatement}
                        onOpenChange={() => toggleSection("wealthStatement")}
                    >
                        <CollapsibleTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]">
                                <h2 className="text-lg font-semibold text-gray-900">Wealth Statement</h2>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                                    {openSections.wealthStatement ? (
                                        <ChevronUp className="h-5 w-5 text-[#af0e0e]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#af0e0e]" />
                                    )}
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 fade-in">
                            {filing?.wealthStatement ? (
                                renderNestedObject(filing.wealthStatement, 0, "wealthStatement")
                            ) : (
                                <p className="text-sm text-gray-500">No wealth statement provided</p>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* NTN */}
                    <Collapsible
                        open={openSections.ntn}
                        onOpenChange={() => toggleSection("ntn")}
                    >
                        <CollapsibleTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]">
                                <h2 className="text-lg font-semibold text-gray-900">NTN</h2>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                                    {openSections.ntn ? (
                                        <ChevronUp className="h-5 w-5 text-[#af0e0e]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#af0e0e]" />
                                    )}
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 fade-in">
                            {filing?.ntn ? (
                                renderNestedObject(filing.ntn, 0, "ntn")
                            ) : (
                                <p className="text-sm text-gray-500">No NTN data provided</p>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Payment */}
                    <Collapsible
                        open={openSections.payment}
                        onOpenChange={() => toggleSection("payment")}
                    >
                        <CollapsibleTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]">
                                <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                                    {openSections.payment ? (
                                        <ChevronUp className="h-5 w-5 text-[#af0e0e]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#af0e0e]" />
                                    )}
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 fade-in">
                            {filing?.payment ? (
                                <div>
                                    {renderNestedObject(filing.payment, 0, "payment")}
                                    {filing.payment?.paymentProof && (
                                        <div className="mt-4">
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(filing.payment?.paymentProof, '_blank')}
                                                    className="text-[#af0e0e]"
                                                >
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    View Payment Proof
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const link = document.createElement('a')
                                                        link.href = filing.payment?.paymentProof || ''
                                                        link.download = `payment_proof_${id}.jpg`
                                                        link.click()
                                                    }}
                                                    className="text-[#af0e0e]"
                                                >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Download Proof
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No payment data provided</p>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Documents */}
                    <Collapsible
                        open={openSections.documents}
                        onOpenChange={() => toggleSection("documents")}
                    >
                        <CollapsibleTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]">
                                <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                                    {openSections.documents ? (
                                        <ChevronUp className="h-5 w-5 text-[#af0e0e]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#af0e0e]" />
                                    )}
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 fade-in">
                            {filing?.documents && filing.documents.length > 0 ? (
                                <ul className="space-y-3">
                                    {filing.documents.map((doc, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-[#af0e0e]" />
                                            {isUrl(doc.filePath || doc) ? (
                                                <a
                                                    href={doc.filePath || doc}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-[#af0e0e] hover:underline"
                                                >
                                                    {doc.fileName || doc.filePath?.split("/").pop() || doc}
                                                </a>
                                            ) : (
                                                <span className="text-sm text-gray-700">{doc.fileName || doc}</span>
                                            )}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleCopy(doc.filePath || doc)}
                                                            aria-label={`Copy document ${doc.fileName || doc}`}
                                                        >
                                                            <Copy className="h-4 w-4 text-[#af0e0e]" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Copy to clipboard</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {isUrl(doc.filePath || doc) && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => window.open(doc.filePath || doc, "_blank")}
                                                                aria-label={`Download document ${doc.fileName || doc}`}
                                                            >
                                                                <Download className="h-4 w-4 text-[#af0e0e]" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Download document</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No documents provided</p>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Status Update */}
                    <Collapsible
                        open={openSections.statusUpdate}
                        onOpenChange={() => toggleSection("statusUpdate")}
                    >
                        <CollapsibleTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]">
                                <h2 className="text-lg font-semibold text-gray-900">Update Status</h2>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                                    {openSections.statusUpdate ? (
                                        <ChevronUp className="h-5 w-5 text-[#af0e0e]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#af0e0e]" />
                                    )}
                                </Button>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 fade-in">
                            <div className="space-y-4">
                                <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
                                    <Label htmlFor="status" className="text-sm font-medium text-gray-900">
                                        Status
                                    </Label>
                                    <Select
                                        value={statusUpdate.status}
                                        onValueChange={(value) =>
                                            setStatusUpdate((prev) => ({
                                                ...prev,
                                                status: value as "under_review" | "completed" | "rejected" | "pending",
                                            }))
                                        }
                                    >
                                        <SelectTrigger id="status" className="bg-white/90 border-gray-300">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="under_review">Under Review</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
                                    <Label htmlFor="remarks" className="text-sm font-medium text-gray-900">
                                        Remarks
                                    </Label>
                                    <Input
                                        id="remarks"
                                        value={statusUpdate.remarks || ""}
                                        onChange={(e) =>
                                            setStatusUpdate((prev) => ({ ...prev, remarks: e.target.value }))
                                        }
                                        placeholder="Enter remarks"
                                        className="bg-white/90 border-gray-300"
                                    />
                                </div>
                                <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
                                    <Label htmlFor="assignedTo" className="text-sm font-medium text-gray-900">
                                        Assigned To
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="assignedTo"
                                            value={statusUpdate.fullName || ""}
                                            onChange={(e) =>
                                                setStatusUpdate((prev) => ({
                                                    ...prev,
                                                    fullName: e.target.value,
                                                    assignedTo: "",
                                                }))
                                            }
                                            placeholder="Enter assignee name"
                                            className="bg-white/90 border-gray-300"
                                            onFocus={() => setIsSuggestionsOpen(true)}
                                        />
                                        {isSuggestionsOpen && userSuggestions.length > 0 && (
                                            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                                                {userSuggestions.map((user) => (
                                                    <li
                                                        key={user._id}
                                                        className="px-3 py-2 text-sm text-gray-700 hover:bg-[#af0e0e] hover:text-white cursor-pointer"
                                                        onClick={() => selectUser(user)}
                                                    >
                                                        {user.fullName}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={resetStatusUpdate}
                                                    className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Cancel
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Reset form</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    onClick={handleUpdateStatus}
                                                    className="bg-[#af0e0e] hover:bg-[#8a0b0b] text-white"
                                                >
                                                    <Save className="h-4 w-4 mr-1" />
                                                    Update Status
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Save status changes</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Back Button */}
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/accountant/tax-filing")}
                            className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white transition-all duration-200 hover:scale-105"
                        >
                            Back to Filings
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
