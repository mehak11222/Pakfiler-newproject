import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";
import { IDocument } from "./document.service";

export interface CreateBusinessIncorporationDto {
    purpose: "sole-proprietor" | "aop-partnership" | "add-business-ntn" | "remove-business-ntn";
    businessName: string;
    email: string;
    phoneNumber: string;
    irisPin?: string;
    irisPassword?: string;
    cessationDate?: string;
    documents?: FormData;
}

export interface UpdateBusinessIncorporationDto {
    purpose?: "sole-proprietor" | "aop-partnership" | "add-business-ntn" | "remove-business-ntn";
    businessName?: string;
    email?: string;
    phoneNumber?: string;
    irisPin?: string;
    irisPassword?: string;
    cessationDate?: string;
    documents?: IDocument[];
}

export interface IBusinessIncorporation {
    id: string;
    userId: string;
    purpose: "sole-proprietor" | "aop-partnership" | "add-business-ntn" | "remove-business-ntn";
    businessName: string;
    email: string;
    phoneNumber: string;
    irisPin?: string;
    irisPassword?: string;
    cessationDate?: string;
    documents?: IDocument[];
    createdAt: string;
    updatedAt: string;
}

export class BusinessIncorporationService extends BaseService {
    constructor() {
        super(axiosInstance, "/api/v1/secure/businessIncorporation");
    }

    async create(data: CreateBusinessIncorporationDto): Promise<IBusinessIncorporation> {
        if (data.purpose === "aop-partnership" && data.documents) {
            return this.post<IBusinessIncorporation>("/incorporate", data.documents, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } else {
            const { documents, ...formData } = data;
            return this.post<IBusinessIncorporation>("/incorporate", formData);
        }
    }

    async getByUser(userId: string): Promise<IBusinessIncorporation[]> {
        return this.get<IBusinessIncorporation[]>(`/user/${userId}`);
    }
}

export const businessIncorporationService = new BusinessIncorporationService();