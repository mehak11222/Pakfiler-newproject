"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import Cookies from "js-cookie";
import { getCurrentUser } from "@/lib/auth";
import Unauthorized from "@/components/Unauthorized";

export default function DocumentDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params && typeof params.id === "string" ? params.id : Array.isArray(params?.id) ? params?.id[0] : undefined;
  const { toast } = useToast();
  const [document, setDocument] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = "https://backend-production-5fad.up.railway.app/api/admin";
  const user = getCurrentUser();

  if (!user || user?.role !== "accountant") {
    return <Unauthorized />;
  }

  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or expired token");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const mapApiDocument = (apiDoc: any) => ({
    id: apiDoc._id,
    name: apiDoc.fileName || "N/A",
    gstRegistration: apiDoc.user?.cnic || "N/A",
    type: apiDoc.docType,
    status: apiDoc.status,
    fileUrl: apiDoc.filePath,
    createdAt: apiDoc.uploadedAt,
    updatedAt: apiDoc.updatedAt,
    reviewedBy: apiDoc.approvedBy || "N/A",
    reviewedAt: apiDoc.approvedAt || apiDoc.updatedAt,
    notes: apiDoc.reviewNotes || "N/A",
    reviewLogs: apiDoc.reviewNotes
      ? [{
          status: apiDoc.status,
          reviewedBy: apiDoc.approvedBy || "N/A",
          reviewedAt: apiDoc.approvedAt || apiDoc.updatedAt,
          notes: apiDoc.reviewNotes || "N/A",
        }]
      : [],
  });

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetchWithAuth(`${baseUrl}/documents/${id}`);
        if (!response.success || !response.data) {
          throw new Error("Document not found");
        }
        setDocument(mapApiDocument(response.data.documents[0]));
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            e.message === "Unauthorized: Invalid or expired token"
              ? "Your session has expired. Please log in again."
              : "Failed to fetch document details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchDocument();
    }
  }, [id, toast]);

  const handleStatusChange = async (newStatus: "pending" | "approved" | "rejected", notes?: string) => {
    if (!document) return;
    try {
      const response = await fetchWithAuth(`${baseUrl}/documents/${document.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus, notes }),
      });
      if (!response.success || !response.data) {
        throw new Error("Failed to update document status");
      }
      const updatedDocument = mapApiDocument(response.data);
      setDocument((prev: any) =>
        prev ? { ...prev, status: updatedDocument.status, notes: updatedDocument.notes } : null
      );

      toast({
        title: "Success",
        description: "Document status updated successfully",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          e.message === "Unauthorized: Invalid or expired token"
            ? "Your session has expired. Please log in again."
            : "Failed to update document status. Please try again.",
      });
    }
  };

  const handleViewFile = async () => {
    if (!document?.fileUrl) return;
    try {
      window.open(`https://backend-production-5fad.up.railway.app/uploads/${document.fileUrl}`, "_blank");
    } catch (e: any) {
      console.error("View document error:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          e.message === "Unauthorized: Invalid or expired token"
            ? "Your session has expired. Please log in again."
            : "Failed to view document. Please try again.",
      });
    }
  };

  return (
    <div className="container px-4 mx-auto py-8 mt-16">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/accountant/document-management")}
          className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
          aria-label="Back to document management"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Details</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View and manage document details
          </p>
        </div>
      </div>

      <Card className="w-full border shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-xl">{document?.name || "Document"}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
          ) : !document ? (
            <p className="text-center text-muted-foreground">Document not found</p>
          ) : (
            <div className="space-y-6">
              {/* Document Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="mt-1">{document.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">GST Registration</Label>
                  <p className="mt-1">{document.gstRegistration || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="mt-1 capitalize">{document.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        document.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : document.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {document.status.toUpperCase()}
                    </span>
                    <Select
                      value={document.status}
                      onValueChange={(value) => handleStatusChange(value as "pending" | "approved" | "rejected", document.notes)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Change Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">File</Label>
                  <div className="mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewFile}
                      className="text-[#af0e0e] border-[#af0e0e] hover:bg-[#af0e0e] hover:text-white"
                      aria-label={`View file for ${document.name}`}
                    >
                      View File
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="mt-1">{document.notes || "N/A"}</p>
                </div>
              </div>

              {/* Review Logs */}
              <div>
                <Label className="text-sm font-medium">Review Logs</Label>
                {document.reviewLogs && document.reviewLogs.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {document.reviewLogs.map((log: any, index: number) => (
                      <div key={index} className="border p-3 rounded-md bg-gray-50">
                        <p className="text-sm">
                          <span className="font-medium">Status:</span> {log.status.toUpperCase()}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Reviewed By:</span> {log.reviewedBy || "N/A"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Date:</span> {new Date(log.reviewedAt).toLocaleString()}
                        </p>
                        {log.notes && (
                          <p className="text-sm">
                            <span className="font-medium">Notes:</span> {log.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-muted-foreground">No review logs available</p>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Created At</Label>
                  <p className="mt-1">
                    {document.createdAt ? new Date(document.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Updated At</Label>
                  <p className="mt-1">
                    {document.updatedAt ? new Date(document.updatedAt).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reviewed By</Label>
                  <p className="mt-1">{document.reviewedBy || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reviewed At</Label>
                  <p className="mt-1">
                    {document.reviewedAt ? new Date(document.reviewedAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}