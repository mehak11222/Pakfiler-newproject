"use client"

import { useState } from "react"
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
import { DollarSign, Plus, Trash2, X } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import Unauthorized from "@/components/Unauthorized"
import axios from "axios"
import Cookies from "js-cookie"

interface Service {
    name: string
    fee: string
    completionTime: string
    requirements: string[]
    contactMethods: string[]
}

export default function AddServiceCharge() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState("")
    const [customCategory, setCustomCategory] = useState("")
    const [services, setServices] = useState<Service[]>([
        { name: "", fee: "", completionTime: "", requirements: [""], contactMethods: [""] },
    ])
    const [errors, setErrors] = useState({
        category: "",
        services: [{ name: "", fee: "", completionTime: "", requirements: "", contactMethods: "" }],
    })

    const user = getCurrentUser()
    if (user?.role !== 'accountant') {
        return <Unauthorized />
    }

    const categories = [
        "NTN Registration Services",
        "Tax Filing Services",
        "Sales Tax Registration Services",
        "Company Registration Services",
        "Provident and Gratuity Fund Services",
        "USA Company Services",
        "Custom",
    ]

    const validateForm = () => {
        let isValid = true
        const newErrors = {
            category: "",
            services: services.map(() => ({
                name: "", fee: "", completionTime: "", requirements: "", contactMethods: "",
            })),
        }

        if (!category || (category === "Custom" && !customCategory.trim())) {
            newErrors.category = "Category is required"
            isValid = false
        }

        services.forEach((service, index) => {
            if (!service.name.trim()) {
                newErrors.services[index].name = "Service name is required"
                isValid = false
            }
            if (!service.fee.trim()) {
                newErrors.services[index].fee = "Fee is required"
                isValid = false
            }
            if (!service.completionTime.trim()) {
                newErrors.services[index].completionTime = "Completion time is required"
                isValid = false
            }
            if (service.requirements.every((req) => !req.trim())) {
                newErrors.services[index].requirements = "At least one requirement is required"
                isValid = false
            }
            if (service.contactMethods.every((cm) => !cm.trim())) {
                newErrors.services[index].contactMethods = "At least one contact method is required"
                isValid = false
            }
        })

        setErrors(newErrors)
        return isValid
    }

    const handleAddService = () => {
        setServices([...services, { name: "", fee: "", completionTime: "", requirements: [""], contactMethods: [""] }])
        setErrors({
            ...errors,
            services: [
                ...errors.services,
                { name: "", fee: "", completionTime: "", requirements: "", contactMethods: "" },
            ],
        })
    }

    const handleRemoveService = (index: number) => {
        setServices(services.filter((_, i) => i !== index))
        setErrors({
            ...errors,
            services: errors.services.filter((_, i) => i !== index),
        })
    }

    const handleServiceChange = (
        index: number,
        field: keyof Service,
        value: string | string[]
    ) => {
        const newServices = [...services]
        newServices[index] = { ...newServices[index], [field]: value }
        setServices(newServices)
    }

    const handleRequirementChange = (serviceIndex: number, reqIndex: number, value: string) => {
        const newServices = [...services]
        newServices[serviceIndex].requirements[reqIndex] = value
        setServices(newServices)
    }

    const handleAddRequirement = (serviceIndex: number) => {
        const newServices = [...services]
        newServices[serviceIndex].requirements.push("")
        setServices(newServices)
    }

    const handleRemoveRequirement = (serviceIndex: number, reqIndex: number) => {
        const newServices = [...services]
        newServices[serviceIndex].requirements = newServices[serviceIndex].requirements.filter(
            (_, i) => i !== reqIndex
        )
        setServices(newServices)
    }

    const handleContactMethodChange = (serviceIndex: number, cmIndex: number, value: string) => {
        const newServices = [...services]
        newServices[serviceIndex].contactMethods[cmIndex] = value
        setServices(newServices)
    }

    const handleAddContactMethod = (serviceIndex: number) => {
        const newServices = [...services]
        newServices[serviceIndex].contactMethods.push("")
        setServices(newServices)
    }

    const handleRemoveContactMethod = (serviceIndex: number, cmIndex: number) => {
        const newServices = [...services]
        newServices[serviceIndex].contactMethods = newServices[serviceIndex].contactMethods.filter(
            (_, i) => i !== cmIndex
        )
        setServices(newServices)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        try {
            const token = Cookies.get("token")
            if (!token) {
                throw new Error("No authentication token found")
            }
            await axios.post(
                "https://backend-production-5fad.up.railway.app/api/service-charge",
                {
                    category: category === "Custom" ? customCategory : category,
                    services: services.map((service) => ({
                        serviceName: service.name,
                        fee: service.fee,
                        completionTime: service.completionTime,
                        requirements: service.requirements.filter((req) => req.trim()),
                        contactMethods: service.contactMethods.filter((cm) => cm.trim()),
                    })),
                },
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
            )
            toast({
                title: "Success",
                description: "Service charge created successfully.",
            })
            router.push("/accountant/service-charges")
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create service charge. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container px-4 mx-auto py-8 mt-16">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Add New Service Charge</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Create a new service charge category with associated services
                </p>
            </div>

            <Card className="w-full border shadow-sm">
                <CardHeader className="bg-gray-50">
                    <CardTitle className="text-xl">Service Charge Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="category" className="text-sm font-medium">
                                    Category
                                </Label>
                                <Select value={category} onValueChange={setCategory} aria-label="Select category">
                                    <SelectTrigger id="category" className="mt-1 bg-white">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                                )}
                                {category === "Custom" && (
                                    <Input
                                        placeholder="Enter custom category name"
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        className="mt-2"
                                        aria-label="Custom category name"
                                    />
                                )}
                            </div>

                            {services.map((service, serviceIndex) => (
                                <div
                                    key={serviceIndex}
                                    className="border p-4 rounded-lg relative bg-gray-50"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-lg">Service {serviceIndex + 1}</h3>
                                        {services.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveService(serviceIndex)}
                                                aria-label={`Remove service ${serviceIndex + 1}`}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor={`service-name-${serviceIndex}`} className="text-sm font-medium">
                                                Service Name
                                            </Label>
                                            <Input
                                                id={`service-name-${serviceIndex}`}
                                                placeholder="Enter service name"
                                                value={service.name}
                                                onChange={(e) =>
                                                    handleServiceChange(serviceIndex, "name", e.target.value)
                                                }
                                                className="mt-1"
                                                aria-label={`Service name ${serviceIndex + 1}`}
                                            />
                                            {errors.services[serviceIndex].name && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.services[serviceIndex].name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor={`service-fee-${serviceIndex}`} className="text-sm font-medium">
                                                Fee
                                            </Label>
                                            <Input
                                                id={`service-fee-${serviceIndex}`}
                                                placeholder="Enter fee (e.g., $100)"
                                                value={service.fee}
                                                onChange={(e) =>
                                                    handleServiceChange(serviceIndex, "fee", e.target.value)
                                                }
                                                className="mt-1"
                                                aria-label={`Service fee ${serviceIndex + 1}`}
                                            />
                                            {errors.services[serviceIndex].fee && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.services[serviceIndex].fee}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor={`service-completion-time-${serviceIndex}`}
                                                className="text-sm font-medium"
                                            >
                                                Completion Time
                                            </Label>
                                            <Input
                                                id={`service-completion-time-${serviceIndex}`}
                                                placeholder="Enter completion time (e.g., 2 days)"
                                                value={service.completionTime}
                                                onChange={(e) =>
                                                    handleServiceChange(serviceIndex, "completionTime", e.target.value)
                                                }
                                                className="mt-1"
                                                aria-label={`Service completion time ${serviceIndex + 1}`}
                                            />
                                            {errors.services[serviceIndex].completionTime && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.services[serviceIndex].completionTime}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">Requirements</Label>
                                            {service.requirements.map((req, reqIndex) => (
                                                <div key={reqIndex} className="flex items-center gap-2 mt-1">
                                                    <Input
                                                        placeholder="Enter requirement"
                                                        value={req}
                                                        onChange={(e) =>
                                                            handleRequirementChange(serviceIndex, reqIndex, e.target.value)
                                                        }
                                                        aria-label={`Requirement ${reqIndex + 1} for service ${serviceIndex + 1}`}
                                                    />
                                                    {service.requirements.length > 1 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveRequirement(serviceIndex, reqIndex)}
                                                            aria-label={`Remove requirement ${reqIndex + 1}`}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            {errors.services[serviceIndex].requirements && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.services[serviceIndex].requirements}
                                                </p>
                                            )}
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => handleAddRequirement(serviceIndex)}
                                                className="mt-2 text-[#af0e0e]"
                                                aria-label={`Add requirement to service ${serviceIndex + 1}`}
                                            >
                                                <Plus className="h-4 w-4 mr-1" /> Add Requirement
                                            </Button>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">Contact Methods</Label>
                                            {service.contactMethods.map((cm, cmIndex) => (
                                                <div key={cmIndex} className="flex items-center gap-2 mt-1">
                                                    <Input
                                                        placeholder="Enter contact method"
                                                        value={cm}
                                                        onChange={(e) =>
                                                            handleContactMethodChange(serviceIndex, cmIndex, e.target.value)
                                                        }
                                                        aria-label={`Contact method ${cmIndex + 1} for service ${serviceIndex + 1}`}
                                                    />
                                                    {service.contactMethods.length > 1 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveContactMethod(serviceIndex, cmIndex)}
                                                            aria-label={`Remove contact method ${cmIndex + 1}`}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            {errors.services[serviceIndex].contactMethods && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.services[serviceIndex].contactMethods}
                                                </p>
                                            )}
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => handleAddContactMethod(serviceIndex)}
                                                className="mt-2 text-[#af0e0e]"
                                                aria-label={`Add contact method to service ${serviceIndex + 1}`}
                                            >
                                                <Plus className="h-4 w-4 mr-1" /> Add Contact Method
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                onClick={handleAddService}
                                className="mt-4"
                                aria-label="Add another service"
                            >
                                <Plus className="h-5 w-5 mr-2" /> Add Another Service
                            </Button>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/accountant/service-charges")}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#af0e0e] hover:bg-[#8a0b0b] text-white"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Service Charge"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}