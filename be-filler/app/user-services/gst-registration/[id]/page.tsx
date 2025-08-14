"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
    Building,
    Calendar,
    FileText,
    Hash,
    ShoppingBag,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Loader2,
    Edit,
    Upload,
    Eye,
} from "lucide-react";
import { GstRegistrationService, IGstRegistration } from "@/services/gst-registration.service";
import DocumentUpload from "./documents/page";

// Define the GST Registration interface
interface GstRegistration {
    id: string;
    gstin: string;
    businessName: string;
    businessType: string;
    startDate: string;
    businessNature: string;
    description: string;
    consumerNumber: string;
    state: string;
    registrationDate: string;
    status: "completed" | "inactive" | "pending" | "rejected";
}

const GstRegistrationDetail = () => {
    const [registration, setRegistration] = useState<IGstRegistration | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams(); // Returns { id: string | string[] }
    const gstRegId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    if (!gstRegId) {
        return <span>No id found</span>;
    }

    const gstRegistrationService = new GstRegistrationService();

    useEffect(() => {
        const fetchRegistration = async () => {
            try {
                setLoading(true);
                const data = await gstRegistrationService.getById(gstRegId);
                console.log(data);
                if (!data) {
                    toast({
                        title: "Error",
                        description: "GST registration not found.",
                        variant: "destructive",
                    });
                    router.push("/user-services/gst-registration");
                    return;
                }
                setRegistration(data);
            } catch (error) {
                console.error("Error fetching GST registration:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch GST registration. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRegistration();
    }, [gstRegId, router, toast]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case "rejected":
                return <XCircle className="h-5 w-5 text-red-600" />;
            case "inactive":
                return <AlertCircle className="h-5 w-5 text-gray-600" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            active: "bg-green-100 text-green-800 hover:bg-green-200",
            pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
            rejected: "bg-red-100 text-red-800 hover:bg-red-200",
            inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        };

        return (
            <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${variants[status as keyof typeof variants] || variants.inactive
                    }`}
            >
                {getStatusIcon(status)}
                <span className="ml-2 capitalize">{status}</span>
            </span>
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

    const handleEdit = () => {
        router.push(`/user-services/gst-registration/create`);
    };

    const handleUploadDocuments = () => {
        router.push(`/user-services/gst-registration/${gstRegId}/documents`);
    };

    const handleReview = () => {
        router.push(`/user-services/gst-registration/${gstRegId}/review`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 sm:p-20 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                        <span className="ml-2 text-gray-600">Loading GST registration...</span>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!registration) {
        return <span>Registration not found</span>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-20">
            <div className="max-w-7xl mx-auto w-full">
                {/* Stepper */}
                {registration.status !== 'completed' && <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
                                1
                            </div>
                            <span className="ml-2 font-medium text-gray-900">Business Details</span>
                        </div>
                        <div className="h-px flex-1 bg-gray-300 mx-4"></div>
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                2
                            </div>
                            <span className="ml-2 font-medium text-gray-600">Document Upload</span>
                        </div>
                        <div className="h-px flex-1 bg-gray-300 mx-4"></div>
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                3
                            </div>
                            <span className="ml-2 font-medium text-gray-600">Review & Submit</span>
                        </div>
                    </div>
                </div>}

                {/* Registration Details Card */}
                <Card className="border border-red-200 shadow-lg animate-in fade-in duration-500">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            {getStatusBadge(registration.status)}
                        </div>
                        <p className="text-gray-600">Details for your GST registration.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Business Details Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start">
                                        <Building className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Business Name</p>
                                            <p className="text-gray-900">{registration.businessName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <ShoppingBag className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Business Type</p>
                                            <p className="text-gray-900">{registration.businessType}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Start Date</p>
                                            <p className="text-gray-900">{formatDate(registration.startDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <ShoppingBag className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Business Nature</p>
                                            <p className="text-gray-900">{registration.businessNature}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start md:col-span-2">
                                        <FileText className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Description</p>
                                            <p className="text-gray-900">{registration.description || "Not provided"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Utility Details Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Utility Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start">
                                        <Hash className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Consumer Number (GAS/Electricity)</p>
                                            <p className="text-gray-900">{registration.consumerNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Details Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* <div className="flex items-start">
                                        <FileText className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                    </div> */}
                                    {/* <div className="flex items-start">
                                        <Building className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">State</p>
                                            <p className="text-gray-900">{registration.state}</p>
                                        </div>
                                    </div> */}
                                    <div className="flex items-start">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Registration Date</p>
                                            <p className="text-gray-900">{formatDate(registration.registrationDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {registration.status === 'pending' && <div className="flex justify-end space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={handleEdit}
                                    className="flex items-center transition-shadow hover:shadow-sm"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Details
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleUploadDocuments}
                                    className="flex items-center transition-shadow hover:shadow-sm"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Documents
                                </Button>
                                <Button
                                    onClick={handleReview}
                                    className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:shadow-lg"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Review & Submit
                                </Button>
                            </div>}
                        </div>
                        <div>
                            <DocumentUpload />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GstRegistrationDetail;