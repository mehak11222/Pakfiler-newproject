"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Info,
  Store,
  UserIcon,
  Truck,
  Car,
  ArrowDownCircle,
  ArrowUpCircle,
  Gavel,
  Calculator,
  Ruler,
  Book,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

interface IncomeDetailsStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
}

export function IncomeDetailsStep({ formData, handleInputChange }: IncomeDetailsStepProps) {
  const [currentIncomeIndex, setCurrentIncomeIndex] = useState(0)
  const params = useParams()
  const filingId = params?.id as string
  const [savingStates, setSavingStates] = useState<{ [key: string]: boolean }>({})

  // Advanced section toggle state per income source
  const [showAdvanced, setShowAdvanced] = useState<{ [key: string]: boolean }>({})
  const [selectedProfessionalTypes, setSelectedProfessionalTypes] = useState<string[]>([])

  // Business type multi-select state
  const businessTypes = [
    { key: "trader", label: "Trader/Shop", icon: Store },
    { key: "dealer", label: "Dealers", icon: UserIcon },
    { key: "wholesaler", label: "Wholesalers/Supplier", icon: Truck },
    { key: "manufacturer", label: "Manufacturers", icon: Car },
    { key: "importer", label: "Imports", icon: ArrowDownCircle },
    { key: "exporter", label: "Exports", icon: ArrowUpCircle },
  ]

  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([])

  // Freelancer state
  const [freelanceAbroad, setFreelanceAbroad] = useState<null | boolean>(null)

  const formatCurrency = (value: string | number) => {
    if (!value) return ""
    const stringValue = typeof value === "number" ? value.toString() : value
    const numericValue = stringValue.replace(/[^\d]/g, "")
    return numericValue ? Number.parseInt(numericValue).toLocaleString() : ""
  }

  const handleCurrencyInput = (field: string, value: string) => {
    const numericValue = value.replace(/[^\d]/g, "")
    return numericValue
  }

  // API Integration Functions
  const saveIncomeData = async (sourceId: string, data: any) => {
    try {
      setSavingStates((prev) => ({ ...prev, [sourceId]: true }))

      const apiData = {
        userId: "64fd06ddc7a225c86e8f2345", // You might want to get this from context/props
        taxYear: "2024-2025",
        ...data,
      }

      let response
      let url = ""
      let body = {}

      switch (sourceId) {
        case "salary":
          url = "http://localhost:5000/api/income/salary-income"
          body = {
            ...apiData,
            annualSalary: Number.parseInt(data.annualSalary || "0"),
            taxDeducted: Number.parseInt(data.taxDeducted || "0"),
            taDaReceived: data.taDa || false,
            medicalProvided: data.medicalTreatment || false,
            providentFund: data.providentFund || false,
            vehicleProvided: data.vehicleProvided || false,
            vehicleAfterJune2020: data.receivedVehicleAfterJune2020 || false,
            vehicleCost: Number.parseInt(data.vehicleCostAmount || "0"),
            otherAllowances: data.otherAllowances || false,
            gratuityFundWithdrawal: data.recognizedFundWithdrawal || false,
            taxBorneByEmployer: data.taxBorneByEmployer || false,
          }
          break

        case "business":
          url = "http://localhost:5000/api/income/business-income"
          body = {
            ...apiData,
            businessTypes: selectedBusinessTypes.map((type) => {
              const businessType = businessTypes.find((bt) => bt.key === type)
              return businessType ? businessType.label : type
            }),
          }
          break

        case "professional":
          if (selectedProfessionalTypes.length > 0) {
            url = "http://localhost:5000/api/income/professional-services-income"
            body = {
              ...apiData,
              professionType: selectedProfessionalTypes[0],
              amount: Number.parseInt(data.professionalIncome || "0"),
              expenses: Number.parseInt(data.professionalExpenses || "0"),
              taxPaid: Number.parseInt(data.professionalTaxPaid || "0"),
            }
          }
          break

        case "freelancer":
          url = "http://localhost:5000/api/income/freelancer-income"
          body = {
            ...apiData,
            totalEarnings: Number.parseInt(data.freelanceRevenue || "0"),
            expenses: Number.parseInt(data.freelanceDirectExpense || "0"),
            netIncome:
              Number.parseInt(data.freelanceRevenue || "0") - Number.parseInt(data.freelanceDirectExpense || "0"),
            taxPaid: Number.parseInt(data.freelanceTaxDeducted || "0"),
            fromAbroad: freelanceAbroad || false,
          }
          break

        case "partnership":
          if (data.partnershipEntries && Array.isArray(data.partnershipEntries) && data.partnershipEntries.length > 0) {
            url = "http://localhost:5000/api/income/partnership-income"
            body = {
              ...apiData,
              partnerships: data.partnershipEntries.map((entry: any) => ({
                name: entry?.name || "",
                annualIncome: Number.parseInt(entry?.income || "0"),
                sharePercentage: Number.parseInt(entry?.share || "0"),
              })),
            }
          }
          break

        case "commission":
          url = "http://localhost:5000/api/income/commission-service-income"
          body = {
            ...apiData,
            lifeInsuranceAgent: Number.parseInt(data.lifeInsuranceAmount || "0"),
            generalInsuranceAgent: Number.parseInt(data.generalInsuranceAmount || "0"),
            realEstateAgent: Number.parseInt(data.realEstateTravelAmount || "0"),
            servicesConsultancy: Number.parseInt(data.servicesConsultancyAmount || "0"),
            otherCommissions: Number.parseInt(data.otherCommissionsAmount || "0"),
          }
          break

        case "agriculture":
          url = "http://localhost:5000/api/income/agriculture-income"
          body = {
            ...apiData,
            annualIncome: Number.parseInt(data.agricultureIncome || "0"),
          }
          break

        case "property":
          if (
            data.propertySaleEntries &&
            Array.isArray(data.propertySaleEntries) &&
            data.propertySaleEntries.length > 0
          ) {
            url = "http://localhost:5000/api/income/property-sale-income"
            body = {
              ...apiData,
              propertySales: data.propertySaleEntries.map((entry: any) => ({
                location: entry?.address || "",
                saleAmount: Number.parseInt(entry?.salePrice || "0"),
                purchaseAmount: Number.parseInt(entry?.purchasePrice || "0"),
                gain: entry?.gain || 0,
                taxPaid: 0,
              })),
            }
          }
          break

        case "savings":
          url = "http://localhost:5000/api/income/profit-on-savings"
          body = {
            ...apiData,
            bankDeposit: Number.parseInt(data.bankDepositProfit || "0"),
            govtScheme: Number.parseInt(data.govtSchemeProfit || "0"),
            behbood: Number.parseInt(data.behboodProfit || "0"),
            pensionerBenefit: Number.parseInt(data.pensionerBenefitProfit || "0"),
          }
          break

        case "dividend":
        case "dividendGain":
          url = "http://localhost:5000/api/income/dividend-income"
          body = {
            ...apiData,
            dividend:
              Number.parseInt(data.dividendPowerAmount || "0") +
              Number.parseInt(data.dividendOtherAmount || "0") +
              Number.parseInt(data.dividendNoTaxAmount || "0"),
            capitalGain: Number.parseInt(data.capitalGainNet || "0"),
            bonus: Number.parseInt(data.bonusShareValue || "0"),
          }
          break

        default:
          console.log(`No API integration for ${sourceId}`)
          return
      }

      if (url) {
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        if (response) {
          const result = await response.json()
          if (response.ok) {
            console.log(`${sourceId} income saved successfully:`, result)
          } else {
            console.error(`Error saving ${sourceId} income:`, result)
          }
        }
      }
    } catch (error) {
      console.error(`Error saving ${sourceId} income:`, error)
    } finally {
      setSavingStates((prev) => ({ ...prev, [sourceId]: false }))
    }
  }

  // Initialize component without API calls
  useEffect(() => {
    console.log("IncomeDetailsStep initialized with formData:", formData)
  }, [formData])

  const incomeSourcesMap = {
    salary: "Salary Income",
    business: "Business/Self Employed",
    freelancer: "Freelancer",
    professional: "Professional Services",
    pension: "Pension",
    agriculture: "Agriculture",
    commission: "Commission/Service",
    partnership: "Partnership/AOP",
    property: "Rent/Property Sale",
    savings: "Profit on Savings",
    dividend: "Dividend/Capital Gain",
    other: "Other Income",
    profitOnSavings: "Profit on Savings",
    otherIncome: "Other Income",
    profit_savings: "Profit on Savings",
    other_income: "Other Income",
    rent: "Rent",
    propertySale: "Property Sale",
    dividendGain: "Dividend/Capital Gain",
  }

  const selectedIncomeSources = Array.isArray(formData?.incomeSources) ? formData.incomeSources : []
  const currentSourceId = selectedIncomeSources[currentIncomeIndex]
  const currentSourceTitle =
    incomeSourcesMap[currentSourceId as keyof typeof incomeSourcesMap] || "Unknown Income Source"

  const getIncomeDetails = (type: string) => {
    // Get details from formData with safe fallbacks
    const incomes = Array.isArray(formData?.incomes) ? formData.incomes : []
    const income = incomes.find((inc: any) => inc?.type === type)

    return {
      details: income?.details || {},
      businessEntries: income?.businessEntries || [],
      otherIncomeInflows: income?.otherIncomeInflows || [],
    }
  }

  const updateIncomeDetails = (type: string, field: string | Record<string, any>, value?: any) => {
    const incomes = Array.isArray(formData?.incomes) ? [...formData.incomes] : []
    const incomeIndex = incomes.findIndex((inc: any) => inc?.type === type)

    if (typeof field === "object") {
      // Handle batch updates
      const newDetails = { ...(field.details || {}) }
      const newBusinessEntries = field.businessEntries || []
      const newOtherIncomeInflows = field.otherIncomeInflows || []

      if (incomeIndex === -1) {
        incomes.push({
          type,
          details: newDetails,
          businessEntries: newBusinessEntries,
          otherIncomeInflows: newOtherIncomeInflows,
        })
      } else {
        incomes[incomeIndex] = {
          ...incomes[incomeIndex],
          details: { ...incomes[incomeIndex].details, ...newDetails },
          businessEntries: newBusinessEntries,
          otherIncomeInflows: newOtherIncomeInflows,
        }
      }
    } else if (field === "businessEntries" || field === "otherIncomeInflows") {
      // Handle direct array updates
      if (incomeIndex === -1) {
        incomes.push({
          type,
          details: {},
          businessEntries: field === "businessEntries" ? value : [],
          otherIncomeInflows: field === "otherIncomeInflows" ? value : [],
        })
      } else {
        incomes[incomeIndex] = {
          ...incomes[incomeIndex],
          businessEntries: field === "businessEntries" ? value : incomes[incomeIndex].businessEntries || [],
          otherIncomeInflows: field === "otherIncomeInflows" ? value : incomes[incomeIndex].otherIncomeInflows || [],
        }
      }
    } else {
      // Single field update
      if (incomeIndex === -1) {
        incomes.push({
          type,
          details: { [field]: value },
          businessEntries: [],
          otherIncomeInflows: [],
        })
      } else {
        incomes[incomeIndex] = {
          ...incomes[incomeIndex],
          details: { ...incomes[incomeIndex].details, [field]: value },
          businessEntries: incomes[incomeIndex].businessEntries || [],
          otherIncomeInflows: incomes[incomeIndex].otherIncomeInflows || [],
        }
      }
    }

    handleInputChange("incomes", incomes)

    // Sync top-level fields for sidebar
    if (type === "salary" && (field === "annualSalary" || (typeof field === "object" && field.details?.annualSalary))) {
      const v = typeof field === "object" ? field.details.annualSalary : value
      handleInputChange("salaryIncome", v)
    }
    if (
      type === "business" &&
      (field === "businessIncome" || (typeof field === "object" && field.details?.businessIncome))
    ) {
      const v = typeof field === "object" ? field.details.businessIncome : value
      handleInputChange("businessIncome", v)
    }
    if (
      type === "property" &&
      (field === "rentalIncome" || (typeof field === "object" && field.details?.rentalIncome))
    ) {
      const v = typeof field === "object" ? field.details.rentalIncome : value
      handleInputChange("rentalIncome", v)
    }
    if (type === "other" && (field === "otherIncome" || (typeof field === "object" && field.details?.otherIncome))) {
      const v = typeof field === "object" ? field.details.otherIncome : value
      handleInputChange("otherIncome", v)
    }
  }

  const isIncomeSourceCompleted = (sourceId: string) => {
    const { details, businessEntries, otherIncomeInflows } = getIncomeDetails(sourceId)

    switch (sourceId) {
      case "salary":
        return !!(details?.annualSalary && details?.taxDeducted)
      case "business":
        return !!(businessEntries && businessEntries.length > 0) || selectedBusinessTypes.length > 0
      case "freelancer":
        return !!details?.freelanceRevenue
      case "professional":
        return !!(details?.professionalIncome && selectedProfessionalTypes.length > 0)
      case "pension":
        return !!details?.pensionIncome
      case "agriculture":
        return !!details?.agricultureIncome
      case "commission":
        return !!(
          details?.lifeInsuranceAmount ||
          details?.generalInsuranceAmount ||
          details?.realEstateTravelAmount ||
          details?.servicesConsultancyAmount ||
          details?.otherCommissionsAmount
        )
      case "partnership":
        return !!(details?.partnershipIncome && details?.partnershipName)
      case "property":
        return !!(
          (details.propertyRentEntries && details.propertyRentEntries.length > 0) ||
          (details.propertySaleEntries && details.propertySaleEntries.length > 0)
        )
      case "savings":
        return !!details?.savingsIncome
      case "dividend":
        return !!(details?.dividendIncome || details?.capitalGain)
      case "other":
        return !!(otherIncomeInflows && otherIncomeInflows.length > 0)
      default:
        return false
    }
  }

  const handlePreviousIncome = () => {
    if (currentIncomeIndex > 0) {
      setCurrentIncomeIndex(currentIncomeIndex - 1)
    }
  }

  const handleNextIncome = async () => {
    // Save current income data before moving to next
    const currentSourceId = selectedIncomeSources[currentIncomeIndex]
    const { details } = getIncomeDetails(currentSourceId)
    await saveIncomeData(currentSourceId, details)

    if (currentIncomeIndex < selectedIncomeSources.length - 1) {
      setCurrentIncomeIndex(currentIncomeIndex + 1)
    }
  }

  const handleIncomeNavigation = (index: number) => {
    setCurrentIncomeIndex(index)
  }

  const renderIncomeSection = (sourceId: string, title: string) => {
    const { details } = getIncomeDetails(sourceId)

    switch (sourceId) {
      case "salary":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryIncome">Annual Salary (PKR)</Label>
                <Input
                  id="salaryIncome"
                  value={formatCurrency(details?.annualSalary || "")}
                  onChange={(e) =>
                    updateIncomeDetails(sourceId, "annualSalary", handleCurrencyInput("annualSalary", e.target.value))
                  }
                  placeholder="Enter annual salary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxDeducted">Tax Deducted by Employer (PKR)</Label>
                <Input
                  id="taxDeducted"
                  value={formatCurrency(details?.taxDeducted || "")}
                  onChange={(e) =>
                    updateIncomeDetails(sourceId, "taxDeducted", handleCurrencyInput("taxDeducted", e.target.value))
                  }
                  placeholder="Enter tax deducted"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="text-sm font-medium text-green-600 underline focus:outline-none"
                onClick={() => setShowAdvanced((prev) => ({ ...prev, [sourceId]: !prev[sourceId] }))}
              >
                {showAdvanced[sourceId] ? "Hide Advanced" : "Show Advanced"}
              </button>
            </div>

            {showAdvanced[sourceId] && (
              <div className="mt-4 space-y-4">
                <div className="font-medium mb-2">
                  As per your taxable salary, the tax deduction is calculated as follows:
                </div>
                {[
                  {
                    key: "taDa",
                    label: "Did you receive any T.A/D.A or per diem?",
                    amountKey: "taDaAmount",
                  },
                  {
                    key: "medicalTreatment",
                    label: "Are you provided free of cost medical treatment or hospitalization by your employer?",
                    amountKey: "medicalTreatmentAmount",
                  },
                  {
                    key: "providentFund",
                    label: "Has your employer established a recognized provident fund?",
                    amountKey: "providentFundAmount",
                  },
                  {
                    key: "vehicleProvided",
                    label: "Are you provided with vehicle by your employer?",
                    amountKey: "vehicleProvidedAmount",
                  },
                  {
                    key: "receivedVehicleAfterJune2020",
                    label: "Did you receive the vehicle after June 2020?",
                    amountKey: null,
                  },
                  {
                    key: "vehicleCost",
                    label: (
                      <span>
                        What is the cost of vehicle provided by your employer?{" "}
                        <Info
                          className="inline h-4 w-4 text-gray-500"
                          aria-label="Cost of vehicle as per employer's records."
                        />
                      </span>
                    ),
                    amountKey: "vehicleCostAmount",
                  },
                  {
                    key: "otherAllowances",
                    label: "Any other allowances / benefits including bonus received during the year?",
                    amountKey: "otherAllowancesAmount",
                  },
                  {
                    key: "recognizedFundWithdrawal",
                    label: (
                      <span>
                        Did you receive any amount from a recognized provident/gratuity fund on account of permanent
                        withdrawal of funds?{" "}
                        <Info
                          className="inline h-4 w-4 text-gray-500"
                          aria-label="Permanent withdrawal means you left the job or retired and withdrew the full amount."
                        />
                      </span>
                    ),
                    amountKey: "recognizedFundWithdrawalAmount",
                  },
                  {
                    key: "taxBorneByEmployer",
                    label: "Is the tax on your salary borne by your employer?",
                    amountKey: null,
                  },
                ].map((q) => (
                  <div key={q.key} className="flex items-center gap-4 border-b pb-2">
                    <span className="text-sm flex-1">{q.label}</span>
                    <div className="flex gap-2 items-center">
                      <Button
                        type="button"
                        variant={details?.[q.key] === false ? "default" : "outline"}
                        className={details?.[q.key] === false ? "bg-gray-300 text-black" : ""}
                        onClick={() => {
                          updateIncomeDetails(sourceId, q.key, false)
                          if (q.amountKey) updateIncomeDetails(sourceId, q.amountKey, "")
                        }}
                      >
                        NO
                      </Button>
                      <Button
                        type="button"
                        variant={details?.[q.key] === true ? "default" : "outline"}
                        className={details?.[q.key] === true ? "bg-green-600 text-white" : ""}
                        onClick={() => updateIncomeDetails(sourceId, q.key, true)}
                      >
                        YES
                      </Button>
                      {q.amountKey && details?.[q.key] === true && (
                        <Input
                          type="text"
                          placeholder="Enter amount here"
                          className="ml-2 w-40"
                          value={details?.[q.amountKey] || ""}
                          onChange={(e) =>
                            updateIncomeDetails(sourceId, q.amountKey, handleCurrencyInput(q.amountKey, e.target.value))
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => saveIncomeData(sourceId, details)}
                disabled={savingStates[sourceId]}
                className="bg-green-600 hover:bg-green-700"
              >
                {savingStates[sourceId] ? "Saving..." : "Save Salary Income"}
              </Button>
            </div>
          </div>
        )

      case "business":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h4 className="font-medium mb-4 text-blue-900">Select Your Business Types</h4>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-hide">
                {businessTypes.map((type) => {
                  const Icon = type.icon
                  const selected = selectedBusinessTypes.includes(type.key)
                  return (
                    <button
                      key={type.key}
                      type="button"
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 m-2 bg-white shadow-sm ${selected ? "border-[#15803d] bg-[#15803d]/10" : "border-gray-200 hover:bg-gray-50"}`}
                      onClick={() => {
                        setSelectedBusinessTypes((prev) =>
                          prev.includes(type.key) ? prev.filter((k) => k !== type.key) : [...prev, type.key],
                        )
                      }}
                    >
                      <Icon className="h-10 w-10 mb-2" />
                      <span className="text-base font-medium text-center break-words whitespace-pre-line">
                        {type.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
            {selectedBusinessTypes.length === 0 && (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm">No business type selected</div>
                  <div className="text-xs">Select at least one business type above</div>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => saveIncomeData(sourceId, { businessTypes: selectedBusinessTypes })}
                disabled={savingStates[sourceId] || selectedBusinessTypes.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {savingStates[sourceId] ? "Saving..." : "Save Business Types"}
              </Button>
            </div>
          </div>
        )

      case "professional":
        const professionalTypes = [
          { key: "doctor", label: "Doctor", icon: Plus },
          { key: "lawyer", label: "Lawyer", icon: Gavel },
          { key: "accountant", label: "Accountant", icon: Calculator },
          { key: "engineer", label: "Engineer/Architect", icon: Ruler },
          { key: "tutor", label: "Tutor/Trainer/Coach", icon: Book },
          { key: "consultant", label: "Management Consultant", icon: UserIcon },
          { key: "other", label: "Other Professionals", icon: CheckCircle2 },
        ]

        return (
          <div className="space-y-8">
            <div className="text-center mt-4">
              <h2 className="text-4xl font-semibold mb-2">Select your profession service</h2>
              <div className="mb-6">
                <span className="font-bold underline text-green-600 cursor-pointer text-xl">
                  Need further clarification on the category? Click here
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-hide">
                {professionalTypes.map((type) => {
                  const Icon = type.icon
                  const selected = selectedProfessionalTypes.includes(type.key)
                  return (
                    <button
                      key={type.key}
                      type="button"
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 m-2 bg-white shadow-sm ${selected ? "border-[#15803d] bg-[#15803d]/10" : "border-gray-200 hover:bg-gray-50"}`}
                      onClick={() => {
                        setSelectedProfessionalTypes((prev) =>
                          prev.includes(type.key) ? prev.filter((k) => k !== type.key) : [...prev, type.key],
                        )
                      }}
                    >
                      <Icon className="h-10 w-10 mb-2" />
                      <span className="text-base font-medium text-center break-words whitespace-pre-line">
                        {type.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
            {selectedProfessionalTypes.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Professional Income (PKR)</Label>
                    <Input
                      value={formatCurrency(details?.professionalIncome || "")}
                      onChange={(e) =>
                        updateIncomeDetails(
                          sourceId,
                          "professionalIncome",
                          handleCurrencyInput("professionalIncome", e.target.value),
                        )
                      }
                      placeholder="Enter professional income"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Professional Expenses (PKR)</Label>
                    <Input
                      value={formatCurrency(details?.professionalExpenses || "")}
                      onChange={(e) =>
                        updateIncomeDetails(
                          sourceId,
                          "professionalExpenses",
                          handleCurrencyInput("professionalExpenses", e.target.value),
                        )
                      }
                      placeholder="Enter professional expenses"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Paid (PKR)</Label>
                    <Input
                      value={formatCurrency(details?.professionalTaxPaid || "")}
                      onChange={(e) =>
                        updateIncomeDetails(
                          sourceId,
                          "professionalTaxPaid",
                          handleCurrencyInput("professionalTaxPaid", e.target.value),
                        )
                      }
                      placeholder="Enter tax paid"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => saveIncomeData(sourceId, details)}
                    disabled={savingStates[sourceId]}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {savingStates[sourceId] ? "Saving..." : "Save Professional Income"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )

      case "freelancer":
        return (
          <div className="space-y-6">
            {freelanceAbroad === null && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Did you earn any income from abroad by providing
                  <br />
                  <span className="text-3xl">IT-enabled services</span>
                </h2>
                <div className="mb-4">
                  <span className="font-semibold underline text-green-600 cursor-pointer">
                    Need further clarification on the category? Click here
                  </span>
                </div>
                <div className="flex justify-center gap-8 mt-8">
                  <Button
                    type="button"
                    variant={freelanceAbroad === true ? "default" : "outline"}
                    className="flex flex-col items-center px-8 py-6 text-xl"
                    onClick={() => setFreelanceAbroad(true)}
                  >
                    <span className="text-green-600 text-4xl mb-2">✔</span> Yes
                  </Button>
                  <Button
                    type="button"
                    variant={freelanceAbroad === false ? "destructive" : "outline"}
                    className="flex flex-col items-center px-8 py-6 text-xl"
                    onClick={() => setFreelanceAbroad(false)}
                  >
                    <span className="text-green-600 text-4xl mb-2">✖</span> No
                  </Button>
                </div>
              </div>
            )}
            {freelanceAbroad !== null && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Total Earnings (PKR)</Label>
                    <Input
                      value={formatCurrency(details?.freelanceRevenue || "")}
                      onChange={(e) =>
                        updateIncomeDetails(
                          sourceId,
                          "freelanceRevenue",
                          handleCurrencyInput("freelanceRevenue", e.target.value),
                        )
                      }
                      placeholder="Enter total earnings"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expenses (PKR)</Label>
                    <Input
                      value={formatCurrency(details?.freelanceDirectExpense || "")}
                      onChange={(e) =>
                        updateIncomeDetails(
                          sourceId,
                          "freelanceDirectExpense",
                          handleCurrencyInput("freelanceDirectExpense", e.target.value),
                        )
                      }
                      placeholder="Enter expenses"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Paid (PKR)</Label>
                    <Input
                      value={formatCurrency(details?.freelanceTaxDeducted || "")}
                      onChange={(e) =>
                        updateIncomeDetails(
                          sourceId,
                          "freelanceTaxDeducted",
                          handleCurrencyInput("freelanceTaxDeducted", e.target.value),
                        )
                      }
                      placeholder="Enter tax paid"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => saveIncomeData(sourceId, details)}
                    disabled={savingStates[sourceId]}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {savingStates[sourceId] ? "Saving..." : "Save Freelancer Income"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>Income section for {title} is not yet implemented.</p>
            <div className="mt-4">
              <Button
                onClick={() => saveIncomeData(sourceId, {})}
                disabled={savingStates[sourceId]}
                className="bg-green-600 hover:bg-green-700"
              >
                {savingStates[sourceId] ? "Saving..." : `Save ${title}`}
              </Button>
            </div>
          </div>
        )
    }
  }

  if (!selectedIncomeSources || selectedIncomeSources.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No income sources selected. Please go back to Step 3 to select your income sources.</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      <div className="w-80 flex-shrink-0">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-lg">Income Sources Progress</CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedIncomeSources.length} source{selectedIncomeSources.length > 1 ? "s" : ""} selected
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedIncomeSources.map((sourceId: string, index: number) => {
              const isCompleted = isIncomeSourceCompleted(sourceId)
              const isCurrent = index === currentIncomeIndex
              const sourceTitle = incomeSourcesMap[sourceId as keyof typeof incomeSourcesMap] || "Unknown Source"
              return (
                <div
                  key={sourceId}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isCurrent
                      ? "border-[#af0e0e] bg-[#af0e0e]/5"
                      : isCompleted
                        ? "border-green-500 bg-green-50 hover:bg-green-100"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleIncomeNavigation(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isCurrent
                            ? "bg-[#af0e0e] text-white"
                            : isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {isCompleted && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                      </div>
                      <div>
                        <div className={`font-medium text-sm ${isCurrent ? "text-[#af0e0e]" : ""}`}>{sourceTitle}</div>
                        <div className="text-xs text-muted-foreground">{isCompleted ? "Completed" : "Pending"}</div>
                      </div>
                    </div>
                    {isCurrent && <Badge variant="outline">Current</Badge>}
                  </div>
                </div>
              )
            })}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium">
                  {selectedIncomeSources.filter((sourceId: string) => isIncomeSourceCompleted(sourceId)).length} of{" "}
                  {selectedIncomeSources.length} completed
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#af0e0e] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (selectedIncomeSources.filter((sourceId: string) => isIncomeSourceCompleted(sourceId)).length /
                        selectedIncomeSources.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{currentSourceTitle}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Step {currentIncomeIndex + 1} of {selectedIncomeSources.length}
                </p>
              </div>
              <Badge variant="outline">{isIncomeSourceCompleted(currentSourceId) ? "Completed" : "In Progress"}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {renderIncomeSection(currentSourceId, currentSourceTitle)}
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousIncome}
                disabled={currentIncomeIndex === 0}
                className="flex items-center bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Income
              </Button>
              <Button
                variant="outline"
                onClick={handleNextIncome}
                disabled={currentIncomeIndex === selectedIncomeSources.length - 1}
                className="flex items-center bg-transparent"
              >
                Next Income
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
