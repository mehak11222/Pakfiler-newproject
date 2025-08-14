import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";

// Interface for individual service within a category
export interface Service {
  serviceName: string;
  _id?: string;
  name: string;
  fee: string;
  completionTime: string;
  requirements: string[];
  contactMethods: string[];
  category?: string;
}

// Interface for the service charge data structure
export interface ServiceCharge {
  _id?: string;
  category: string;
  services: Service[];
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export class ServiceChargesService extends BaseService {
  constructor() {
    super(axiosInstance, "/api/v1/secure/serviceCharge"); // Adjusted to match backend API base path
  }

  // Get all service charges
  async getAllServiceCharges(): Promise<ServiceCharge[]> {
    return this.get<ServiceCharge[]>("/");
  }

  // Get service charges for the authenticated user
  async getServiceChargesByUser(): Promise<ServiceCharge[]> {
    return this.get<ServiceCharge[]>("/user");
  }

  // Get service charge by category
  async getServiceChargeByCategory(category: string): Promise<ServiceCharge> {
    return this.get<ServiceCharge>(`/${encodeURIComponent(category)}`);
  }

  // Create a new service charge
  async createServiceCharge(data: Omit<ServiceCharge, "_id" | "createdAt" | "updatedAt">): Promise<ServiceCharge> {
    return this.post<ServiceCharge>("/", data);
  }

  // Bulk insert service charges
  async bulkInsertServiceCharges(data: Omit<ServiceCharge, "_id" | "createdAt" | "updatedAt">[]): Promise<{ success: boolean; message: string; data: ServiceCharge[] }> {
    return this.post<{ success: boolean; message: string; data: ServiceCharge[] }>("/bulk", data);
  }

  // Update an existing service charge
  async updateServiceCharge(category: string, data: Partial<ServiceCharge>): Promise<ServiceCharge> {
    return this.put<ServiceCharge>(`/${encodeURIComponent(category)}`, data);
  }

  // Delete a service charge by category
  async deleteServiceCharge(category: string): Promise<void> {
    return this.delete<void>(`/${encodeURIComponent(category)}`);
  }
}