"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
    Building, Calendar, FileText, Hash, ShoppingBag,
    CheckCircle, Clock, XCircle, AlertCircle, Loader2,
    Edit, Download, Trash2, ArrowLeft, Send,
} from "lucide-react";
import Cookies from "js-cookie";

const ReviewGstRegistration = () => {
    const [registration, setRegistration] = useState<any | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState<{ [key: string]: boolean }>({});
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const id = typeof params?.id === "string" ? params?.id : Array.isArray(params?.id) ? params.id[0] : "";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = Cookies.get("token");

            const res = await fetch("https://backend-production-5fad.up.railway.app/api/gst", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            const registrationData = data.find((item: any) => item._id === id);

            if (!registrationData) {
                toast({
                    title: "Error",
                    description: "GST registration not found.",
                    variant: "destructive",
                });
                return;
            }

            setRegistration(registrationData);
            const formattedDocs = registrationData.documents.flatMap((doc: any) =>
                doc.filePaths.map((filePath: string, index: number) => ({
                    id: `${doc._id}-${index}`,
                    type: doc.docType,
                    name: filePath.split("-").slice(1).join("-"),
                    createdAt: registrationData.createdAt,
                    path: filePath,
                }))
            );
            setDocuments(formattedDocs);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({
                title: "Error",
                description: "Failed to fetch registration details.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const token = Cookies.get("token");

            const res = await fetch("https://backend-production-5fad.up.railway.app/api/gst/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ gstId: id }),
            });

            if (!res.ok) throw new Error("Submission failed");

            toast({
                title: "Success",
                description: "GST registration submitted successfully.",
                className: "bg-green-100 text-green-800 border-green-500",
            });

            router.push("/user-services/gst-registration");
        } catch (error) {
            console.error("Error submitting registration:", error);
            toast({
                title: "Error",
                description: "Failed to submit registration. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (docId: string) => {
        toast({
            title: "Not Implemented",
            description: "Document deletion is not yet supported.",
            variant: "destructive",
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "submitted":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case "rejected":
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            submitted: "bg-green-100 text-green-800 hover:bg-green-200",
            pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
            rejected: "bg-red-100 text-red-800 hover:bg-red-200",
        };
        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${variants[status as keyof typeof variants] || variants.pending}`}>
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

    const handleBack = () => {
        router.push(`/user-services/gst-registration/${id}/documents`);
    };

    const handleEdit = () => {
        router.push(`/user-services/gst-registration/create`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 sm:p-20 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                        <span className="ml-2 text-gray-600">Loading review details...</span>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!registration) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-20">
            <div className="max-w-7xl mx-auto w-full">
                {/* Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                1
                            </div>
                            <span className="ml-2 font-medium text-gray-600">Business Details</span>
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
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
                                3
                            </div>
                            <span className="ml-2 font-medium text-gray-900">Review & Submit</span>
                        </div>
                    </div>
                </div>

                {/* Review Card */}
                <Card className="border border-red-200 shadow-lg animate-in fade-in duration-500">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            {/* <CardTitle className="text-3xl font-bold text-gray-900">
                                Review GST Registration {registration.gstin}
                            </CardTitle> */}
                            {getStatusBadge(registration.status)}
                        </div>
                        <p className="text-gray-600">Review your registration details and documents before submission.</p>
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
                                    <div className="flex items-start">
                                        <FileText className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        {/* <div>
                                            <p className="text-sm font-medium text-gray-700">GSTIN</p>
                                            <p className="text-gray-900">{registration.gstin}</p>
                                        </div> */}
                                    </div>
                                    <div className="flex items-start">
                                        <Building className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">State</p>
                                            <p className="text-gray-900">{registration.state}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Registration Date</p>
                                            <p className="text-gray-900">{formatDate(registration.registrationDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                                {documents.length === 0 ? (
                                    <p className="text-gray-600">No documents uploaded yet.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>File Name</TableHead>
                                                    <TableHead>Uploaded At</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {documents.map((doc) => (
                                                    <TableRow
                                                        key={doc?.id || ""}
                                                        className="transition-all duration-200 hover:bg-gray-100"
                                                    >
                                                        <TableCell className="font-medium text-gray-900">{doc?.type || ""}</TableCell>
                                                        <TableCell>{doc?.name || ""}</TableCell>
                                                        <TableCell>{formatDate(doc?.createdAt || "")}</TableCell>
                                                        <TableCell>
                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="transition-shadow hover:shadow-sm"
                                                                    onClick={() => {
                                                                        toast({
                                                                            title: "Download",
                                                                            description: `Downloading ${doc?.name || ""}`,
                                                                            className: "bg-blue-100 text-blue-800 border-blue-500",
                                                                        });
                                                                    }}
                                                                >
                                                                    <Download className="h-4 w-4 mr-2" />
                                                                    Download
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="transition-shadow hover:shadow-sm"
                                                                    onClick={() => handleDelete(doc?.id || "")}
                                                                    disabled={deleting[doc?.id || ""]}
                                                                >
                                                                    {deleting[doc?.id || ""] ? (
                                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                    )}
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    className="flex items-center transition-shadow hover:shadow-sm"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                                <div className="flex space-x-4">
                                    <Button
                                        variant="outline"
                                        onClick={handleEdit}
                                        className="flex items-center transition-shadow hover:shadow-sm"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Details
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:shadow-lg"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Submit Registration
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReviewGstRegistration;