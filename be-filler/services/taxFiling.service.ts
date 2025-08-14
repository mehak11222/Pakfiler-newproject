import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";
import { Key } from "readline";

export interface CreateTaxFilingDto {
  taxYear: number;
  filingType: 'individual' | 'business';
  grossIncome: number;
  taxPaid: number;
  documents: string[];
}

export interface UpdateFilingStatusDto {
  status: 'pending' | 'under_review' | 'completed' | 'rejected';
  remarks?: string;
  assignedTo?: string;
}

// Define interface for the tax filing data structure

export interface IPersonalInfo {
  fullName: string;
  dateOfBirth: Date;
  cnic: string;
  occupation?: string;
  email: string;
  mobileNo?: string;
  nationality: string;
  residentialStatus: string;
}

export interface IAdjustableTax {
  description: string;
  type: string;
  taxDeducted: number;
}

export interface IBalanceSheet {
  totalAssets: number;
  totalLiabilities: number;
  totalCapital: number;
}

export interface IIncome {
  type:
  | 'salary'
  | 'business'
  | 'freelancer'
  | 'professional'
  | 'pension'
  | 'agriculture'
  | 'commission'
  | 'partnership'
  | 'rent'
  | 'propertySale'
  | 'savings'
  | 'dividendGain'
  | 'other';
  details: {
    annualSalary?: number;
    taxDeducted?: number;
    businessType?: 'trader' | 'dealer' | 'wholesaler' | 'importer' | 'exporter' | 'manufacturer';
    taxDeductionStatus?: 'all' | 'some' | 'none';
    revenueTaxDeducted?: number;
    taxDeductedAmount?: number;
    taxRate?: number;
    revenueNoTaxDeducted?: number;
    directExpense?: number;
    indirectExpense?: number;
    balanceSheet?: IBalanceSheet;
    adjustableTaxes?: IAdjustableTax[];
    importValue?: number;
    exportValue?: number;
    isForeignIncome?: boolean;
    isPsebRegistered?: boolean;
    revenueITExports?: number;
    freelancerIncome?: number;
    freelancerExpense?: number;
    taxDeductedFreelancer?: number;
    professionType?: 'doctor' | 'lawyer' | 'accountant' | 'engineer' | 'tutor' | 'consultant' | 'other';
    professionalIncome?: number;
    professionalExpense?: number;
    taxDeductedProfessional?: number;
    pensionIncome?: number;
    agricultureIncome?: number;
    commissionType?: 'lifeInsurance' | 'generalInsurance' | 'realEstate' | 'travelAgent' | 'consultancy' | 'otherCommission';
    commissionIncome?: number;
    commissionExpense?: number;
    taxDeductedCommission?: number;
    taxRateCommission?: number;
    partnershipDetails?: {
      partnershipName: string;
      shareName: string;
      profit: number;
      capitalShare: number;
    }[];
    annualRent?: number;
    rentExpense?: number;
    taxDeductedRent?: number;
    propertySaleType?: 'openPlot' | 'constructedPlot' | 'flat';
    gainOnSale?: number;
    holdingPeriod?: 'within1Year' | '1to2Years' | '2to3Years' | '3to4Years' | '4to5Years' | '5to6Years' | 'over6Years';
    constructedHoldingPeriod?: 'within1Year' | '1to2Years' | '2to3Years' | '3to4Years' | 'over4Years';
    flatHoldingPeriod?: 'within1Year' | '1to2Years' | 'over2Years';
    plotDetails?: { size?: number; location?: string };
    constructedPlotDetails?: { size?: number; constructionCost?: number };
    flatDetails?: { size?: number; floor?: number };
    bankDeposits?: {
      bankName: string;
      accountNo: string;
      profitAmount: number;
      taxDeducted: number;
    }[];
    govtSchemes?: {
      type: string;
      profitAmount: number;
      taxDeducted: number;
    }[];
    behboodIncome?: number;
    pensionerBenefitIncome?: number;
    dividends?: {
      type: 'powerCompany' | 'otherCompany' | 'noTaxCompany';
      amount: number;
      taxDeducted: number;
      taxRate: number;
    }[];
    capitalGains?: {
      netCapitalGain: number;
      cgtLiability: number;
      taxDeducted: number;
      costAtJune30: number;
    }[];
    bonusShares?: {
      value: number;
      taxDeducted: number;
    }[];
    otherIncomes?: {
      inflowType: string;
      amount: number;
      description: string;
    }[];
  };
}

export interface ITaxCredit {
  hasDonations?: boolean;
  hasPensionFund?: boolean;
  hasTuitionFees?: boolean;
}

export interface ITaxDeducted {
  bankTransactions?: {
    transactionType: string;
    bankName: string;
    accountNo: string;
    taxDeducted: number;
  }[];
  utilities?: {
    utilityType: string;
    provider: string;
    consumerNo: string;
    taxDeducted: number;
  }[];
  vehicles?: {
    activityType: string;
    vehicleType: string;
    registrationNo: string;
    taxDeducted: number;
  }[];
  other?: {
    propertyPurchaseTax?: number;
    propertySaleTax?: number;
    functionsGatheringTax?: number;
    pensionWithdrawalTax?: number;
  };
}

export interface IWealthStatement {
  openingWealth: number;
  assets: {
    properties?: {
      propertyType: string;
      size: number;
      unitType: string;
      address: string;
      fbrValue: number;
      cost: number;
    }[];
    vehicles?: {
      vehicleType: string;
      cost: number;
      registrationNo: string;
    }[];
    bankAccounts?: {
      bankName: string;
      accountNo: string;
      cost: number;
    }[];
    insurances?: {
      companyName: string;
      description: string;
      premiumPaid: number;
    }[];
    possessions?: {
      possessionType: string;
      description: string;
      cost: number;
    }[];
    foreignAssets?: {
      description: string;
      cost: number;
    }[];
    cash?: {
      balance: number;
    };
    otherAssets?: {
      transactionType: string;
      description: string;
      amount: number;
    }[];
  };
  liabilities: {
    bankLoans?: {
      bankName: string;
      outstandingLoan: number;
    }[];
    otherLiabilities?: {
      liabilityType: string;
      amount: number;
      description: string;
    }[];
  };
}

