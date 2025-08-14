"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, Trash2, Loader2, ArrowLeft, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { environment } from "@/environment/environment";

interface Document {
    docType: string;
    filePaths: string[];
    _id: string;
    name?: string;
    fileUrl?: string;
    type?: string;
}

interface GstRegistration {
    _id: string;
    status: "completed" | "inactive" | "pending" | "rejected";
    documents: Document[];
}

const documentTypes = [
    "Bank account maintenance certificates",
    "Article of association certificates",
    // ... other document types ...
] as const;

const DocumentUpload = () => {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const [documents, setDocuments] = useState<Document[]>([]);
    const [registration, setRegistration] = useState<GstRegistration | null>(null);
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const [deleting, setDeleting] = useState<{ [key: string]: boolean }>({});
    const { toast } = useToast();
    const router = useRouter();

    const getAuthToken = () => {
        const user = Cookies.get("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            return parsedUser.token;
        }
        return null;
    };

    const fetchRegistration = async () => {
        if (!id) {
            toast({
                title: "Error",
                description: "Invalid registration ID.",
                variant: "destructive",
            });
            router.push("/user-services/gst-registration");
            return;
        }

        try {
            const token = Cookies.get("token");
            const response = await axios.get(`https://backend-production-5fad.up.railway.app/api/gst`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRegistration(response.data);
            setDocuments(response.data.documents || []);
        } catch (error) {
            console.error("Error fetching registration:", error);
            toast({
                title: "Error",
                description: "Failed to load registration. Please try again.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchRegistration();
    }, [id]);

    const handleUpload = async (docType: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !id) return;

        try {
            setUploading((prev) => ({ ...prev, [docType]: true }));
            const token = Cookies.get("token");
            const formData = new FormData();
            formData.append("documents", file); // ✅ matches upload.array('documents')

            formData.append("docType", docType);

            await axios.post(
                `https://backend-production-5fad.up.railway.app/api/gst/upload-document`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast({
                title: "Success",
                description: "Document uploaded successfully.",
                className: "bg-green-100 text-green-800 border-green-500",
            });

            fetchRegistration();
        } catch (error) {
            console.error("Error uploading document:", error);
            toast({
                title: "Error",
                description: "Failed to upload document. Please try again.",
                variant: "destructive",
            });
        } finally {
            setUploading((prev) => ({ ...prev, [docType]: false }));
        }
    };

// const handleDelete = async (docId: string) => {
    //     if (!id) return;

    //     try {
    //         setDeleting(docId);
    //         const token = getAuthToken();
    //         await axios.delete(
    //             `${environment.apiUrl}/api/gst/document/${id}/${docId}`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         toast({
    //             title: "Success",
    //             description: "Document deleted successfully.",
    //             className: "bg-green-100 text-green-800 border-green-500",
    //         });
    //         fetchRegistration(); // Refresh the data
    //     } catch (error) {
    //         console.error("Error deleting document:", error);
    //         toast({
    //             title: "Error",
    //             description: "Failed to delete document. Please try again.",
    //             variant: "destructive",
    //         });
    //     } finally {
    //         setDeleting(null);
    //     }
    // };

    // const handleDelete = async (type: DocumentType, docId: string) => {
    //     try {
    //         setDeleting((prev) => ({ ...prev, [docId]: true }));
    //         if (!registration) {
    //             throw new Error("Registration not loaded.");
    //         }
    //         console.log("Deleting document:", docId, "for type:", type);

    //         // Delete document
    //         await documentService.deleteDocument(registration.id, docId);

    //         // Update GST registration by removing document ID
    //         try {
    //             const updatedDocuments = (registration.documents || []).filter(
    //                 (id: string | null) => id !== docId
    //             );
    //             console.log("Updated documents:", updatedDocuments);
    //             await axiosInstance.post(
    //                 `${environment.apiUrl}/api/v1/secure/gstRegistration/${id}/documents`,
    //                 { documents: updatedDocuments }
    //             );
    //         } catch (updateError) {
    //             console.error("Error updating GST registration:", updateError);
    //             toast({
    //                 title: "Warning",
    //                 description: "Document deleted but failed to update GST registration.",
    //                 variant: "destructive",
    //             });
    //         }

    //         // Refetch documents to ensure UI is in sync with backend
    //         await setDocuments();

    //         toast({
    //             title: "Success",
    //             description: "File deleted successfully.",
    //             className: "bg-green-100 text-green-800 border-green-600",
    //         });
    //     } catch (error) {
    //         console.error("Error deleting file:", error);
    //         toast({
    //             title: "Error",
    //             description: "Failed to delete file. Please try again.",
    //             variant: "destructive",
    //         });
    //     } finally {
    //         setDeleting((prev) => ({ ...prev, [docId]: false }));
    //     }
    // };

    const getDocumentCount = (type: string) => {
        return documents.filter((doc) => doc.docType === type).length;
    };

    const handleBack = () => {
        router.push(`/user-services/gst-registration/create`);
    };

    const handleNext = () => {
        router.push(`/user-services/gst-registration/${id}/review`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-20">
            <div className="max-w-7xl mx-auto w-full">
                {registration?.status !== "completed" && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                    1
                                </div>
                                <span className="ml-2 font-medium text-gray-600">Business Details</span>
                            </div>
                            <div className="h-px flex-1 bg-gray-300 mx-4" />
                            <div className="flex items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
                                    2
                                </div>
                                <span className="ml-2 font-medium text-gray-900">Document Upload</span>
                            </div>
                            <div className="h-px flex-1 bg-gray-300 mx-4" />
                            <div className="flex items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                    3
                                </div>
                                <span className="ml-2 font-medium text-gray-600">Review & Submit</span>
                            </div>
                        </div>
                    </div>
                )}

                <Card className="border border-red-200 shadow-lg animate-in fade-in duration-500">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            {registration?.status !== "completed" ? "Upload Documents" : "Uploaded Documents"}
                        </CardTitle>
                        <p className="text-gray-600">
                            {registration?.status !== "completed"
                                ? "Upload the required documents for GST registration."
                                : "Following documents are uploaded for your registration."}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Document Type</TableHead>
                                        <TableHead>Uploaded Files</TableHead>
                                        <TableHead>No. of Attachments</TableHead>
                                        {registration?.status !== "completed" && <TableHead>Upload</TableHead>}
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documentTypes.map((type) => {
                                        const filteredDocs = documents.filter((doc) => doc.docType === type);
                                        return (
                                            <TableRow key={type}>
                                                <TableCell className="font-medium text-gray-900">{type}</TableCell>
                                                <TableCell className="p-0">
                                                    <div className="flex flex-col gap-2">
                                                        {filteredDocs.length > 0 ? (
                                                            filteredDocs.map((doc) => (
                                                                <div
                                                                    key={doc._id}
                                                                    className="group flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
                                                                    onClick={() => {
                                                                        if (doc.fileUrl) {
                                                                            window.open(doc.fileUrl, "_blank");
                                                                        }
                                                                        toast({
                                                                            title: "Download",
                                                                            description: `Downloading ${doc.name}`,
                                                                            className: "bg-blue-100 text-blue-800 border-blue-500",
                                                                        });
                                                                    }}
                                                                >
                                                                    <FileText className={`h-4 w-4 text-blue-500`} />
                                                                    <span className="truncate max-w-[200px] group-hover:underline">
                                                                        {doc.name}
                                                                    </span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500 italic">
                                                                No files uploaded
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{filteredDocs.length}</TableCell>
                                                {registration?.status !== "completed" && (
                                                    <TableCell>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                            disabled={uploading[type]}
                                                        >
                                                            <label className="cursor-pointer flex items-center">
                                                                {uploading[type] ? (
                                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                ) : (
                                                                    <Upload className="h-4 w-4 mr-2" />
                                                                )}
                                                                Upload
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={(e) => handleUpload(type, e)}
                                                                />
                                                            </label>
                                                        </Button>
                                                    </TableCell>
                                                )}
                                                <TableCell>
                                                    {filteredDocs.map((doc) => (
                                                        <div key={doc._id} className="flex space-x-2 mb-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (doc.fileUrl) {
                                                                        window.open(doc.fileUrl, "_blank");
                                                                    }
                                                                    toast({
                                                                        title: "Download",
                                                                        description: `Downloading ${doc.name}`,
                                                                        className: "bg-blue-100 text-blue-800 border-blue-500",
                                                                    });
                                                                }}
                                                            >
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Download
                                                            </Button>
                                                            {registration?.status !== "completed" && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        // you may reimplement handleDelete if needed
                                                                        toast({
                                                                            title: "Delete",
                                                                            description: `Delete logic to be added.`,
                                                                            variant: "default",
                                                                        });
                                                                    }}
                                                                    disabled={deleting[doc._id]}
                                                                >
                                                                    {deleting[doc._id] ? (
                                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                    )}
                                                                    Delete
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {registration?.status !== "completed" && (
                            <div className="flex justify-between mt-6">
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    className="flex items-center"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DocumentUpload;
