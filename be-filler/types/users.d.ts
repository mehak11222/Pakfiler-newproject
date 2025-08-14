export interface User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    cnic: string;
    phoneNumber: string;
    role: string;
    status: string;
    document: string[];
    serviceCharges: string[];
    createdAt: string;
    updatedAt: string;
}