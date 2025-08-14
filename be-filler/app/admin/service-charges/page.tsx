"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { DollarSign, Edit, Trash2, X } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import Unauthorized from "@/components/Unauthorized"
import axios from "axios"

interface Service {
    _id?: string
    serviceName: string
    fee: string
    completionTime: string
    requirements: string[]
    contactMethods: string[]
}

interface ServiceCharge {
    _id: string
    category: string
    services: Service[]
    createdAt?: string
    updatedAt?: string
}

export default function ServiceChargesManagement() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([])
    const [filteredServiceCharges, setFilteredServiceCharges] = useState<ServiceCharge[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    const user = getCurrentUser()
    if (user?.role !== 'admin') {
        return <Unauthorized />
    }

    const categories = [
        "All",
        "NTN Registration Services",
        "Tax Filing Services",
        "Sales Tax Registration Services",
        "Company Registration Services",
        "Provident and Gratuity Fund Services",
        "USA Company Services",
    ]

    useEffect(() => {
        const fetchServiceCharges = async () => {
            try {
                const response = await axios.get<{ data: ServiceCharge[] }>(
                    "https://backend-production-5fad.up.railway.app/api/service-charge",
                    { headers: { "Content-Type": "application/json" } }
                )
                const data = response.data.data.map(sc => ({
                    ...sc,
                    services: sc.services.map(s => ({
                        ...s,
                        name: s.serviceName, // Map serviceName to name for UI consistency
                    }))
                }))
                setServiceCharges(data)
                setFilteredServiceCharges(data)
            } catch (e) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch service charges. Please try again.",
                })
            } finally {
                setLoading(false)
            }
        }
        fetchServiceCharges()
    }, [toast])

    useEffect(() => {
        let filtered = serviceCharges

        if (selectedCategory !== "all") {
            filtered = serviceCharges.filter((sc) => sc.category === selectedCategory)
        }

        if (searchQuery) {
            filtered = filtered
                .map((sc) => ({
                    ...sc,
                    services: sc.services.filter((service) =>
                        service.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
                    ),
                }))
                .filter((sc) => sc.services.length > 0)
        }

        setFilteredServiceCharges(filtered)
    }, [searchQuery, selectedCategory, serviceCharges])

    const handleAddServiceCharge = () => {
        router.push("/admin/service-charges/add")
    }

    const handleEditServiceCharge = (category: string) => {
        router.push(`/admin/service-charges/${encodeURIComponent(category)}`)
    }

    const handleDeleteServiceCharge = async () => {
        if (!categoryToDelete) return
        setDeleting(true)
        try {
            const response = await axios.get<{ data: ServiceCharge[] }>(
                "https://backend-production-5fad.up.railway.app/api/service-charge",
                { headers: { "Content-Type": "application/json" } }
            )
            const serviceCharge = response.data.data.find((sc) => sc.category === categoryToDelete)
            if (!serviceCharge) {
                throw new Error("Service charge not found")
            }
            await axios.delete(
                `https://backend-production-5fad.up.railway.app/api/service-charge/${serviceCharge._id}`,
                { headers: { "Content-Type": "application/json" } }
            )
            setServiceCharges((prev) => prev.filter((sc) => sc.category !== categoryToDelete))
            setFilteredServiceCharges((prev) => prev.filter((sc) => sc.category !== categoryToDelete))
            toast({
                title: "Success",
                description: "Service charge deleted successfully.",
            })
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete service charge. Please try again.",
            })
        } finally {
            setDeleting(false)
            setDeleteDialogOpen(false)
            setCategoryToDelete(null)
        }
    }

    const openDeleteDialog = (category: string) => {
        setCategoryToDelete(category)
        setDeleteDialogOpen(true)
    }

    const clearSearch = () => {
        setSearchQuery("")
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="container px-4 mx-auto py-8 mt-16">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Service Charges Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage and track service charges for your clients with ease
                    </p>
                </div>
                <Button
                    className="bg-[#af0e0e] hover:bg-[#8a0b0b] text-white transition-colors"
                    onClick={handleAddServiceCharge}
                >
                    <DollarSign className="h-5 w-5 mr-2" />
                    Add New Service Charge
                </Button>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Input
                        placeholder="Search services by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                        aria-label="Search services by name"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={clearSearch}
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} aria-label="Filter by category">
                    <SelectTrigger className="w-[200px] bg-white">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category.toLowerCase() === "all" ? "all" : category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {filteredServiceCharges.length === 0 ? (
                <Card className="w-full border shadow-sm">
                    <CardContent className="py-8 text-center text-muted-foreground">
                        No service charges found
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServiceCharges.map((sc) => (
                        <Card
                            key={sc._id}
                            className="w-full border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <CardHeader className="bg-gray-50">
                                <CardTitle className="text-xl flex justify-between items-center">
                                    {sc.category}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditServiceCharge(sc.category)}
                                            aria-label={`Edit ${sc.category}`}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 border-red-500 hover:bg-red-50"
                                            onClick={() => openDeleteDialog(sc.category)}
                                            aria-label={`Delete ${sc.category}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {sc.services.map((service, index) => (
                                    <div
                                        key={`${sc._id}-${service._id || index}`}
                                        className="mb-4 last:mb-0 border-b last:border-b-0 pb-4 last:pb-0"
                                    >
                                        <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">Fee:</span> {service.fee}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">Completion Time:</span> {service.completionTime}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">Requirements:</span> {service.requirements.join(", ")}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">Contact Methods:</span> {service.contactMethods.join(", ")}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the service charge category "{categoryToDelete}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteServiceCharge}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}