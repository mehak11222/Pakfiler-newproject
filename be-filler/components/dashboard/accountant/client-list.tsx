"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Search, UserPlus, ArrowUpDown, X } from "lucide-react"
import { type IUser, UserServices } from "@/services/user.service"
import { type ITaxFiling, TaxFilingService, type CreateTaxFilingDto } from "@/services/taxFiling.service"
import type { CreateDocumentDto, IDocument } from "@/services/document.service"
import { useToast } from "@/hooks/use-toast"
import { DocumentService } from "@/services/document.service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { axiosInstance } from "@/lib/ApiClient"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, User, FileText, FileCheck, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { set } from "date-fns"
import { NotificationService } from "@/services/notifications.service"

interface ClientListProps {
  clients: IUser[]
  taxFilings: ITaxFiling[]
  onFilingCreated: (newFiling: ITaxFiling) => void
}

export function ClientList({ clients, taxFilings, onFilingCreated }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof EnhancedClient>("fullName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<
    CreateTaxFilingDto & { userId: string; documentType: CreateDocumentDto["type"] }
  >({
    userId: "",
    taxYear: new Date().getFullYear(),
    filingType: "individual",
    grossIncome: 0,
    taxPaid: 0,
    documents: [],
    documentType: "Other",
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [clientDetails, setClientDetails] = useState<IUser | null>(null)
  const [clientDocuments, setClientDocuments] = useState<any[]>([])
  const [clientFilings, setClientFilings] = useState<ITaxFiling[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [updatingDocument, setUpdatingDocument] = useState<string | null>(null)
  const [updatingFiling, setUpdatingFiling] = useState<string | null>(null)

  interface EnhancedClient extends IUser {
    filings: number
    latestFiling: string | null
  }

  const enhancedClients: EnhancedClient[] = clients
    .filter((client) => client.role === "user")
    .map((client) => {
      const clientFilings = taxFilings.filter((filing) => filing.user === client._id)
      const filingsCount = clientFilings.length
      const latestFiling =
        clientFilings.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0]
          ?.createdAt || null
      return {
        ...client,
        filings: filingsCount,
        latestFiling,
      }
    })

  const filteredClients = enhancedClients.filter((client) => {
    return (
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client._id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const sortedClients = [...filteredClients].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    if (sortField === "latestFiling") {
      aValue = aValue ? new Date(aValue as string).getTime() : Number.NEGATIVE_INFINITY
      bValue = bValue ? new Date(bValue as string).getTime() : Number.NEGATIVE_INFINITY
    } else if (sortField === "filings") {
      aValue = aValue as number
      bValue = bValue as number
    } else {
      aValue = (aValue as string).toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }
    return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1
  })

  const handleSort = (field: keyof EnhancedClient) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleFormChange = (
    field: keyof (CreateTaxFilingDto & { userId: string; documentType: CreateDocumentDto["type"] }),
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validTypes = ["application/pdf", "image/png", "image/jpeg"]
    const maxSize = 10 * 1024 * 1024
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

  const handleSubmit = async () => {
    if (!formData.userId) {
      toast({ title: "Error", description: "Please select a client", variant: "destructive" })
      return
    }
    if (!formData.taxYear || isNaN(formData.taxYear) || formData.grossIncome < 0 || formData.taxPaid < 0) {
      toast({ title: "Error", description: "Invalid tax year, gross income, or tax paid", variant: "destructive" })
      return
    }
    if (!["individual", "business"].includes(formData.filingType)) {
      toast({ title: "Error", description: "Invalid filing type", variant: "destructive" })
      return
    }

    setIsUploading(true)
    try {
      const us = new UserServices()
      const ts = new TaxFilingService()

      const documentIds: string[] = []

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        try {
          const uploadFormData = new FormData()
          uploadFormData.append("file", file)
          uploadFormData.append("name", file.name)
          uploadFormData.append("type", formData.documentType)
          uploadFormData.append("userId", formData.userId)

          const response = await axiosInstance.post(
            "http://localhost:3001/api/v1/secure/document/post-docs",
            uploadFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          )

          if (response.data && (response.data.id || response.data._id)) {
            const docId = response.data.id || response.data._id
            documentIds.push(docId)
          } else {
            throw new Error(`Document created but no ID returned for ${file.name}`)
          }
        } catch (fileError: any) {
          if (fileError.response) {
            console.error("Error response:", fileError.response.data)
            console.error("Error status:", fileError.response.status)
          }

          toast({
            title: "Document Upload Failed",
            description: `Failed to upload ${file.name}: ${fileError.response?.data?.message || fileError.message}`,
            variant: "destructive",
          })
          continue
        }
      }

      if (documentIds.length > 0) {
        try {
          const user = await us.getById(formData.userId)
          const updatedDocuments = [...(user.documents || []), ...documentIds]
          await us.update(formData.userId, { documents: updatedDocuments })
        } catch (userUpdateError) {
          toast({
            title: "Warning",
            description: "Documents uploaded but failed to update user record",
            variant: "destructive",
          })
        }
      }

      const payload: CreateTaxFilingDto = {
        taxYear: Number(formData.taxYear),
        filingType: formData.filingType,
        grossIncome: Number(formData.grossIncome),
        taxPaid: Number(formData.taxPaid),
        documents: documentIds,
      }

      const newFiling = await ts.createAcc(formData.userId, payload)

      onFilingCreated(newFiling)
      setIsModalOpen(false)
      setFormData({
        userId: "",
        taxYear: new Date().getFullYear(),
        filingType: "individual",
        grossIncome: 0,
        taxPaid: 0,
        documents: [],
        documentType: "Other",
      })
      setSelectedFiles([])

      toast({
        title: "Success",
        description: `Tax filing created successfully${documentIds.length > 0 ? ` with ${documentIds.length} document(s)` : ""}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to create tax filing",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleViewClient = async (clientId: string) => {
    setSelectedClientId(clientId)
    setIsDetailModalOpen(true)
    await fetchClientDetails(clientId)
  }

  const fetchClientDetails = async (id: string) => {
    setLoadingDetails(true)
    try {
      // Fetch client details
      const userService = new UserServices()
      const clientData = await userService.getById(id)
      setClientDetails(clientData)

      // Fetch client documents
      const documentService = new DocumentService()
      const documents = await documentService.getByUser(id)
      setClientDocuments(documents || [])

      // Filter tax filings for this client

      const clientTaxFilings = taxFilings.filter((filing) => filing.user?._id === id)
      setClientFilings(clientTaxFilings)
    } catch (error) {
      console.error("Error fetching client details:", error)
      toast({
        title: "Error",
        description: "Failed to load client details",
        variant: "destructive",
      })
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleUpdateDocumentStatus = async (documentId: string, newStatus: string) => {
    setUpdatingDocument(documentId)
    try {
      const documentService = new DocumentService()
      const d = await documentService.updateStatus(documentId, newStatus)
      console.log(d)
      const notificationService = new NotificationService();
      if (clientDetails)
        await notificationService.send(
          clientDetails._id,
          `Your document status has been updated to ${newStatus}`,
          "info",
          '',
        )
      // Update local state
      setClientDocuments((prev) => prev.map((doc) => (doc._id === documentId ? { ...doc, status: newStatus } : doc)))

      toast({
        title: "Success",
        description: "Document status updated successfully",
      })
    } catch (error) {
      console.error("Error updating document status:", error)
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive",
      })
    } finally {
      setUpdatingDocument(null)
    }
  }

  const handleUpdateFilingStatus = async (filing: any, newStatus: string) => {
    setUpdatingFiling(filing)
    try {
      const taxFilingService = new TaxFilingService()
      console.log("Updating filing status:", filing, newStatus)
      await taxFilingService.updateStatus(filing._id, { status: newStatus } as any)

      // Update local state
      setClientFilings((prev) =>
        prev.map((f) => (f._id === filing._id ? { ...f, status: newStatus as ITaxFiling["status"] } : f)),
      )

      toast({
        title: "Success",
        description: "Tax filing status updated successfully",
      })
    } catch (error) {
      console.error("Error updating tax filing status:", error)
      toast({
        title: "Error",
        description: "Failed to update tax filing status",
        variant: "destructive",
      })
    } finally {
      setUpdatingFiling(null)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "border-green-500 text-green-500"
      case "rejected":
        return "border-red-500 text-red-500"
      case "under_review":
      case "pending":
        return "border-yellow-500 text-yellow-500"
      default:
        return "border-gray-500 text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "under_review":
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }
  const handleViewDocument = async (doc: IDocument) => {
    try {
      // const documentService = new DocumentService()
      const fileName = doc.fileUrl.split("/").pop()
      console.log("Document URL:", fileName)
      const response = await axiosInstance.get(`http://localhost:3001/api/v1/secure/document/download/${fileName}`, {
        responseType: "blob",
      });

      // Create a blob URL from response
      const blob = new Blob([response.data]);
      const blobUrl = URL.createObjectURL(blob);

      // Open the blob in new tab
      window.open(blobUrl, "_blank");
      // if (documentData) {
      //   // window.open(documentData, "_blank")
      // } else {
      //   toast({
      //     title: "Error",
      //     description: "Document not found",
      //     variant: "destructive",
      //   })
      // }
    } catch (error) {
      console.error("Error fetching document:", error)
      toast({
        title: "Error",
        description: "Failed to fetch document",
        variant: "destructive",
      })
    }
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <CardTitle>Clients</CardTitle>
            <CardDescription>Manage your tax filing clients</CardDescription>
          </div>
          {/* <Button variant="outline" className="ml-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#af0e0e] hover:bg-[#8a0b0b]">
                <FileText className="h-4 w-4 mr-2" />
                New Tax Filing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Tax Filing</DialogTitle>
                <DialogDescription>
                  Fill in the details and upload documents to create a new tax filing.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="userId" className="text-right">
                    Client
                  </Label>
                  <Select value={formData.userId} onValueChange={(value) => handleFormChange("userId", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client._id} value={client._id}>
                          {client.fullName} ({client.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filingType" className="text-right">
                    Filing Type
                  </Label>
                  <Select value={formData.filingType} onValueChange={(value) => handleFormChange("filingType", value)}>
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
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="documentType" className="text-right">
                    Document Type
                  </Label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) => handleFormChange("documentType", value)}
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
                              <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
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
                    setIsModalOpen(false)
                    setSelectedFiles([])
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("_id")} className="cursor-pointer">
                  ID
                  {sortField === "_id" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead onClick={() => handleSort("fullName")} className="cursor-pointer">
                  Name
                  {sortField === "fullName" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead onClick={() => handleSort("filings")} className="cursor-pointer">
                  Filings
                  {sortField === "filings" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead onClick={() => handleSort("latestFiling")} className="cursor-pointer">
                  Latest Filing
                  {sortField === "latestFiling" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                  Status
                  {sortField === "status" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                sortedClients.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell className="font-medium">{client._id}</TableCell>
                    <TableCell>{client.fullName}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.filings}</TableCell>
                    <TableCell>{client.latestFiling ? formatDate(client.latestFiling) : "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          client.status === "approved"
                            ? "border-green-500 text-green-500"
                            : client.status === "pending"
                              ? "border-yellow-500 text-yellow-500"
                              : "border-red-500 text-red-500"
                        }
                      >
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClient(client._id)}
                        className="hover:bg-[#af0e0e]/10"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {/* Client Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {loadingDetails ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#af0e0e]" />
              <span className="ml-2 text-lg">Loading client details...</span>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center">
                  <User className="h-6 w-6 mr-2 text-[#af0e0e]" />
                  Client Details: {clientDetails?.fullName}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Client Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{clientDetails?.fullName}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{clientDetails?.email}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className={getStatusBadgeClass(clientDetails?.status || "")}>
                      {clientDetails?.status?.charAt(0).toUpperCase() + clientDetails?.status?.slice(1) || "Unknown"}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="filings">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="filings" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Tax Filings
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="filings" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tax Filings</CardTitle>
                      <CardDescription>Manage client's tax filings and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {clientFilings.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          No tax filings found for this client
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tax Year</TableHead>
                              <TableHead>Filing Type</TableHead>
                              <TableHead>Gross Income</TableHead>
                              <TableHead>Tax Paid</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {clientFilings.map((filing) => (
                              <TableRow key={filing.id}>
                                <TableCell>{filing.taxYear}</TableCell>
                                <TableCell className="capitalize">{filing.filingType}</TableCell>
                                <TableCell>${filing.grossIncome?.toFixed(2)}</TableCell>
                                <TableCell>${filing.taxPaid?.toFixed(2)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {getStatusIcon(filing.status)}
                                    <Badge variant="outline" className={`ml-1 ${getStatusBadgeClass(filing.status)}`}>
                                      {filing.status?.replace("_", " ").charAt(0).toUpperCase() +
                                        filing.status?.replace("_", " ").slice(1) || "Unknown"}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell>{formatDate(filing.createdAt)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Select
                                      value={filing.status}
                                      onValueChange={(value) => handleUpdateFilingStatus(filing, value)}
                                      disabled={updatingFiling === filing.id}
                                    >
                                      <SelectTrigger className="w-[130px]">
                                        {updatingFiling === filing.id ? (
                                          <div className="flex items-center">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Updating...
                                          </div>
                                        ) : (
                                          <SelectValue placeholder="Change status" />
                                        )}
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Documents</CardTitle>
                      <CardDescription>Manage client's submitted documents and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {clientDocuments.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">No documents found for this client</div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Uploaded</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {clientDocuments.map((doc) => (
                              <TableRow key={doc._id}>
                                <TableCell>{doc.name}</TableCell>
                                <TableCell>{doc.type}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {getStatusIcon(doc.status)}
                                    <Badge variant="outline" className={`ml-1 ${getStatusBadgeClass(doc.status)}`}>
                                      {doc.status?.replace("_", " ").charAt(0).toUpperCase() +
                                        doc.status?.replace("_", " ").slice(1) || "Unknown"}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell>{formatDate(doc.createdAt)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                      View
                                    </Button>
                                    <Select
                                      value={doc.status}
                                      onValueChange={(value) => handleUpdateDocumentStatus(doc._id, value)}
                                      disabled={updatingDocument === doc._id}
                                    >
                                      <SelectTrigger className="w-[130px]">
                                        {updatingDocument === doc._id ? (
                                          <div className="flex items-center">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Updating...
                                          </div>
                                        ) : (
                                          <SelectValue placeholder="Change status" />
                                        )}
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
