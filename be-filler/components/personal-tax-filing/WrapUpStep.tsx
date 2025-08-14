"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Cookies from "js-cookie"
import { axiosInstance } from "@/lib/ApiClient"

interface WrapUpStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
}

// API Data Interfaces
interface UserData {
  _id: string
  fullName: string
  email: string
  role: string
  cnic: string
  phone: string
  status: string
  createdAt?: string
  updatedAt?: string
  __v: number
}

interface TaxFilingData {
  user: UserData
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

const TABS = [
  { key: "personal", label: "Personal Information" },
  { key: "income", label: "All income" },
  { key: "taxCredit", label: "Tax credit" },
  { key: "taxDeducted", label: "Tax deducted" },
  { key: "wealth", label: "Wealth statement" },
  { key: "expense", label: "Expense" },
  { key: "apiData", label: "API Data" },
]

function SummaryTabs({
  formData,
  onBack,
  onContinue,
  taxFilingData,
}: {
  formData: any
  onBack: () => void
  onContinue: () => void
  taxFilingData: TaxFilingData | null
}) {
  const [tab, setTab] = useState("personal")

  // Helper to format numbers
  const fmt = (n: any) => (isNaN(Number(n)) ? "" : Number(n).toLocaleString())

  // Personal Info - Use API data if available, otherwise fallback to formData
  const personal = {
    fullName: taxFilingData?.user?.fullName || formData.fullName || "",
    cnic: taxFilingData?.user?.cnic || formData.cnic || "",
    email: taxFilingData?.user?.email || formData.email || "",
    dob: taxFilingData?.personalInfo?.dateOfBirth
      ? new Date(taxFilingData.personalInfo.dateOfBirth).toLocaleDateString()
      : formData.dateOfBirth
        ? typeof formData.dateOfBirth === "string"
          ? formData.dateOfBirth
          : formData.dateOfBirth.toLocaleDateString()
        : "",
    mobile: taxFilingData?.user?.phone || formData.mobile || "",
    occupation: taxFilingData?.personalInfo?.occupation || formData.occupation || "",
    nationality: taxFilingData?.personalInfo?.nationality || formData.nationality || "",
    resident: taxFilingData?.personalInfo?.residentialStatus || formData.residentialStatus || "",
  }

  // Income - Use API data if available, otherwise fallback to formData
  const salaryIncome = taxFilingData?.incomeDetails?.salaryIncome?.annualSalary || formData?.salaryIncome || 0
  const businessIncome = taxFilingData?.incomeDetails?.businessIncome || formData?.businessIncome || 0
  const freelancerIncome = taxFilingData?.incomeDetails?.freelancerIncome?.totalEarnings || formData?.rentalIncome || 0
  const otherIncome = formData?.otherIncome || 0

  // Tax Credit - Use API data
  const taxCredits = taxFilingData?.taxCredits
    ? [
        { type: "Donation", amount: taxFilingData.taxCredits.donationAmount || 0, details: "Charitable contribution" },
        {
          type: "Pension Fund",
          amount: taxFilingData.taxCredits.pensionFundInvestment || 0,
          details: "Investment in pension fund",
        },
        { type: "Tuition Fee", amount: taxFilingData.taxCredits.tuitionFee || 0, details: "Educational expenses" },
      ].filter((tc) => tc.amount > 0)
    : []

  // Tax Deducted - Use API data
  const taxDeducted = taxFilingData?.deductions || {
    bankTransactions: [],
    utilityDeductions: [],
    vehicleDeductions: [],
    otherDeductions: {},
  }

  // Wealth Statement - Use API data if available, otherwise fallback to formData
  const assets = taxFilingData?.wealth?.assets || formData?.wealthStatement?.assets || {}
  const vehicles = assets.vehicleAssets || assets.vehicles || []
  const properties = assets.propertyAssets || assets.properties || []
  const bankAccounts = assets.bankAccountAssets || assets.bankAccounts || []

  // Expense - Use API data if available, otherwise fallback to formData
  const expense = taxFilingData?.liabilitiesAndExpenses?.expenses || formData?.expense || {}

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-12">
      <div className="flex gap-8 justify-center border-b border-gray-300 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`pb-2 text-lg font-medium ${tab === t.key ? "border-b-2 border-red-700 text-red-700" : "text-black hover:text-red-700"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "personal" && (
        <div className="bg-white rounded shadow p-0 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 bg-gray-100" colSpan={2}>
                  PERSONAL INFORMATION
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold px-6 py-2">Full Name</td>
                <td className="px-6 py-2">{personal.fullName || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">CNIC No.</td>
                <td className="px-6 py-2">{personal.cnic || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Email</td>
                <td className="px-6 py-2">{personal.email || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Date of Birth</td>
                <td className="px-6 py-2">{personal.dob || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Mobile No.</td>
                <td className="px-6 py-2">{personal.mobile || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Occupation</td>
                <td className="px-6 py-2">{personal.occupation || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Nationality</td>
                <td className="px-6 py-2">{personal.nationality || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Resident</td>
                <td className="px-6 py-2">{personal.resident || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {tab === "income" && (
        <div className="bg-white rounded shadow p-0 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 bg-gray-100" colSpan={4}>
                  INCOME SOURCES
                </th>
              </tr>
            </thead>
            <tbody>
              {salaryIncome ? (
                <tr>
                  <td className="font-semibold px-6 py-2">Salary</td>
                  <td className="px-6 py-2" colSpan={3}>
                    {fmt(salaryIncome)}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="px-6 py-2" colSpan={4}>
                    No salary data
                  </td>
                </tr>
              )}
              {businessIncome ? (
                <tr>
                  <td className="font-semibold px-6 py-2">Business</td>
                  <td className="px-6 py-2" colSpan={3}>
                    {fmt(businessIncome)}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="px-6 py-2" colSpan={4}>
                    No business data
                  </td>
                </tr>
              )}
              {freelancerIncome ? (
                <tr>
                  <td className="font-semibold px-6 py-2">Freelancer</td>
                  <td className="px-6 py-2" colSpan={3}>
                    {fmt(freelancerIncome)}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="px-6 py-2" colSpan={4}>
                    No freelancer data
                  </td>
                </tr>
              )}
              {otherIncome ? (
                <tr>
                  <td className="font-semibold px-6 py-2">Other</td>
                  <td className="px-6 py-2" colSpan={3}>
                    {fmt(otherIncome)}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="px-6 py-2" colSpan={4}>
                    No other income data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "taxCredit" && (
        <div className="bg-white rounded shadow p-0 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 bg-gray-100" colSpan={3}>
                  TAX CREDIT
                </th>
              </tr>
            </thead>
            <tbody>
              {taxCredits.length === 0 && (
                <tr>
                  <td className="px-6 py-2" colSpan={3}>
                    No tax credits claimed.
                  </td>
                </tr>
              )}
              {taxCredits.map((tc: any, i: number) => (
                <tr key={i}>
                  <td className="font-semibold px-6 py-2">{tc.type}</td>
                  <td className="px-6 py-2">{fmt(tc.amount)}</td>
                  <td className="px-6 py-2">{tc.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "taxDeducted" && (
        <div className="bg-white rounded shadow p-0 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 bg-gray-100" colSpan={4}>
                  TAX DEDUCTED
                </th>
              </tr>
            </thead>
            <tbody>
              {taxDeducted.bankTransactions?.length > 0 && (
                <tr>
                  <td className="font-semibold px-6 py-2">Bank Transactions</td>
                  <td className="px-6 py-2" colSpan={3}>
                    {taxDeducted.bankTransactions
                      .map((b: any, i: number) => `${b.bankName} (${b.accountNumber}): ${fmt(b.taxDeducted)}`)
                      .join(", ")}
                  </td>
                </tr>
              )}
              {taxDeducted.utilityDeductions?.length > 0 && (
                <tr>
                  <td className="font-semibold px-6 py-2">Utilities</td>
                  <td className="px-6 py-2" colSpan={3}>
                    {taxDeducted.utilityDeductions
                      .map((u: any, i: number) => `${u.provider} (${u.consumerNumber}): ${fmt(u.taxDeducted)}`)
                      .join(", ")}
                  </td>
                </tr>
              )}
              {taxDeducted.vehicleDeductions?.length > 0 && (
                <tr>
                  <td className="font-semibold px-6 py-2">Vehicles</td>
                  <td className="px-6 py-2" colSpan={3}>
                    {taxDeducted.vehicleDeductions
                      .map((v: any, i: number) => `${v.registrationNumber}: ${fmt(v.taxDeducted)}`)
                      .join(", ")}
                  </td>
                </tr>
              )}
              {taxDeducted.otherDeductions && Object.keys(taxDeducted.otherDeductions).length > 0 && (
                <tr>
                  <td className="font-semibold px-6 py-2">Other</td>
                  <td className="px-6 py-2" colSpan={3}>
                    {Object.entries(taxDeducted.otherDeductions)
                      .map(([k, v]: any) =>
                        k !== "_id" &&
                        k !== "userId" &&
                        k !== "taxYear" &&
                        k !== "createdAt" &&
                        k !== "updatedAt" &&
                        k !== "__v"
                          ? `${k}: ${fmt(v)}`
                          : null,
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                </tr>
              )}
              {!taxDeducted.bankTransactions?.length &&
                !taxDeducted.utilityDeductions?.length &&
                !taxDeducted.vehicleDeductions?.length &&
                !taxDeducted.otherDeductions && (
                  <tr>
                    <td className="px-6 py-2" colSpan={4}>
                      No tax deducted entries.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "wealth" && (
        <div className="bg-white rounded shadow p-0 overflow-x-auto">
          {vehicles.length > 0 && (
            <table className="min-w-full mb-6">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3 bg-gray-100" colSpan={3}>
                    VEHICLES
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="font-semibold px-6 py-2">VEHICLE TYPE</th>
                  <th className="font-semibold px-6 py-2">REGISTRATION NO.</th>
                  <th className="font-semibold px-6 py-2">COST</th>
                </tr>
                {vehicles.map((v: any, i: number) => (
                  <tr key={i}>
                    <td className="px-6 py-2">{v.vehicleType || "N/A"}</td>
                    <td className="px-6 py-2">{v.registrationNumber || "N/A"}</td>
                    <td className="px-6 py-2">{fmt(v.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {properties.length > 0 && (
            <table className="min-w-full mb-6">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3 bg-gray-100" colSpan={3}>
                    PROPERTIES
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="font-semibold px-6 py-2">TYPE</th>
                  <th className="font-semibold px-6 py-2">LOCATION</th>
                  <th className="font-semibold px-6 py-2">COST</th>
                </tr>
                {properties.map((p: any, i: number) => (
                  <tr key={i}>
                    <td className="px-6 py-2">{p.propertyType || "N/A"}</td>
                    <td className="px-6 py-2">{p.address || "N/A"}</td>
                    <td className="px-6 py-2">{fmt(p.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {bankAccounts.length > 0 && (
            <table className="min-w-full mb-6">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3 bg-gray-100" colSpan={3}>
                    BANK ACCOUNTS
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="font-semibold px-6 py-2">BANK NAME</th>
                  <th className="font-semibold px-6 py-2">ACCOUNT NO.</th>
                  <th className="font-semibold px-6 py-2">BALANCE</th>
                </tr>
                {bankAccounts.map((b: any, i: number) => (
                  <tr key={i}>
                    <td className="px-6 py-2">{b.bankName || "N/A"}</td>
                    <td className="px-6 py-2">{b.accountNumber || "N/A"}</td>
                    <td className="px-6 py-2">{fmt(b.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "expense" && (
        <div className="bg-white rounded shadow p-0 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 bg-gray-100" colSpan={2}>
                  EXPENSES
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold px-6 py-2">Total Household Expenses</td>
                <td className="px-6 py-2">{fmt(expense.totalHouseholdExpense) || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Rent</td>
                <td className="px-6 py-2">{fmt(expense.rent) || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Electricity</td>
                <td className="px-6 py-2">{fmt(expense.electricity) || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Gas</td>
                <td className="px-6 py-2">{fmt(expense.gas) || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Medical</td>
                <td className="px-6 py-2">{fmt(expense.medical) || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Educational</td>
                <td className="px-6 py-2">{fmt(expense.educational) || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {tab === "apiData" && (
        <div className="bg-white rounded shadow p-0 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 bg-gray-100" colSpan={2}>
                  API DATA SUMMARY
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold px-6 py-2">User Data</td>
                <td className="px-6 py-2">
                  {taxFilingData?.user
                    ? `Name: ${taxFilingData.user.fullName}, Email: ${taxFilingData.user.email}, Phone: ${taxFilingData.user.phone}`
                    : "No user data available"}
                </td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Income Sources</td>
                <td className="px-6 py-2">
                  {taxFilingData?.incomeSources?.selectedSources
                    ? taxFilingData.incomeSources.selectedSources.join(", ")
                    : "No income sources"}
                </td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Tax Credits</td>
                <td className="px-6 py-2">
                  {taxFilingData?.taxCredits
                    ? `Donation: ${fmt(taxFilingData.taxCredits.donationAmount)}, Pension Fund: ${fmt(taxFilingData.taxCredits.pensionFundInvestment)}, Tuition Fee: ${fmt(taxFilingData.taxCredits.tuitionFee)}`
                    : "No tax credit data"}
                </td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Assets</td>
                <td className="px-6 py-2">
                  {taxFilingData?.wealth?.assets
                    ? `Properties: ${taxFilingData.wealth.assets.propertyAssets?.length || 0}, Vehicles: ${taxFilingData.wealth.assets.vehicleAssets?.length || 0}, Bank Accounts: ${taxFilingData.wealth.assets.bankAccountAssets?.length || 0}`
                    : "No asset data"}
                </td>
              </tr>
              <tr>
                <td className="font-semibold px-6 py-2">Available Services</td>
                <td className="px-6 py-2">
                  {taxFilingData?.availableServices && taxFilingData.availableServices.length > 0
                    ? taxFilingData.availableServices
                        .map((service, i) => `${service.category}: ${service.services.length} services`)
                        .join(", ")
                    : "No services available"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          className="px-8 py-2 rounded bg-blue-500 text-white font-semibold text-lg shadow hover:bg-blue-600 transition"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="px-8 py-2 rounded bg-red-600 text-white font-semibold text-lg shadow hover:bg-red-700 transition"
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default function WrapUpStep({ formData: initialFormData, handleInputChange }: WrapUpStepProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [showAgreement, setShowAgreement] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showFBR, setShowFBR] = useState(false)
  const [showCNICUpload, setShowCNICUpload] = useState(false)
  const [showFbrCredentials, setShowFbrCredentials] = useState(false)
  const [cnicFiles, setCnicFiles] = useState<(File | null)[]>([null, null])
  const [fbrPassword, setFbrPassword] = useState("")
  const [fbrPin, setFbrPin] = useState("")

  // API Data States
  const [taxFilingData, setTaxFilingData] = useState<TaxFilingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const params = useParams()
  const taxFilingId = params?.id as string

  // Get token and other data from cookies
  const token = Cookies.get("token") || Cookies.get("authToken") || ""
  const userId = Cookies.get("userId") || ""
  const taxYear = Cookies.get("taxYear") || "2024"

  useEffect(() => {
    // Store data in cookies
    if (userId) Cookies.set("userId", userId, { expires: 7 })
    if (taxYear) Cookies.set("taxYear", taxYear, { expires: 7 })
    if (taxFilingId) Cookies.set("taxFilingId", taxFilingId, { expires: 7 })

    // Update formData with the initial data
    setFormData(initialFormData)
  }, [userId, taxYear, taxFilingId, initialFormData])

  // Fetch comprehensive tax filing data
  const fetchTaxFilingData = async () => {
    try {
      setLoading(true)
      setError(null)

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
      setError(err.message || "Failed to fetch tax filing data")
      console.error("Error fetching tax filing data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchTaxFilingData()
  }, [taxYear, token])

  // Calculate wealth reconciliation
  const calculateWealthReconciliation = () => {
    const assets = taxFilingData?.wealth?.assets || formData?.wealthStatement?.assets || {}
    let totalAssets = 0

    // Calculate from API data or formData
    if (assets.propertyAssets)
      totalAssets += assets.propertyAssets.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0)
    if (assets.vehicleAssets)
      totalAssets += assets.vehicleAssets.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0)
    if (assets.bankAccountAssets)
      totalAssets += assets.bankAccountAssets.reduce((sum: number, a: any) => sum + (Number(a.balance) || 0), 0)
    if (assets.cashAsset) totalAssets += Number(assets.cashAsset.balance) || 0

    // Fallback to formData structure
    if (assets.properties)
      totalAssets += assets.properties.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0)
    if (assets.vehicles) totalAssets += assets.vehicles.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0)
    if (assets.bankAccounts)
      totalAssets += assets.bankAccounts.reduce((sum: number, a: any) => sum + (Number(a.balance) || 0), 0)
    if (assets.cash) totalAssets += Number(assets.cash.balance) || 0

    const openingWealth = taxFilingData?.wealth?.openingWealth?.openingWealth || 0
    const totalExpenses = taxFilingData?.liabilitiesAndExpenses?.expenses?.totalHouseholdExpense || 0

    return Math.abs(totalAssets - openingWealth - totalExpenses)
  }

  const difference = calculateWealthReconciliation()

  // Format number with commas
  const fmt = (n: number) => (isNaN(n) ? "0" : n.toLocaleString())

  // Submit handler
  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      // Set authorization header if token exists
      const headers: any = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const payload = {
        taxYear: taxYear,
        filingType: "individual",
        personalInfo: {
          fullName: taxFilingData?.user?.fullName || formData.fullName,
          email: taxFilingData?.user?.email || formData.email,
          cnic: taxFilingData?.user?.cnic || formData.cnic,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality || "Pakistani",
          residentialStatus: formData.residentialStatus || "Resident",
          occupation: formData.occupation,
          family: formData.family || {},
        },
        incomeSources: {
          selectedSources: taxFilingData?.incomeSources?.selectedSources || formData.incomeSources || [],
        },
        incomeDetails: {
          salaryIncome: taxFilingData?.incomeDetails?.salaryIncome || formData.salaryIncome || {},
          freelancerIncome: taxFilingData?.incomeDetails?.freelancerIncome || formData.freelancerIncome || {},
          businessIncome: taxFilingData?.incomeDetails?.businessIncome || formData.businessIncome || {},
        },
        taxCredits: {
          donationAmount: taxFilingData?.taxCredits?.donationAmount || 0,
          pensionFundInvestment: taxFilingData?.taxCredits?.pensionFundInvestment || 0,
          tuitionFee: taxFilingData?.taxCredits?.tuitionFee || 0,
        },
        openingWealth: {
          openingWealth: taxFilingData?.wealth?.openingWealth?.openingWealth || 0,
        },
        assetSelection: taxFilingData?.wealth?.assetSelection || formData.assetSelection || {},
        assetDetails: {
          propertyAssets: taxFilingData?.wealth?.assets?.propertyAssets || [],
          vehicleAssets: taxFilingData?.wealth?.assets?.vehicleAssets || [],
          bankAccountAssets: taxFilingData?.wealth?.assets?.bankAccountAssets || [],
          cashAsset: taxFilingData?.wealth?.assets?.cashAsset || {},
        },
        deductions: {
          bankTransactions: taxFilingData?.deductions?.bankTransactions || [],
          utilityDeductions: taxFilingData?.deductions?.utilityDeductions || [],
          otherDeductions: taxFilingData?.deductions?.otherDeductions || {},
        },
        liabilities: {
          bankLoans: taxFilingData?.liabilitiesAndExpenses?.bankLoans || [],
        },
        expenses: taxFilingData?.liabilitiesAndExpenses?.expenses || {},
        wrapUp: {
          autoAdjustWealth: true,
          termsAccepted: true,
        },
        cart: {
          additionalServices: [],
        },
        checkout: {
          paymentMethod: "bank_transfer",
          paymentStatus: "pending",
          billingAddress: formData.billingAddress || {},
        },
        fbrCredentials: showFbrCredentials ? { fbrPassword, fbrPin } : undefined,
        cnicFiles: cnicFiles.filter((file) => file !== null),
      }

      const response = await axiosInstance.post("/api/tax-filing/comprehensive/submit", payload, { headers })

      if (response.data.success) {
        router.push(`/user-services/personal-tax-filing/${response.data.data.taxFiling.id}/confirmation`)
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit tax filing")
      console.error("Error submitting tax filing:", err)
    } finally {
      setLoading(false)
    }
  }

  // Button handlers
  const handleAutoAdjust = () => {
    setShowAgreement(true)
    const updatedFormData = {
      ...formData,
      wealthStatement: {
        ...formData.wealthStatement,
        assets: {
          ...formData.wealthStatement?.assets,
          cash: {
            balance: (formData.wealthStatement?.assets?.cash?.balance || 0) + difference,
          },
        },
      },
    }
    setFormData(updatedFormData)
    handleInputChange("wealthStatement", updatedFormData.wealthStatement)
  }

  const handleManual = () => setShowAgreement(true)
  const handleBack = () => setShowAgreement(false)
  const handleAgree = () => setShowSummary(true)
  const handleSummaryBack = () => {
    setShowSummary(false)
    setShowAgreement(true)
  }
  const handleSummaryContinue = () => {
    setShowSummary(false)
    setShowFBR(true)
  }
  const handleFBRBack = () => {
    setShowFBR(false)
    setShowSummary(true)
  }
  const handleFBRYes = async () => {
    setShowFBR(false)
    setShowFbrCredentials(true)
  }
  const handleFBRNo = async () => {
    setShowFBR(false)
    setShowCNICUpload(true)
  }
  const handleCNICBack = () => {
    setShowCNICUpload(false)
    setShowFBR(true)
  }
  const handleCNICUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 2)
      setCnicFiles([files[0] || null, files[1] || null])
    }
  }
  const handleCNICContinue = () => {
    handleSubmit()
  }
  const handleFbrCredentialsBack = () => {
    setShowFbrCredentials(false)
    setShowFBR(true)
  }
  const handleFbrCredentialsContinue = () => {
    Cookies.set("fbrPassword", fbrPassword, { expires: 7, secure: true })
    Cookies.set("fbrPin", fbrPin, { expires: 7, secure: true })
    handleSubmit()
  }

  if (showCNICUpload) {
    const bothUploaded = cnicFiles[0] && cnicFiles[1]
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mt-8 mb-2">
          <span className="inline-block mb-2">
            <svg width="60" height="60" fill="none" viewBox="0 0 60 60">
              <rect width="60" height="60" rx="12" fill="#F3F4F6" />
              <g>
                <rect x="18" y="18" width="24" height="24" rx="4" fill="#fff" />
                <rect x="18" y="18" width="24" height="24" rx="4" stroke="#E5E7EB" strokeWidth="2" />
                <rect x="25" y="25" width="10" height="10" rx="2" fill="#E5E7EB" />
                <rect x="25" y="25" width="10" height="10" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                <rect x="28" y="28" width="4" height="4" rx="2" fill="#D1D5DB" />
              </g>
              <rect x="22" y="10" width="16" height="8" rx="2" fill="#ef4444" />
              <text x="30" y="18" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">
                NTN
              </text>
            </svg>
          </span>
        </div>
        <div className="text-2xl font-semibold text-center mb-2">
          {taxFilingData?.user?.fullName || "User"}, please upload your <span className="font-bold">NIC Card</span>
        </div>
        <div className="text-center text-gray-600 mb-2 text-lg">
          We have made the simplest process for NTN registration
        </div>
        <div className="text-center mb-2">
          <a href="#" className="text-red-700 font-semibold underline">
            Already NTN registered?
          </a>
        </div>
        <div className="text-center text-gray-700 mb-6">
          Please upload your CNIC front & back
          <br />
          and the image must be clear.
        </div>
        <label
          className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl px-12 py-6 cursor-pointer shadow mb-8 hover:shadow-lg transition"
          style={{ minWidth: 320 }}
        >
          <span className="mb-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#D1D5DB" />
              <path d="M12 8v8M8 12h8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-xl font-semibold text-gray-800">Click Here To Upload</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleCNICUpload} />
          <div className="mt-2 text-sm text-gray-500">
            {cnicFiles[0] ? cnicFiles[0].name : "CNIC Front"}
            {cnicFiles[1] ? `, ${cnicFiles[1].name}` : ", CNIC Back"}
          </div>
        </label>
        <div className="flex justify-between w-full max-w-lg mt-8">
          <button
            className="px-8 py-2 rounded bg-blue-500 text-white font-semibold text-lg shadow hover:bg-blue-600 transition"
            onClick={handleCNICBack}
          >
            Back
          </button>
          <button
            className="px-8 py-2 rounded bg-red-600 text-white font-semibold text-lg shadow hover:bg-red-700 transition disabled:opacity-50"
            onClick={handleCNICContinue}
            disabled={!bothUploaded}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (showFbrCredentials) {
    const bothFilled = fbrPassword && fbrPin
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mt-8 mb-2">
          <span className="inline-block mb-2">
            <svg width="60" height="60" fill="none" viewBox="0 0 60 60">
              <rect width="60" height="60" rx="12" fill="#F3F4F6" />
              <g>
                <rect x="18" y="18" width="24" height="24" rx="4" fill="#fff" />
                <rect x="18" y="18" width="24" height="24" rx="4" stroke="#E5E7EB" strokeWidth="2" />
                <rect x="25" y="25" width="10" height="10" rx="2" fill="#E5E7EB" />
                <rect x="25" y="25" width="10" height="10" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                <rect x="28" y="28" width="4" height="4" rx="2" fill="#D1D5DB" />
              </g>
              <rect x="22" y="10" width="16" height="8" rx="2" fill="#ef4444" />
              <text x="30" y="18" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">
                NTN
              </text>
            </svg>
          </span>
        </div>
        <div className="text-2xl font-semibold text-center mb-2">
          Please enter your <span className="font-bold">FBR Credential</span>
        </div>
        <div className="text-center text-gray-600 mb-2 text-lg">
          We ensure your information is secure that is why it is encrypted
        </div>
        <div className="text-center mb-4">
          <a href="#" className="text-red-700 font-semibold underline">
            Register new NTN?
          </a>
        </div>
        <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto mb-8">
          <input
            type="password"
            placeholder="FBR Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            value={fbrPassword}
            onChange={(e) => setFbrPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="FBR PIN"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            value={fbrPin}
            onChange={(e) => setFbrPin(e.target.value)}
          />
        </div>
        <div className="flex justify-between w-full max-w-lg mt-8">
          <button
            className="px-8 py-2 rounded bg-blue-500 text-white font-semibold text-lg shadow hover:bg-blue-600 transition"
            onClick={handleFbrCredentialsBack}
          >
            Back
          </button>
          <button
            className="px-8 py-2 rounded bg-red-600 text-white font-semibold text-lg shadow hover:bg-red-700 transition disabled:opacity-50"
            onClick={handleFbrCredentialsContinue}
            disabled={!bothFilled}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (showFBR) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-3xl font-semibold text-center mb-2 mt-8">
          Already registered a <span className="font-bold">NTN</span>
        </div>
        <div className="text-center text-gray-600 mb-8 text-lg max-w-xl">
          NTN is a unique ID issued by Federal board of Revenue (FBR)
          <br />
          without NTN you cannot file your tax returns
        </div>
        <div className="flex gap-8 mb-8">
          <button
            className="flex flex-col items-center justify-center px-10 py-6 rounded-lg bg-white border border-gray-200 shadow hover:shadow-lg transition"
            onClick={handleFBRYes}
          >
            <span className="rounded-full bg-green-500 text-white p-2 mb-2">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#22c55e" />
                <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-xl font-semibold text-green-700">Yes</span>
          </button>
          <button
            className="flex flex-col items-center justify-center px-10 py-6 rounded-lg bg-white border border-gray-200 shadow hover:shadow-lg transition"
            onClick={handleFBRNo}
          >
            <span className="rounded-full bg-red-600 text-white p-2 mb-2">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#ef4444" />
                <path
                  d="M15 9l-6 6M9 9l6 6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-xl font-semibold text-red-700">No</span>
          </button>
        </div>
        <button
          className="px-8 py-2 rounded bg-blue-500 text-white font-semibold text-lg shadow hover:bg-blue-600 transition"
          onClick={handleFBRBack}
        >
          Back
        </button>
      </div>
    )
  }

  if (showSummary) {
    return (
      <div>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-2">Loading API data...</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        <SummaryTabs
          formData={formData}
          onBack={handleSummaryBack}
          onContinue={handleSummaryContinue}
          taxFilingData={taxFilingData}
        />
      </div>
    )
  }

  if (showAgreement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-2xl font-semibold text-center mb-2 mt-8">
          Terms of our <span className="font-bold">Engagement</span>
        </div>
        <div className="text-center text-gray-500 mb-6">
          Transparency is important to us, and that's why we're asking for your approval
        </div>
        <div className="bg-gray-100 rounded-lg p-8 max-w-2xl w-full mx-auto mb-8 text-left shadow">
          <h2 className="text-2xl font-bold mb-4">GENERAL PAYMENT TERMS</h2>
          <p className="mb-2">
            <b>Payment Due at Time of Order; Non-Refundable:</b>
            <br />
            You agree to pay all amounts due for Services at the time you order them. All amounts are non-refundable
            unless otherwise specified in the Refund Policy. You acknowledge and agree that the Site is an online
            platform enabling you to access our services at any time from any location using a payment method of your
            choice, at the prices indicated.
          </p>
          <p className="mb-2">
            <b>Refunds Issued:</b>
            <br />
            You agree that Pakfiler's issuance of a refund receipt is only confirmation that Pakfiler has processed your
            refund via the charged Payment Method. Pakfiler does not control when the refund will be applied to your
            Payment Method's available balance. You further acknowledge that the payment provider or the issuing bank of
            your Payment Method determines the timing for posting your refund. Refund processing times may vary from
            five (5) business days to a full billing cycle, or longer.
          </p>
          <p className="mb-2">
            In cases where a refund is issued to your Payment Method and the payment provider, processor, or issuing
            bank imposes limitations on refunds—including, but not limited to, timing or the number of allowable
            refunds—Pakfiler reserves the right to issue refunds in the form of: (i) store credit; (ii) a Pakfiler check
            mailed to the address on file for your Account; or (iii) a bank transfer, if the payment cannot be refunded
            back to the Payment Method. Pakfiler also reserves the right to offer in-store credit for refunds.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">REFUND POLICY</h2>
          <p className="mb-2">
            <b>
              Services purchased from Pakfiler.com are refundable only if canceled within the specified refund period
              below.
            </b>
          </p>
          <p className="mb-2">
            <b>Date of Transaction:</b> Refers to the date any service was purchased, adhering to the terms and
            conditions of the specific service.
          </p>
          <p className="mb-2">
            <b>Refund Period:</b> A service may be canceled at any time, but a refund will only be issued if the
            cancellation is made within the refund period specific to the service and is requested through Pakfiler's
            customer service.
          </p>
          <p className="mb-2">
            <b>Standard Refund Terms:</b>
            <br />
            <b>NTN Registration:</b> Before 48 hours of case submission or completion of e-enrollment / registration of
            NTN, whichever comes first.
            <br />
            <b>Tax Filing:</b> Before 48 hours of case submission or filing of the tax return, whichever comes first.
            <br />
            <b>Other Services:</b> Before 48 hours of case submission or successful completion of the service, whichever
            comes first.
          </p>
        </div>
        <div className="flex gap-8 mt-4">
          <button
            className="px-8 py-2 rounded bg-blue-500 text-white font-semibold text-lg shadow hover:bg-blue-600 transition"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className="px-8 py-2 rounded bg-red-600 text-white font-semibold text-lg shadow hover:bg-red-700 transition"
            onClick={handleAgree}
          >
            Agree
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-2xl font-semibold text-center mb-2 mt-8">
        It seems that there's a difference in your wealth reconciliation
      </div>
      <div className="text-4xl font-bold text-red-700 mb-4">Rs. {fmt(difference)}</div>
      <div className="text-center mb-4">
        Can we auto adjust the difference with your opening wealth to reconcile the{" "}
        <span className="font-semibold underline">wealth statement</span>
      </div>
      <div className="flex gap-6 mt-4">
        <button
          className="flex items-center gap-2 px-6 py-4 rounded-lg bg-green-500 text-white font-semibold text-lg shadow hover:bg-green-600 transition"
          onClick={handleAutoAdjust}
        >
          <span className="rounded-full bg-white text-green-500 p-1">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#22c55e" />
              <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Auto Adjust In Opening Wealth
        </button>
        <button
          className="flex items-center gap-2 px-6 py-4 rounded-lg bg-red-600 text-white font-semibold text-lg shadow hover:bg-red-700 transition"
          onClick={handleManual}
        >
          <span className="rounded-full bg-white text-red-500 p-1">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#ef4444" />
              <path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          I Will Adjust It Myself
        </button>
      </div>
    </div>
  )
}
