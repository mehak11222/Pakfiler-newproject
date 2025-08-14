import { axiosInstance } from "@/lib/ApiClient"; // Adjust path to ApiClient.ts
import { BaseService } from "./base.service";// Adjust path to BaseService.ts


export interface Relation {
  userId: string;
  relation: string;
}
export interface IUser {
  image: string;
  _id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  cnic: string;
  ntn?: string;
  irisProfile?: object;
  role: 'user' | 'accountant' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  relations: Relation[];
  serviceCharges?: string[];
  preferences?: object;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserServices extends BaseService {
  constructor() {
    // Pass the axiosInstance and a baseURL for orders
    super(axiosInstance, "/api/v1/secure/users");
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.get<IUser[]>(`/`)
  }
  // Get an order by ID
  // async getOrderById(id: number): Promise<Order> {
  //   return this.get<Order>(`/${id}`);
  // }

  // Create a new user
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return this.post<IUser>("/no-otp", userData);
  }
  async updateRelations(id: string, relation: Relation): Promise<IUser> {
    console.log(relation)
    return await this.put<IUser>(`/${id}/relations`, relation)
  }
  async updateUserRole(id: string, role: string): Promise<void> {
    return this.put<void>(`/${id}`, { role });
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser> {
    return this.put<IUser>(`/${id}`, userData);
  }
  async updateStatus(id: string, userData: string): Promise<IUser> {
    return this.put<IUser>(`/${id}`, { status: userData });
  }

  async getById(id: string): Promise<IUser> {
    console.log(id)
    return this.get<IUser>(`/${id}`);
  }

  async search(query: string): Promise<IUser[]> {
    return this.get<IUser[]>(`/search?q=${encodeURIComponent(query)}`);
  }
  // // Update an order
  // async updateOrder(id: number, orderData: Partial<Order>): Promise<Order> {
  //   return this.patch<Order>(`/${id}`, orderData);
  // }

  // // Cancel (delete) an order
  // async cancelOrder(id: number): Promise<void> {
  //   return this.delete<void>(`/${id}`);
  // }
}