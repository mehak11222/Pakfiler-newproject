"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { getCurrentUser } from "@/lib/auth";
import Unauthorized from "@/components/Unauthorized";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "recharts";

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
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const user = getCurrentUser();

  if (user?.role !== "accountant") {
    return <Unauthorized />;
  }

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = Cookies.get("token");
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

        if (response.data.success && Array.isArray(response.data.data.documents)) {
          const mappedDocs = response.data.data.documents.map((doc: any) => ({
            _id: doc._id,
            userId: doc.user._id,
            docType: doc.docType,
            type: doc.module.toLowerCase().split(" ")[0], // Extract 'ntn', 'gst', or 'business' from module
            status: doc.status,
            fileUrl: doc.filePath,
            createdAt: doc.uploadedAt,
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

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container px-4 mx-auto py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage documents
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1">
              <Label  className="text-sm font-medium">
                Search by User ID or Document Type
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by User ID or Document Type"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 min-w-[200px] pl-8"
                />
              </div>
            </div>
            <div>
             <Label className="text-sm font-medium">
  Document Type
</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger id="type" className="w-[200px] mt-1">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ntn">NTN</SelectItem>
                  <SelectItem value="gst">GST</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label  className="text-sm font-medium">
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger id="status" className="w-[200px] mt-1">
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
                {paginatedDocuments.map((doc) => (
                  <tr key={doc._id} className="border-t text-sm">
                    <td className="p-3">{doc.userId}</td>
                    <td className="p-3">{doc.docType}</td>
                    <td className="p-3">{doc.type}</td>
                    <td className="p-3 capitalize">{doc.status}</td>
                    <td className="p-3">
                      {doc.fileUrl ? (
                        /\.(jpe?g|png|gif)$/i.test(doc.fileUrl) ? (
                          <img
                            src={`http://localhost:5000/uploads/${doc.fileUrl}`}
                            alt="preview"
                            className="h-10 w-10 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "";
                            }}
                          />
                        ) : (
                          <a
                            href={`http://localhost:5000/uploads/${doc.fileUrl}`}
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
            {paginatedDocuments.length === 0 && (
              <div className="text-center text-gray-500 py-4">No documents found.</div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredDocuments.length)} of{" "}
                {filteredDocuments.length} documents
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}