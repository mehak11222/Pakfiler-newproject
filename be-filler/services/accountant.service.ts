import { axiosInstance } from "@/lib/ApiClient"; // Adjust path to your ApiClient.ts
import { BaseService } from "./base.service"; // Adjust path to your BaseService.ts

// Define interfaces for the data structures based on the routes and controller
interface Document {
  id: string;
  status: string;
  notes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewLogs?: Array<{
    reviewedBy: string;
    status: string;
    notes?: string;
    reviewedAt: string;
  }>;
}

interface DashboardStats {
  // Define the structure based on what AccountantService.getDashboardStats returns
  // Example fields, adjust as per your actual response
  totalDocuments: number;
  pendingDocuments: number;
  approvedDocuments: number;
  rejectedDocuments: number;
}

interface Charges {
  userId: string;
  charges: number; // Adjust type based on your actual charges structure
}

export class AccountantService extends BaseService {
  constructor() {
    // Pass the axiosInstance and a baseURL for accountant routes
    super(axiosInstance, "/api/v1/accountant"); // Adjust baseURL as per your API structure
  }

  // Get all documents with optional status filter
  async getDocuments(status?: string): Promise<Document[]> {
    const query = status ? `?status=${status}` : "";
    return this.get<Document[]>(`/documents${query}`);
  }

  // Get dashboard statistics
  async getDashboard(): Promise<DashboardStats> {
    return this.get<DashboardStats>("/dashboard");
  }

  // Update document status
  async updateDocumentStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<Document> {
    return this.put<Document>(`/documents/${id}`, { status, notes });
  }

  // Get charges for a user
  async getCharges(userId: string): Promise<Charges> {
    return this.get<Charges>(`/charges/${userId}`);
  }

  // Update charges for a user
  async updateCharges(userId: string, charges: number): Promise<Charges> {
    return this.put<Charges>("/charges", { userId, charges });
  }
}