"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft,
    FileText,
    MessageSquare,
    Phone,
    Search,
} from "lucide-react";
import { ServiceChargesService } from "@/services/serviceCharges.service";
import axios from "axios";

// Define interfaces to match the backend API
interface Service {
    _id?: string;
    name: string;
    fee: string;
    completionTime: string;
    requirements: string[];
    contactMethods: string[];
}

interface ServiceCharge {
    _id?: string;
    category: string;
    services: Service[];
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function ServiceCharges() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [defaultCharges, setDefaultCharges] = useState<{ [key: string]: number }>({});

    // Initialize the service
    const serviceChargesService = new ServiceChargesService();

    // Fetch service charges and default charges on component mount
    useEffect(() => {
        async function fetchServiceCharges() {
            try {
                setLoading(true);
                const [data, config] = await Promise.all([
                    serviceChargesService.getAllServiceCharges(),
                    axios.get("/api/v1/admin/config").then(res => res.data?.defaultCharges || {})
                ]);
                setServiceCharges(data);
                setDefaultCharges(config);
                setError(null);
            } catch (err) {
                setError("Failed to fetch service charges. Please try again later.");
                console.error("Error fetching service charges:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchServiceCharges();
    }, []);

    // Flatten services for unified display and extract unique categories
    let allServices = serviceCharges.flatMap((category) =>
        category.services.map((service) => ({
            ...service,
            category: category.category,
        }))
    );
    // Add Annual Income Tax and NTN Registration if not present
    const mustHaveServices = [
        {
            name: "Annual Income Tax",
            fee: defaultCharges["Annual Income Tax"] ? `Rs. ${defaultCharges["Annual Income Tax"].toLocaleString()}` : "Rs. 1,500",
            completionTime: "1 - 2 Working Days",
            requirements: [
                "Color copy of CNIC",
                "Latest paid electricity bill",
                "Phone Number",
                "Email address"
            ],
            contactMethods: ["whatsapp", "freshchat"],
            category: "Default Services"
        },
        {
            name: "NTN Registration",
            fee: defaultCharges["NTN Registration"] ? `Rs. ${defaultCharges["NTN Registration"].toLocaleString()}` : "Rs. 2,500",
            completionTime: "1 - 2 Working Days",
            requirements: [
                "Color copy of CNIC",
                "Rent agreement/ownership docs of Office premises",
                "Letterhead",
                "Latest paid electricity bill",
                "Phone Number",
                "Email address"
            ],
            contactMethods: ["whatsapp", "freshchat"],
            category: "Default Services"
        }
    ];
    // Only add if not already present
    mustHaveServices.forEach((svc) => {
        if (!allServices.some(s => s.name === svc.name)) {
            allServices.push(svc);
        }
    });

    const categories = ["All Categories", ...new Set([...serviceCharges.map((cat) => cat.category), "Default Services"])];

    // Filter services based on search query and category
    const filteredServices = allServices.filter((service) => {
        const matchesSearch = service.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "All Categories" || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleBack = () => {
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-[60px]">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-[#15803d]" />
                            <h1 className="text-3xl font-bold text-gray-900">Service Charges</h1>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="flex items-center border-[#15803d] text-[#15803d] hover:bg-[#15803d] hover:text-white transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Section */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-gray-300 focus:border-[#15803d] focus:ring-[#15803d] w-full"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="w-full sm:w-64">
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => setSelectedCategory(value)}
                        >
                            <SelectTrigger className="border-gray-300 focus:border-[#15803d] focus:ring-[#15803d]">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category, index) => (
                                    <SelectItem key={index} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">Loading service charges...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <p className="text-green-600 text-lg">{error}</p>
                    </div>
                )}

                {/* Services Grid */}
                {!loading && !error && filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">
                            No services found matching your criteria.
                        </p>
                    </div>
                )}

                {!loading && !error && filteredServices.length > 0 && (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredServices.map((service, index) => (
                            <Card
                                key={index}
                                className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 animate-in fade-in relative"
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                        {service.name}
                                    </CardTitle>
                                    <p className="text-sm text-gray-500">{service.category}</p>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Fee */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Fee</p>
                                            <p className="text-lg font-semibold text-[#15803d]">
                                                {service.fee}
                                            </p>
                                        </div>

                                        {/* Completion Time */}
                                        {service.completionTime && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Completion Time
                                                </p>
                                                <p className="text-base text-gray-900">
                                                    {service.completionTime}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Requirements */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Requirements
                                        </p>
                                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                            {service.requirements.map((req, reqIndex) => (
                                                <li key={reqIndex} className="text-sm">
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>

                                {/* Fixed Chat Icons */}
                                <div className="absolute bottom-4 right-4 flex space-x-3">
                                    {service.contactMethods.includes("freshchat") && (
                                        <a
                                            href="#"
                                            className="p-2 bg-[#15803d] rounded-full text-white hover:bg-[#15803d]/90 transition-colors"
                                            aria-label="Contact via Freshchat"
                                        >
                                            <MessageSquare className="h-5 w-5" />
                                        </a>
                                    )}
                                    {service.contactMethods.includes("whatsapp") && (
                                        <a
                                            href="#"
                                            className="p-2 bg-[#15803d] rounded-full text-white hover:bg-[#15803d]/90 transition-colors"
                                            aria-label="Contact via WhatsApp"
                                        >
                                            <Phone className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}