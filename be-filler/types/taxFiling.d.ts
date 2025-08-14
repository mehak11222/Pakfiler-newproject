export type TaxFilingStatus = 'pending' | 'under_review' | 'completed' | 'rejected';
export type FilingType = 'individual' | 'business';

export interface TaxFiling {
    _id: string;
    user: string;
    taxYear: number;
    filingType: FilingType;
    grossIncome: number;
    taxPaid: number;
    status: TaxFilingStatus;
    assignedTo?: string;
    remarks?: string;
    documents: string[];
    history: {
        status: TaxFilingStatus;
        remarks: string;
        updatedBy: string;
        updatedAt: string;
    }[];
}