export interface INTN {
  isRegistered: boolean;
  pin?: string;
  password?: string;
  identityCard?: string;
}

export interface ITaxFiling {
  notes: any;
  filedBy: string;
  taxPaid: any;
  grossIncome: any;
  id: Key | null | undefined;
  _id: string;
  user: string;
  taxYear: number;
  filingType: 'individual' | 'business';
  personalInfo?: IPersonalInfo;
  incomes?: IIncome[];
  taxCredits?: ITaxCredit;
  taxDeducted?: ITaxDeducted;
  wealthStatement?: IWealthStatement;
  expenses?: {
    householdExpenses: number;
  };
  wealthReconciliation?: {
    difference: number;
    autoAdjust: boolean;
  };
  ntn?: INTN;
  payment?: {
    notes: string | undefined;
    paymentProof: string | undefined;
    status: string | undefined;
    amount: number;
    method?: string;
    transactionId?: string;
  };
  completedSteps: string[];
  status: 'pending' | 'under_review' | 'completed' | 'rejected';
  assignedTo?: string;
  remarks?: string;
  documents: string[];
  history: {
    status: 'pending' | 'under_review' | 'completed' | 'rejected';
    remarks?: string;
    updatedBy: string;
    updatedAt: Date;
  }[];
  createdAt: string;
  updatedAt: Date;
  addNTNToCart?: boolean;
}

export class TaxFilingService extends BaseService {
  constructor() {
    super(axiosInstance, "/api/v1/secure/taxFiling"); // Ensure this matches your backend route
  }

  // Create a new tax filing
  async create(userId: string, data: any): Promise<ITaxFiling> {
    console.log("Creating tax filing with data:", data);
    return this.post<ITaxFiling>("/", { ...data, userId });
  }
  async createAcc(userId: string, data: CreateTaxFilingDto): Promise<ITaxFiling> {
    return this.post<ITaxFiling>("/create-acc", { ...data, userId });
  }

  // Get tax filings for a specific user
  async getByUser(userId: string): Promise<ITaxFiling[]> {
    console.log("Fetching tax filings for user ID:", userId);
    return this.get<ITaxFiling[]>(`/my`);
  }

  // Get all tax filings
  async getAll(): Promise<ITaxFiling[]> {
    return this.get<ITaxFiling[]>("/");
  }

  async getStep(id: string, step: string): Promise<any> {
    console.log("Fetching step data for tax filing ID:", id, "Step:", step);
    return this.get<any>(`/${id}/step/${step}`);
  }
  async createMulti(data: any): Promise<ITaxFiling> {
    return this.post<ITaxFiling>("/step1", { data });
  }
  async step1(id: string, data: any): Promise<ITaxFiling> {
    return this.put<ITaxFiling>(`/${id}/step1`, { data });
  }
  async step2(id: string, data: any): Promise<ITaxFiling> {
    console.log(data)
    return this.put<ITaxFiling>(`/${id}/step2`, { data });
  }
  async step3(id: string, data: any): Promise<ITaxFiling> {
    return this.put<ITaxFiling>(`/${id}/step3`, { data });
  }
  async step4(id: string, data: any): Promise<ITaxFiling> {
    return this.put<ITaxFiling>(`/${id}/step4`, { data });
  }
  async step5(id: string, data: any): Promise<ITaxFiling> {
    return this.put<ITaxFiling>(`/${id}/step5`, { data });
  }
  async step6(id: string, data: any): Promise<ITaxFiling> {
    return this.put<ITaxFiling>(`/${id}/step6`, { data });
  }
  async step7(id: string, data: any): Promise<ITaxFiling> {
    return this.put<ITaxFiling>(`/${id}/step3`, { data });
  }
  async submitFiling(id: string) {
    return this.put<ITaxFiling>(`/${id}/step9`)
  }
  // Get tax filing by ID
  async getById(id: string): Promise<ITaxFiling> {
    return this.get<ITaxFiling>(`/${id}`);
  }
  async getByUserId(userId: string): Promise<ITaxFiling[]> {
    return this.get<ITaxFiling[]>(`/user/${userId}`);
  }

  // Update tax filing status
  async updateStatus(id: string, data: UpdateFilingStatusDto): Promise<ITaxFiling> {
    console.log("Updating tax filing status:", { id, data });
    return this.put<ITaxFiling>(`/${id}/status`, { data });
  }

  // Get tax filing history
  async getHistory(id: string): Promise<ITaxFiling['history']> {
    const filing = await this.get<ITaxFiling>(`/${id}/history`);
    return filing.history;
  }

  // Update addNTNToCart for a tax filing
  async updateAddNTNToCart(id: string, addNTNToCart: boolean): Promise<ITaxFiling> {
    return this.patch<ITaxFiling>(`/${id}/add-ntn-to-cart`, { addNTNToCart });
  }

  // Save all form data at once
  async saveAllData(id: string, data: any): Promise<ITaxFiling> {
    // You may want to use PATCH or PUT depending on backend implementation
    return this.patch<ITaxFiling>(`/${id}/save-all`, data);
  }

  // Update payment details
  async updatePayment(id: string, paymentData: any): Promise<ITaxFiling> {
    return this.patch<ITaxFiling>(`/${id}/payment`, paymentData);
  }
}