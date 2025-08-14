"use client"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { axiosInstance } from "@/lib/ApiClient"
import Cookies from "js-cookie"

interface ReviewSubmitStepProps {
  taxFilingId?: string
  formData?: any
  handleInputChange?: (field: string, value: any) => void
}

interface TaxFilingData {
  user: any
  taxFiling: any
  personalInfo: any
  incomeSources: any
  incomeDetails: any
  taxCredits: any
  wealth: any
  deductions: any
  liabilitiesAndExpenses: any
  finalization: any
  availableServices: any[]
}

export default function ReviewSubmitStep({ taxFilingId, formData, handleInputChange }: ReviewSubmitStepProps) {
  const [taxFilingData, setTaxFilingData] = useState<TaxFilingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get token from cookies
  const token = Cookies.get("token") || Cookies.get("authToken") || ""
  const taxYear = Cookies.get("taxYear") || "2024"

  // Use either API data or passed formData
  const displayData = taxFilingData || formData || {}

  useEffect(() => {
    const fetchTaxFilingData = async () => {
      if (!taxFilingId && !taxYear) return

      setLoading(true)
      setError(null)

      try {
        // Set authorization header if token exists
        const headers: any = {}
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const response = await axiosInstance.get(`/api/tax-filing/comprehensive/data?taxYear=${taxYear}`, {
          headers,
        })

        if (response.data.success) {
          setTaxFilingData(response.data.data)
        }
      } catch (err: any) {
        console.error("Error fetching tax filing:", err)
        setError("Failed to load tax filing data")
      } finally {
        setLoading(false)
      }
    }

    fetchTaxFilingData()
  }, [taxFilingId, taxYear, token])

  // Calculate total tax credits from API data
  const calculateTotalTaxCredits = (data: any) => {
    if (taxFilingData?.taxCredits) {
      const donations = Number(taxFilingData.taxCredits.donationAmount) || 0
      const pensionFund = Number(taxFilingData.taxCredits.pensionFundInvestment) || 0
      const tuitionFees = Number(taxFilingData.taxCredits.tuitionFee) || 0
      return donations + pensionFund + tuitionFees
    }

    // Fallback to formData structure
    const taxCredits = data.taxCredits || {}
    const donations =
      taxCredits.donations?.enabled &&
      taxCredits.donations.taxCreditAmount &&
      !isNaN(Number(taxCredits.donations.taxCreditAmount))
        ? Number(taxCredits.donations.taxCreditAmount)
        : 0
    const pensionFund =
      taxCredits.pensionFund?.enabled &&
      taxCredits.pensionFund.taxCreditAmount &&
      !isNaN(Number(taxCredits.pensionFund.taxCreditAmount))
        ? Number(taxCredits.pensionFund.taxCreditAmount)
        : 0
    const tuitionFees =
      taxCredits.tuitionFees?.enabled &&
      taxCredits.tuitionFees.taxCreditAmount &&
      !isNaN(Number(taxCredits.tuitionFees.taxCreditAmount))
        ? Number(taxCredits.tuitionFees.taxCreditAmount)
        : 0
    return donations + pensionFund + tuitionFees
  }

  const totalTaxCredits = calculateTotalTaxCredits(displayData)

  // Helper to safely join array fields
  const safeJoin = (arr: any[] | undefined, separator: string) =>
    Array.isArray(arr) && arr.length > 0 ? arr.join(separator) : "None"

  // Helper to format currency
  const formatCurrency = (amount: any) => {
    const num = Number(amount)
    return isNaN(num) ? "0" : num.toLocaleString()
  }

  // Helper to get personal info safely
  const getPersonalInfo = (field: string) => {
    return (
      taxFilingData?.user?.[field] ||
      taxFilingData?.personalInfo?.[field] ||
      displayData.personalInfo?.[field] ||
      displayData[field] ||
      "N/A"
    )
  }

  // Helper to safely render possibly-object fields as strings
  const renderValue = (value: any) => {
    if (value == null) return "N/A"
    if (typeof value === "string" || typeof value === "number") return value
    if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "N/A"
    if (typeof value === "object") {
      const keys = Object.keys(value)
      if (keys.length === 0) return "N/A"
      // Try to display a summary if possible
      return keys.map((k) => `${k}: ${value[k]}`).join(", ")
    }
    return String(value)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-t-blue-600 border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
          <span className="ml-2">Loading tax filing data...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-red-600">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Review & Submit</CardTitle>
        <p className="text-sm text-muted-foreground">Review your tax filing information before submission</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p>
              <strong>Tax Filing ID:</strong> {taxFilingId || "N/A"}
            </p>
            <p>
              <strong>Tax Year:</strong> {taxYear || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  taxFilingData?.taxFiling?.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : taxFilingData?.taxFiling?.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : taxFilingData?.taxFiling?.status === "active"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {taxFilingData?.taxFiling?.status || "Draft"}
              </span>
            </p>
            <p>
              <strong>Completion:</strong> {taxFilingData?.finalization?.finalizedAt ? "Finalized" : "In Progress"}
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p>
              <strong>Full Name:</strong> {getPersonalInfo("fullName")}
            </p>
            <p>
              <strong>Email:</strong> {getPersonalInfo("email")}
            </p>
            <p>
              <strong>CNIC:</strong> {getPersonalInfo("cnic")}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {getPersonalInfo("dateOfBirth") !== "N/A"
                ? format(new Date(getPersonalInfo("dateOfBirth")), "PPP")
                : "N/A"}
            </p>
            <p>
              <strong>Nationality:</strong> {getPersonalInfo("nationality")}
            </p>
            <p>
              <strong>Residential Status:</strong> {getPersonalInfo("residentialStatus")}
            </p>
            <p>
              <strong>Occupation:</strong> {getPersonalInfo("occupation")}
            </p>
            <p>
              <strong>Phone:</strong> {getPersonalInfo("phone")}
            </p>
          </div>
        </div>

        {/* Income Information */}
        <div className="space-y-3 bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Income Information</h3>
          <p>
            <strong>Income Sources:</strong>{" "}
            {safeJoin(taxFilingData?.incomeSources?.selectedSources || displayData.incomeSources, ", ")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {taxFilingData?.incomeDetails?.salaryIncome && (
              <p>
                <strong>Salary Income:</strong> PKR{" "}
                {formatCurrency(taxFilingData.incomeDetails.salaryIncome.annualSalary)}
              </p>
            )}
            {taxFilingData?.incomeDetails?.businessIncome && (
              <p>
                <strong>Business Income:</strong> PKR{" "}
                {formatCurrency(taxFilingData.incomeDetails.businessIncome.totalEarnings || 0)}
              </p>
            )}
            {taxFilingData?.incomeDetails?.freelancerIncome && (
              <p>
                <strong>Freelancer Income:</strong> PKR{" "}
                {formatCurrency(taxFilingData.incomeDetails.freelancerIncome.totalEarnings)}
              </p>
            )}
          </div>
        </div>

        {/* Deductions and Assets */}
        <div className="space-y-3 bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Deductions & Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p>
              <strong>Bank Transactions:</strong> {taxFilingData?.deductions?.bankTransactions?.length || 0}
            </p>
            <p>
              <strong>Utility Deductions:</strong> {taxFilingData?.deductions?.utilityDeductions?.length || 0}
            </p>
            <p>
              <strong>Vehicle Deductions:</strong> {taxFilingData?.deductions?.vehicleDeductions?.length || 0}
            </p>
            <p>
              <strong>Assets:</strong>{" "}
              {taxFilingData?.wealth?.assets
                ? `Properties: ${taxFilingData.wealth.assets.propertyAssets?.length || 0}, Vehicles: ${taxFilingData.wealth.assets.vehicleAssets?.length || 0}, Bank Accounts: ${taxFilingData.wealth.assets.bankAccountAssets?.length || 0}`
                : Array.isArray(displayData.selectedAssets)
                  ? displayData.selectedAssets.join(", ")
                  : "None"}
            </p>
          </div>
        </div>

        {/* Tax Credits */}
        <div className="space-y-3 bg-orange-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Tax Credits</h3>
          <p>
            <strong>Total Tax Credits:</strong> PKR {formatCurrency(totalTaxCredits)}
          </p>
          {taxFilingData?.taxCredits && totalTaxCredits > 0 && (
            <ul className="ml-4 list-disc space-y-1">
              {taxFilingData.taxCredits.donationAmount > 0 && (
                <li>Donations: PKR {formatCurrency(taxFilingData.taxCredits.donationAmount)}</li>
              )}
              {taxFilingData.taxCredits.pensionFundInvestment > 0 && (
                <li>Pension Fund: PKR {formatCurrency(taxFilingData.taxCredits.pensionFundInvestment)}</li>
              )}
              {taxFilingData.taxCredits.tuitionFee > 0 && (
                <li>Tuition Fees: PKR {formatCurrency(taxFilingData.taxCredits.tuitionFee)}</li>
              )}
            </ul>
          )}
        </div>

        {/* Wealth Information */}
        <div className="space-y-3 bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Wealth Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p>
              <strong>Opening Wealth:</strong> PKR{" "}
              {formatCurrency(taxFilingData?.wealth?.openingWealth?.openingWealth || 0)}
            </p>
            <p>
              <strong>Total Expenses:</strong> PKR{" "}
              {formatCurrency(taxFilingData?.liabilitiesAndExpenses?.expenses?.totalHouseholdExpense || 0)}
            </p>
            <p>
              <strong>Bank Loans:</strong> {taxFilingData?.liabilitiesAndExpenses?.bankLoans?.length || 0}
            </p>
            <p>
              <strong>Finalized:</strong> {taxFilingData?.finalization?.termsAccepted ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p>
              <strong>Available Services:</strong> {taxFilingData?.availableServices?.length || 0}
            </p>
            <p>
              <strong>Auto Adjust Wealth:</strong> {taxFilingData?.finalization?.autoAdjustWealth ? "Yes" : "No"}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {taxFilingData?.user?.createdAt ? format(new Date(taxFilingData.user.createdAt), "PPP") : "N/A"}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {taxFilingData?.finalization?.updatedAt
                ? format(new Date(taxFilingData.finalization.updatedAt), "PPP")
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Consent Checkbox (if handleInputChange is provided) */}
        {handleInputChange && (
          <div className="flex items-center space-x-2 pt-4 border-t">
            <Checkbox
              id="consentGiven"
              checked={displayData.consentGiven || false}
              onCheckedChange={(checked) => handleInputChange("consentGiven", checked)}
            />
            <Label htmlFor="consentGiven" className="text-sm">
              I confirm that all information provided is accurate and complete
            </Label>
          </div>
        )}

        {/* Display raw data for debugging (remove in production) */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-500">Debug: Raw Data</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(taxFilingData || displayData, null, 2)}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  )
}
