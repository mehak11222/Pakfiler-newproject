import { axiosInstance } from "@/lib/ApiClient"; // Adjust path to your ApiClient.ts
import { BaseService } from "./base.service"; // Adjust path to your BaseService.ts

// Define interfaces for the data structures based on the routes and controller
interface User {
  id: string;
  role: string;
  // Add other user fields as needed (e.g., name, email) based on AdminService.getUsers response
}

interface Document {
  id: string;
  status: string;
  // Add other document fields as needed based on AdminService.getAllDocuments response
}

interface DashboardStats {
  // Define structure based on what AdminService.getDashboardStats returns
  // Example fields, adjust as per your actual response
  totalUsers: number;
  totalDocuments: number;
  activeUsers: number;
}

interface Config {
  // Define structure based on what ConfigService.getConfig returns
  // Example fields, adjust as per your actual response
  maxUploadSize: number;
  allowedFileTypes: string[];
}

export class AdminService extends BaseService {
  constructor() {
    // Pass the axiosInstance and a baseURL for admin routes
    super(axiosInstance, "/api/v1/admin"); // Adjust baseURL as per your API structure
  }

  // Get dashboard statistics
  async getDashboard(): Promise<DashboardStats> {
    return this.get<DashboardStats>("/dashboard");
  }

  // Get all users
  async getUsers(): Promise<User[]> {
    return this.get<User[]>("/users");
  }

  // Update a user's role
  async updateUserRole(id: string, role: string): Promise<User> {
    return this.put<User>(`/users/${id}/role`, { role });
  }

  // Delete a user
  async deleteUser(id: string): Promise<void> {
    return this.delete<void>(`/users/${id}`);
  }

  // Get all documents
  async getAllDocuments(): Promise<Document[]> {
    return this.get<Document[]>("/documents");
  }

  // Get configuration
  async getConfig(): Promise<Config> {
    return this.get<Config>("/config");
  }

  // Update configuration
  async updateConfig(config: Partial<Config>): Promise<Config> {
    return this.put<Config>("/config", config);
  }
}