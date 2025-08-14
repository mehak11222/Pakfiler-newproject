"use client"
import { useState, useEffect } from "react"
import {
  Plus,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Play,
  User,
  DollarSign,
  AlertCircle,
  Filter,
  Search,
  Building,
  Loader2,
  Shield,
  Users,
  Tag,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import NewTaxFilingModal from "@/components/personal-tax-filing/new-tax-filing-modal"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import Link from "next/link"

interface ITaxFiling {
  _id: string
  taxYear: number
  filingType: "individual" | "business"
  status: string
  personalInfo?: {
    fullName?: string
  }
  createdAt?: string
  payment?: {
    amount?: number
  }
  remarks?: string
  progress?: {
    completedSteps: number
    totalSteps: number
    progressPercentage: number
    isComplete: boolean
    canSubmit: boolean
  }
  currentStep?: {
    stepKey: string
    stepName: string
    description: string
    isCompleted: boolean
    order: number
  }
  steps?: Array<{
    stepKey: string
    stepName: string
    description: string
    order: number
    isCompleted: boolean
    completedAt?: string
    recordCount: number
    summary: any
    data: any
  }>
}

interface IFamilyTag {
  _id: string
  accountEmail: string
  relation: string
  userType: string
  createdAt: string
}

const TaxFilingsPage = () => {
  const [isClient, setIsClient] = useState(false)
  const [filings, setFilings] = useState<ITaxFiling[]>([])
  const [familyTags, setFamilyTags] = useState<IFamilyTag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [tagLoading, setTagLoading] = useState(false)
  const [tagFormData, setTagFormData] = useState({
    accountEmail: "",
    relation: "",
    userType: "Family",
  })
  const { toast } = useToast()
  const router = useRouter()
  const user = isClient && Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null

  const relationOptions = [
    "Spouse",
    "Wife",
    "Husband",
    "Father",
    "Mother",
    "Son",
    "Daughter",
    "Brother",
    "Sister",
    "Uncle",
    "Aunt",
    "Cousin",
    "Grandfather",
    "Grandmother",
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    if (!user || user.role !== "user") {
      router.push("/unauthorized")
      return
    }

    const loadData = async () => {
      await loadFilings()
      await loadFamilyTags()
    }

    loadData()
  }, [isClient, router])

  const loadFilings = async () => {
    try {
      setLoading(true)
      const userId = user?._id
      if (!userId) {
        throw new Error("User ID not found")
      }

      const response = await fetch(`https://backend-production-5fad.up.railway.app/api/filing-steps/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch tax data: ${response.status}`)
      }

      const { data } = await response.json()

      // Transform the API response into the ITaxFiling format
      const transformedFilings: ITaxFiling[] = []

      if (data.taxFiling) {
        const personalInfoStep = data.steps.find((step: any) => step.stepKey === "personalInfo")?.data?.[0] || {}
        transformedFilings.push({
          _id: data.taxFiling.id,
          taxYear: parseInt(
            data.steps.find((step: any) => step.stepKey === "taxYear")?.data?.taxYear || new Date().getFullYear().toString()
          ),
          filingType: "individual", // Adjust based on your logic or API data
          status: data.progress.isComplete ? "completed" : data.progress.canSubmit ? "pending" : "draft",
          personalInfo: {
            fullName: personalInfoStep.fullName || user.fullName || "Not provided",
          },
          createdAt: data.taxFiling.createdAt,
          payment: undefined, // Update if payment data is available in the API
          remarks: data.currentStep?.description || "In progress",
          progress: {
            completedSteps: data.progress.completedSteps,
            totalSteps: data.progress.totalSteps,
            progressPercentage: data.progress.progressPercentage,
            isComplete: data.progress.isComplete,
            canSubmit: data.progress.canSubmit,
          },
          currentStep: data.currentStep
            ? {
                stepKey: data.currentStep.stepKey,
                stepName: data.currentStep.stepName,
                description: data.currentStep.description,
                isCompleted: data.currentStep.isCompleted,
                order: data.currentStep.order,
              }
            : undefined,
          steps: data.steps.map((step: any) => ({
            stepKey: step.stepKey,
            stepName: step.stepName,
            description: step.description,
            order: step.order,
            isCompleted: step.isCompleted,
            completedAt: step.completedAt,
            recordCount: step.recordCount,
            summary: step.summary,
            data: step.data,
          })),
        })
      } else {
        // Fallback for no tax filing
        transformedFilings.push({
          _id: `draft-${userId}-${new Date().getFullYear()}`,
          taxYear: new Date().getFullYear(),
          filingType: "individual",
          status: "draft",
          personalInfo: {
            fullName: user.fullName || "Not provided",
          },
          createdAt: new Date().toISOString(),
          remarks: "Draft filing",
        })
      }

      setFilings(transformedFilings)

      // Update user data in cookies if needed
      if (data.user && typeof window !== "undefined") {
        Cookies.set("user", JSON.stringify(data.user))
      }
    } catch (error) {
      console.error("Error loading tax data:", error)
      toast({
        title: "Error",
        description: "Failed to load tax data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadFamilyTags = async () => {
    try {
      if (typeof window !== 'undefined') {
        const savedTags = localStorage.getItem("familyTags")
        if (savedTags) {
          setFamilyTags(JSON.parse(savedTags))
        }
      }
    } catch (error) {
      console.error("Error loading family tags:", error)
    }
  }

  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTagLoading(true)

    try {
      const payload: Record<string, any> = {
        accountEmail: tagFormData.accountEmail,
        userType: tagFormData.userType,
      }

      if (tagFormData.relation?.trim()) {
        payload.relation = tagFormData.relation.trim()
      }

      const response = await fetch("http://localhost:5000/api/family-account/tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let errorMessage = `Failed to save tag: ${response.status}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (e) {
          console.error("Couldn't parse error response", e)
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()

      const newTag: IFamilyTag = {
        _id: result.data?._id || Date.now().toString(),
        accountEmail: result.data?.accountEmail || tagFormData.accountEmail,
        relation: result.data?.relation || "",
        userType: result.data?.userType || tagFormData.userType,
        createdAt: result.data?.createdAt || new Date().toISOString(),
      }

      const updatedTags = [...familyTags, newTag]
      setFamilyTags(updatedTags)
      if (typeof window !== 'undefined') {
        localStorage.setItem("familyTags", JSON.stringify(updatedTags))
      }

      setTagFormData({
        accountEmail: "",
        relation: "",
        userType: "",
      })

      setIsTagModalOpen(false)

      toast({
        title: "Success",
        description: "Family member tagged successfully!",
      })
    } catch (error) {
      console.error("Detailed error tagging account:", error)

      let errorMessage = "Failed to save tag"
      if (error instanceof Error) {
        errorMessage = error.message

        if (errorMessage.includes("User not found")) {
          errorMessage = "Account not found with this email"
        } else if (errorMessage.includes("already tagged")) {
          errorMessage = "This account is already tagged"
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setTagLoading(false)
    }
  }

  const handleRemoveTag = (tagId: string) => {
    const updatedTags = familyTags.filter((tag) => tag._id !== tagId)
    setFamilyTags(updatedTags)
    if (typeof window !== 'undefined') {
      localStorage.setItem("familyTags", JSON.stringify(updatedTags))
    }

    toast({
      title: "Success",
      description: "Family tag removed successfully!",
    })
  }

  const handleOpenModal = () => setIsModalOpen(true)

 const handleCreateFiling = async (data: { taxYear: number; filingType: "individual" | "business" }) => {
  try {
    // Simulate creating filing locally (no API call)
    const newFilingId = Date.now().toString(); // unique id from timestamp

    // Close modal
    setIsModalOpen(false);

    // Show success toast
    toast({
      title: "Success",
      description: `Tax filing for ${data.taxYear} created successfully (local only).`,
    });

    // Redirect to new filing page
    router.push(`/user-services/personal-tax-filing/${newFilingId}/`);

    // Optionally: update local state for filings list
    // Example: if you have `setFilings`, push the new filing
    // setFilings(prev => [
    //   ...prev,
    //   { id: newFilingId, taxYear: data.taxYear, filingType: data.filingType, status: "Draft" }
    // ]);

    // Reload filings if needed
    await loadFilings?.();
  } catch (error) {
    console.error("Error creating tax filing:", error);
    toast({
      title: "Error",
      description: "Failed to create tax filing locally.",
      variant: "destructive",
    });
  }
};


  const handleResumeFiling = (filingId: string) => {
    router.push(`/user-services/personal-tax-filing/${filingId}/`)
  }

  const handleReviewFiling = (filingId: string) => {
    router.push(`/user-services/personal-tax-filing/${filingId}/review`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "under_review":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string, progress?: ITaxFiling["progress"]) => {
    const variants = {
      completed: "bg-green-100 text-green-800 hover:bg-green-200",
      under_review: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      rejected: "bg-red-100 text-red-800 hover:bg-red-200",
      pending: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      draft: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    }

    const effectiveStatus = progress?.isComplete
      ? "completed"
      : progress?.canSubmit
      ? "pending"
      : status

    return (
      <Badge className={variants[effectiveStatus as keyof typeof variants] || variants.draft}>
        {getStatusIcon(effectiveStatus)}
        <span className="ml-1 capitalize">{effectiveStatus.replace("_", " ")}</span>
      </Badge>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  const filteredFilings = filings.filter((filing) => {
    const matchesSearch =
      filing.personalInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filing.taxYear.toString().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || filing.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getFilingTypeIcon = (type: string) => {
    return type === "business" ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />
  }

  const getActionButton = (filing: ITaxFiling) => {
    switch (filing.status) {
      case "pending":
        return (
          <Button
            onClick={() => handleResumeFiling(filing._id)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" /> Resume Filing
          </Button>
        )
      case "completed":
        return (
          <Button
            onClick={() => handleReviewFiling(filing._id)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" /> Review Filing
          </Button>
        )
      case "under_review":
        return (
          <Button variant="outline" size="sm" disabled className="flex items-center gap-2 bg-transparent">
            <Clock className="h-4 w-4" /> Under Review
          </Button>
        )
      case "rejected":
        return (
          <Button
            onClick={() => handleResumeFiling(filing._id)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" /> Resubmit
          </Button>
        )
      default:
        return null
    }
  }

  if (!isClient || !user || user.role !== "user") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading tax filings...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-20">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Tax Filings</h1>
            <p className="text-gray-600">Manage and track your family tax filing submissions</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Tag className="h-4 w-4" />
                  Tag Family Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Tag Family Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleTagSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountEmail">Account Email</Label>
                    <Input
                      id="accountEmail"
                      type="email"
                      placeholder="example@gmail.com"
                      value={tagFormData.accountEmail}
                      onChange={(e) => setTagFormData({ ...tagFormData, accountEmail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relation">Relation</Label>
                    <Select
                      value={tagFormData.relation}
                      onValueChange={(value) => setTagFormData({ ...tagFormData, relation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationOptions.map((relation) => (
                          <SelectItem key={relation} value={relation}>
                            {relation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userType">User Type</Label>
                    <Select
                      value={tagFormData.userType}
                      onValueChange={(value) => setTagFormData({ ...tagFormData, userType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Individual">Individual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsTagModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={tagLoading}>
                      {tagLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Tagging...
                        </>
                      ) : (
                        "Tag Member"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              onClick={handleOpenModal}
              className="bg-green-600 hover:bg-green-700 text-white"
              aria-label="Create new tax filing"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Tax Filing
            </Button>
          </div>
        </div>

        {/* Family Tags Section */}
        {familyTags.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Tagged Family Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {familyTags.map((tag) => (
                  <div key={tag._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{tag.accountEmail}</p>
                      <p className="text-xs text-gray-600">
                        {tag.relation} • {tag.userType}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag._id)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Information Section */}
        {user && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">User Information</h2>
                <Link
                  href="/privacy-policy"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">User Name</p>
                  <p className="text-sm text-gray-900">{user.fullName || user.name || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Nationality</p>
                  <p className="text-sm text-gray-900">Pakistani</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">CNIC No</p>
                  <p className="text-sm text-gray-900">{user.cnic || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Occupation</p>
                  <p className="text-sm text-gray-900">{user.occupation || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Last Status</p>
                  <p className="text-sm text-gray-900">{user.status || "Active"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        <NewTaxFilingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateFiling} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or tax year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Filings</p>
                  <p className="text-2xl font-bold text-gray-900">{filings.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filings.filter((f) => f.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filings.filter((f) => f.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Family Members</p>
                  <p className="text-2xl font-bold text-gray-900">{familyTags.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filings List */}
        {filteredFilings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tax filings found</h3>
              <p className="text-gray-600 mb-6">
                {filings.length === 0
                  ? "Get started by creating your first tax filing."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFilings.map((filing) => (
              <Card key={filing._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getFilingTypeIcon(filing.filingType)}
                        <h3 className="text-lg font-semibold text-gray-900">Tax Year {filing.taxYear}</h3>
                        {getStatusBadge(filing.status, filing.progress)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{filing.personalInfo?.fullName || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {filing.createdAt && <span>Created: {formatDate(filing.createdAt)}</span>}
                        </div>
                        {filing.payment?.amount && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Amount: PKR {filing.payment.amount.toLocaleString() || ""}</span>
                          </div>
                        )}
                      </div>
                      {filing.progress && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Progress:</span>
                            <span className="text-sm text-gray-900">{filing.progress.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: `${filing.progress.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {filing.currentStep && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Current Step:</span> {filing.currentStep.stepName}
                        </div>
                      )}
                      {filing.remarks && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                          <strong>Remarks:</strong> {filing.remarks}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-6">{getActionButton(filing)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaxFilingsPage