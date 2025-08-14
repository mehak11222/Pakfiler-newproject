import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";
import { IDocument, CreateDocumentDto } from "./document.service";

export interface CreateGstRegistrationDto {
    // gstin: string;
    businessName: string;
    businessType: string;
    startDate: string;
    businessNature: string;
    description?: string;
    consumerNumber: string;
    state: string;
}

export interface UpdateGstRegistrationDto {
    gstin?: string;
    businessName?: string;
    businessType?: string;
    startDate?: string;
    businessNature?: string;
    description?: string;
    consumerNumber?: string;
    state?: string;
    status?: 'active' | 'inactive' | 'pending' | 'rejected';
}

export interface IGstRegistration {
    id: string;
    // gstin: string;
    businessName: string;
    businessType: string;
    startDate: string;
    businessNature: string;
    description: string;
    consumerNumber: string;
    state: string;
    registrationDate: string;
    status: 'completed' | 'inactive' | 'pending' | 'rejected';
    documents: IDocument[];
    createdAt?: string;
    updatedAt?: string;
}

export class GstRegistrationService extends BaseService {
    constructor() {
        super(axiosInstance, "/api/v1/secure/gstRegistration");
    }

    // Create a new GST registration
    async create(data: CreateGstRegistrationDto): Promise<IGstRegistration> {
        console.log(data)
        return this.post<IGstRegistration>("/", data);
    }

    async getAllforUser(): Promise<IGstRegistration[]> {
        return this.get<IGstRegistration[]>("/getAll")
    }

    // Get all GST registrations
    async getAll(): Promise<IGstRegistration[]> {
        return this.get<IGstRegistration[]>("/");
    }

    // Get GST registration by ID
    async getById(id: string): Promise<IGstRegistration> {
        return this.get<IGstRegistration>(`/${id}`);
    }

    // Update GST registration details
    async update(id: string, data: UpdateGstRegistrationDto): Promise<IGstRegistration> {
        return this.put<IGstRegistration>(`/${id}`, data);
    }

    // Delete GST registration by ID
    async remove(id: string): Promise<void> {
        return this.delete<void>(`/${id}`);
    }

    // Submit GST registration
    async submit(id: string): Promise<IGstRegistration> {
        return this.post<IGstRegistration>(`/${id}/submit`, {});
    }

    // Add a document to a GST registration
    async addDocument(registrationId: string, data: CreateDocumentDto): Promise<IGstRegistration> {
        console.log(data)
        return this.post<IGstRegistration>(`/${registrationId}/documents`, data);
    }

    // Get documents for a GST registration
    async getDocuments(registrationId: string): Promise<IDocument[]> {
        return this.get<IDocument[]>(`/${registrationId}/documents`);
    }

    // Delete a document from a GST registration
    async deleteDocument(registrationId: string, documentId: string): Promise<void> {
        return this.delete<void>(`/${registrationId}/documents/${documentId}`);
    }
}