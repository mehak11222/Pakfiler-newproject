import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";

interface NTN {
    _id?: string;
    user: string;
    isRegistered: boolean;
    pin?: string;
    password?: string;
    identityCard?: string;
    createdAt?: string;
    updatedAt?: string;
}

export class NTNService extends BaseService {
    constructor() {
        super(axiosInstance, "/api/v1/secure/nTN");
    }

    async getAllNTNs(): Promise<NTN[]> {
        return this.get<NTN[]>("/");
    }

    async getNTNById(ntnId: string): Promise<NTN> {
        return this.get<NTN>(`/${ntnId}`);
    }

    async getNTNbyUserId(userId: string) {
        return this.get<NTN>(`/user/${userId}`)
    }

    async createNTN(data: Partial<NTN>): Promise<NTN> {
        return this.post<NTN>("/", data);
    }

    async registerNTN(ntnId: string, fileId: string): Promise<NTN> {
        console.log(ntnId, fileId)
        return this.post<NTN>(`/${ntnId}/register`, { fileId });
    }

    async updateNTN(ntnId: string, data: Partial<NTN>): Promise<NTN> {
        return this.put<NTN>(`/${ntnId}`, data);
    }

    async deleteNTN(ntnId: string): Promise<void> {
        return this.delete<void>(`/${ntnId}`);
    }
}