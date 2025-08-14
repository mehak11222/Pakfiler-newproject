import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";

// Define interfaces for the report data structures
interface FilingSummary {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

export interface IMonthlyStats {
  [month: string]: {
    filings: number;
    approved: number;
    rejected: number;
    pending: number;
  };
}

interface MonthlyGraphStats {
  months: string[];
  filings: number[];
  approved: number[];
  rejected: number[];
  pending: number[];
}

interface Filing {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  // Add other relevant fields
}

interface UserActivity {
  userId: string;
  name: string;
  email: string;
  filingsCount: number;
  lastActivity: string;
}

export interface IRevenueSummary {
  totalGrossIncome: number;
  totalTaxPaid: number;
}

interface FilingQueryParams {
  [key: string]: string | number | undefined;
}

export class ReportService extends BaseService {
  constructor() {
    super(axiosInstance, "/api/v1/secure/reports");
  }

  // Get filings summary
  async getFilingSummary(): Promise<FilingSummary> {
    return this.get<FilingSummary>("/filings-summary");
  }

  // Get monthly stats for a given year
  async getMonthlyStats(year: number): Promise<IMonthlyStats> {
    return this.get<IMonthlyStats>(`/monthly?year=${year}`);
  }

  // Get monthly graph stats for a given year
  async getMonthlyGraphStats(year: number): Promise<MonthlyGraphStats> {
    return this.get<MonthlyGraphStats>(`/monthly/graph?year=${year}`);
  }

  // Get filings with filters
  async getFilingsFiltered(query?: FilingQueryParams): Promise<Filing[]> {
    const queryString = query
      ? `?${Object.entries(query)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join("&")}`
      : "";
    return this.get<Filing[]>(`/filings/filter${queryString}`);
  }

  // Export filings as CSV
  async exportFilingsAsCSV(): Promise<string> {
    return this.get<string>("/filings/export");
  }

  // Get user activity report
  async getUserActivity(): Promise<UserActivity[]> {
    return this.get<UserActivity[]>("/user-activity");
  }

  // Get revenue summary
  async getRevenueSummary(): Promise<IRevenueSummary> {
    return this.get<IRevenueSummary>("/revenue");
  }

  // Generate PDF report
  async generatePDFReport(title: string, data: string[][]): Promise<Buffer> {
    return this.post<Buffer>("/filings/pdf", { title, data });
  }
}