import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";

export type ContentType = 'faq' | 'blog' | 'video';

export interface CreateContentDto {
  type: ContentType;
  title: string;
  data: any;
  tags?: string[];
  published?: boolean;
  createdBy: string;
}

export interface UpdateContentDto {
  title?: string;
  data?: any;
  tags?: string[];
  published?: boolean;
  updatedBy: string;
}
// Define interface for the content data structure
export interface Content {
  id: string;
  title: string;
  body: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Define interface for query parameters for getAllContent
interface ContentQueryParams {
  [key: string]: string | number | undefined;
}

export class ContentService extends BaseService {
  constructor() {
    super(axiosInstance, "/api/v1/secure/content");
  }

  // Get all content with optional query filters
  async getAllContent(query?: ContentQueryParams): Promise<Content> {
    console.log(1)
    const queryString = query
      ? `?${Object.entries(query)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join("&")}`
      : "";
    return this.get<Content>(`/${queryString}`);
  }

  // Get content by ID
  async getContentById(id: string): Promise<Content> {
    return this.get<Content>(`/${id}`);
  }

  // Create new content
  async createContent(data: CreateContentDto): Promise<Content> {
    return this.post<Content>("/", data);
  }

  // Update existing content
  async updateContent(id: string, data: UpdateContentDto): Promise<Content> {
    return this.put<Content>(`/${id}`, data);
  }

  // Delete content by ID
  async deleteContent(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}