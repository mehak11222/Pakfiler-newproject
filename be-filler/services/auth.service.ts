import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";

// Define interface for the login response
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role?: string;
  };
}

export class AuthService extends BaseService {
  constructor() {
    super(axiosInstance, `/api/v1/auth`);
  }

  // Handle user login
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.post<LoginResponse>("/login", { email, password });
  }
  async loginNoHash(email: string, password: string): Promise<LoginResponse> {
    return this.post<LoginResponse>("/login/no-hash", { email, password });
  }
}