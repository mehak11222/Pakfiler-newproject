"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";

interface Document {
  _id: string;
  userId: string;
  docType: string;
  type: string;
  status: string;
  fileUrl: string;
  createdAt: string;
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = Cookies.get("token");
        console.log("Token:", token);
        if (!token) {
          console.error("No token found in cookies");
          setDocuments([]);
          return;
        }

        const response = await axios.get("https://backend-production-5fad.up.railway.app/api/admin/documents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", response.data);
        console.log("Documents:", response.data.data.documents);

        if (response.data.success && Array.isArray(response.data.data.documents)) {
          const mappedDocs = response.data.data.documents.map((doc: any) => ({
            _id: doc._id,
            userId: doc.user._id, // Map user._id to userId
            docType: doc.docType,
            type: doc.docType.split("-")[0],
            status: doc.status,
            fileUrl: doc.filePath, // Map filePath to fileUrl
            createdAt: doc.uploadedAt, // Map uploadedAt to createdAt
          }));
          setDocuments(mappedDocs);
        } else {
          console.error("API error: No documents found or invalid response", response.data.message);
          setDocuments([]);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocuments([]);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.userId.toLowerCase().includes(search.toLowerCase()) ||
      doc.docType.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filters.type === "all" || doc.type.toLowerCase() === filters.type.toLowerCase();

    const matchesStatus =
      filters.status === "all" || doc.status.toLowerCase() === filters.status.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              type="text"
              placeholder="Search by User ID or Document Type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px]"
            />
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ntn">NTN</SelectItem>
                <SelectItem value="gst">GST</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                  <th className="p-3 font-medium">User ID</th>
                  <th className="p-3 font-medium">Document Type</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">File</th>
                  <th className="p-3 font-medium">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc._id} className="border-t text-sm">
                    <td className="p-3">{doc.userId}</td>
                    <td className="p-3">{doc.docType}</td>
                    <td className="p-3">{doc.type}</td>
                    <td className="p-3 capitalize">{doc.status}</td>
                    <td className="p-3">
                      {doc.fileUrl ? (
                        /\.(jpe?g|png|gif)$/i.test(doc.fileUrl) ? (
                          <img
                            src={`https://backend-production-5fad.up.railway.app/uploads/${doc.fileUrl}`}
                            alt="preview"
                            className="h-10 w-10 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "";
                            }}
                          />
                        ) : (
                          <a
                            href={`https://backend-production-5fad.up.railway.app/uploads/${doc.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        )
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-3">{new Date(doc.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDocuments.length === 0 && (
              <div className="text-center text-gray-500 py-4">No documents found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}