export interface ServiceCharge {
    name: string;
    description?: string;
    amount: number;
    currency: string;
    createdBy: string;
    role?: string;
    createdAt: Date;
    updatedAt: Date;
}