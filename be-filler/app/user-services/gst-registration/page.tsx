"use client";

import React, { useEffect, useState } from "react";
import {
    Plus,
    FileText,
    Search,
    Filter,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Play,
    Eye,
    Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { environment } from "@/environment/environment";

interface GstRegistration {
    _id: string;
    businessName: string;
    status: "completed" | "inactive" | "pending" | "rejected";
    startDate: string;
    documents: Array<{
        docType: string;
        filePaths: string[];
        _id: string;
    }>;
}

const GstRegistrationsPage = () => {
    const [registrations, setRegistrations] = useState<GstRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const { toast } = useToast();
    const router = useRouter();

    const getAuthToken = () => {
    const token = Cookies.get("token");
    console.log("Raw token cookie:", token);
    if (!token) {
        console.error("Token cookie not found");
        return null;
    }
    return token;
};

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const token = Cookies.get("token");
            const response = await axios.get(`https://backend-production-5fad.up.railway.app//api/gst`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRegistrations(response.data);
        } catch (error) {
            console.error("Error fetching GST registrations:", error);
            toast({
                title: "Error",
                description: "Failed to fetch GST registrations. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleCreateRegistration = () => {
        router.push("/user-services/gst-registration/create");
    };

    const handleViewRegistration = (registrationId: string) => {
        router.push(`/user-services/gst-registration/${registrationId}`);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "pending":
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case "rejected":
                return <XCircle className="h-4 w-4 text-green-600" />;
            case "inactive":
                return <AlertCircle className="h-4 w-4 text-gray-600" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            active: "bg-green-100 text-green-800 hover:bg-green-200",
            pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
            rejected: "bg-green-100 text-green-800 hover:bg-green-200",
            inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        };

        return (
            <Badge className={variants[status as keyof typeof variants] || variants.inactive}>
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status}</span>
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("en-PK", {
                timeZone: "Asia/Karachi",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return "Invalid date";
        }
    };

    const filteredRegistrations = registrations.filter((registration) => {
        const matchesSearch =
            registration.businessName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || registration.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                        <span className="ml-2 text-gray-600">Loading GST registrations...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-20">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">GST Registrations</h1>
                        <p className="text-gray-600">Manage and track your GST registration submissions</p>
                    </div>
                    <Button
                        onClick={handleCreateRegistration}
                        className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white"
                        aria-label="Create new GST registration"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New GST Registration
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search by GSTIN or business name..."
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
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="inactive">Inactive</option>
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
                                    <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                                    <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
                                </div>
                                <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {registrations.filter((r) => r.status === "completed").length}
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
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {registrations.filter((r) => r.status === "pending").length}
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
                                    <p className="text-sm font-medium text-gray-600">Inactive</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {registrations.filter((r) => r.status === "inactive").length}
                                    </p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-gray-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Registrations List */}
                {filteredRegistrations.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No GST registrations found</h3>
                            <p className="text-gray-600 mb-6">
                                {registrations.length === 0
                                    ? "Get started by creating your first GST registration."
                                    : "Try adjusting your search or filter criteria."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredRegistrations.map((registration) => (
                            <Card key={registration._id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Building className="h-4 w-4" />
                                                <h3 className="text-lg font-semibold text-gray-900">{registration.businessName}</h3>
                                                {getStatusBadge(registration.status)}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                {/* <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4" />
                                                    <span>{registration.state}</span>
                                                </div> */}
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Registered: {formatDate(registration.startDate)}</span>
                                                </div>
                                                {/* <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4" />
                                                    <span>State: {registration.state}</span>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="mt-4 lg:mt-0 lg:ml-6">
                                            {registration.status === "pending" ? (
                                                <Button
                                                    onClick={() => handleViewRegistration(registration._id)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Play className="h-4 w-4" />
                                                    Continue Registration
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => handleViewRegistration(registration._id)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View Registration
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GstRegistrationsPage;