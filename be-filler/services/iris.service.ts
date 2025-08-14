import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";

// Interface for bank account data structure
export interface IBankAccount {
    bankName: string;
    iban: string;
}

// Interface for IRIS profile data structure
export interface IIrisProfile {
    userId: string;
    email: string;
    phoneNumber: string;
    address: string;
    pin: string;
    password: string; // Note: Avoid storing/sending plaintext passwords in production
    bankAccounts: IBankAccount[];
    employerName: string;
    createdAt: string;
}

// Interface for creating/updating an IRIS profile
export interface CreateIrisProfileDto {
    userId: string;
    email: string;
    phoneNumber: string;
    address: string;
    pin: string;
    password: string;
    bankAccounts: IBankAccount[];
    employerInfo: {
        employerName: string;
        employerNTN: string; // Optional field for employer's NTN
        employerAddress: string; // Optional field for employer's address
    }
    sourceOfIncome: string;
    createdAt: string;
}

export class IrisProfileService extends BaseService {
    constructor() {
        const irisProfileAxiosInstance = axiosInstance.create();
        super(axiosInstance, "/api/v1/secure/irisProfile");
    }

    // Get IRIS profile by user ID
    async getByUser(userId: string): Promise<IIrisProfile | null> {
        try {
            return await this.get<IIrisProfile>(`/user/${userId}`);
        } catch (error) {
            return null; // Return null if no profile exists or on error
        }
    }

    // Create or update IRIS profile
    async createOrUpdate(data: CreateIrisProfileDto): Promise<IIrisProfile> {
        const profileData = {
            userId: data.userId,
            personalInfo: {
                email: data.email,
                phoneNumber: data.phoneNumber,
                pin: data.pin,
                password: data.password,
                address: data.address
            },
            employerInfo: {
                employerName: data.employerInfo.employerName,
                employerNTN: data.employerInfo?.employerNTN || '',
                employerAddress: data.employerInfo.employerAddress // Optional field
            },
            bankAccounts: data.bankAccounts,
            sourceOfIncome: data.sourceOfIncome
        }
        return this.post<IIrisProfile>(`/`, profileData);
    }
}

export const irisProfileService = new IrisProfileService();