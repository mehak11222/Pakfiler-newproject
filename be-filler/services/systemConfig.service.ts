import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";
import { CreateSystemConfigDto, UpdateSystemConfigDto } from "../../Server/src/modules/systemConfig/dto/systemConfig.dto";

// Define interface for the system configuration data structure
interface SystemConfig {
  key: string;
  value: any;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class SystemConfigService extends BaseService {
  constructor() {
    super(axiosInstance, "/api/v1/system-config");
  }

  // Get all system configurations
  async getAllConfigs(): Promise<SystemConfig[]> {
    return this.get<SystemConfig[]>("/");
  }

  // Get system configuration by key
  async getConfigByKey(key: string): Promise<SystemConfig> {
    return this.get<SystemConfig>(`/${key}`);
  }

  // Create a new system configuration
  async createConfig(data: CreateSystemConfigDto): Promise<SystemConfig> {
    return this.post<SystemConfig>("/", data);
  }

  // Update an existing system configuration
  async updateConfig(key: string, data: UpdateSystemConfigDto): Promise<SystemConfig> {
    return this.put<SystemConfig>(`/${key}`, data);
  }

  // Delete a system configuration by key
  async deleteConfig(key: string): Promise<void> {
    return this.delete<void>(`/${key}`);
  }
}