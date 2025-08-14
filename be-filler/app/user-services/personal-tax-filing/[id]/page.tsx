"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { TaxYearStep } from "@/components/personal-tax-filing/tax-year-step"
import { PersonalInfoStep } from "@/components/personal-tax-filing/personal-info-step"
import { IncomeSourcesStep } from "@/components/personal-tax-filing/income-sources-step"
import { IncomeDetailsStep } from "@/components/personal-tax-filing/income-details-step"
import DeductionsStep from "@/components/personal-tax-filing/deductions-step"
import { OpeningWealthStep } from "@/components/personal-tax-filing/wealth-statement-step"
import AssetsStep from "@/components/personal-tax-filing/assets-selection-step"
import AssetDetailsStep from "@/components/personal-tax-filing/assets-details-step"
import LiabilitiesStep from "@/components/personal-tax-filing/liabilities-step"
import { TaxCreditsStep } from "@/components/personal-tax-filing/tax-credits-step"
import ExpenseStep from "@/components/personal-tax-filing/expense-step"
import PersonalTaxSidebar from "@/components/personal-tax-filing/PersonalTaxSidebar"
import WrapUpStep from "@/components/personal-tax-filing/WrapUpStep"
import Cookies from "js-cookie"

// Interfaces
interface FormDataType {
  taxYear: string
  fullName: string
  email: string
  cnic: string
  dateOfBirth: Date | null
  nationality: string
  residentialStatus: string
  stayMoreThan3Years: boolean
  employmentBasedStay: boolean
  incomes: string[]
  salaryIncome: any
  businessIncome: any
  rentalIncome: any
  otherIncome: any
  deductions: string[]
  deductionDetails: any
  selectedAssets: string[]
  wealthStatement: any
  expense: any
  taxCredits: any
  documentsUploaded: boolean
  consentGiven: boolean
  bankDetails: any
}

export default function PersonalTaxFiling() {
  const router = useRouter()
  const params = useParams()
  const taxFilingId = params && typeof params === "object" && "id" in params ? (params as any).id as string : ""
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null

  if (!taxFilingId) {
    router.push("/user-services/personal-tax-filing")
  }

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormDataType>({
    taxYear: "",
    fullName: user?.name || "",
    email: user?.email || "",
    cnic: user?.cnic || "",
    dateOfBirth: null,
    nationality: "Pakistani",
    residentialStatus: "",
    stayMoreThan3Years: false,
    employmentBasedStay: false,
    incomes: [],
    salaryIncome: "",
    businessIncome: "",
    rentalIncome: "",
    otherIncome: "",
    deductions: [],
    deductionDetails: {},
    selectedAssets: [],
    wealthStatement: {
      openingWealth: 0,
      assets: {},
      liabilities: {},
    },
    expense: { householdExpenses: 0 },
    taxCredits: {},
    documentsUploaded: false,
    consentGiven: false,
    bankDetails: {},
  })

  useEffect(() => {
    if (currentStep === 5) {
      setFormData((prev) => ({ ...prev, taxCredits: "" }))
    }
  }, [currentStep])

  const steps = [
    { id: 1, title: "Tax Year", shortTitle: "Year" },
    { id: 2, title: "Personal Info", shortTitle: "Info" },
    { id: 3, title: "Income Sources", shortTitle: "Sources" },
    { id: 4, title: "Income Details", shortTitle: "Details" },
    { id: 5, title: "Tax Credits", shortTitle: "Credits" },
    { id: 6, title: "Deductions", shortTitle: "Deductions" },
    { id: 7, title: "Opening Wealth", shortTitle: "Wealth" },
    { id: 8, title: "Asset Selection", shortTitle: "Assets" },
    { id: 9, title: "Asset Details", shortTitle: "Asset Details" },
    { id: 10, title: "Liabilities", shortTitle: "Liabilities" },
    { id: 11, title: "Expense Details", shortTitle: "Expense" },
    { id: 12, title: "Wrap Up", shortTitle: "Wrap Up" },
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return !!formData.taxYear
      case 2:
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
        return (
          !!formData.fullName &&
          !!formData.email &&
          !!formData.cnic &&
          cnicRegex.test(formData.cnic) &&
          !!formData.dateOfBirth &&
          !!formData.nationality &&
          !!formData.residentialStatus
        )
      case 3:
        return formData.incomes.length > 0
      case 4:
        return formData.incomes.every((source) =>
          source === "salary"
            ? !!formData.salaryIncome
            : source === "business"
              ? !!formData.businessIncome
              : source === "rent"
                ? !!formData.rentalIncome
                : source === "other"
                  ? !!formData.otherIncome
                  : true
        )
      case 5:
        return true
      case 6:
        return formData.deductions.length === 0 || formData.deductions.every((deduction) => {
          const details = formData.deductionDetails
          if (deduction === "bank_transactions") return details.bankTransactions?.length > 0
          if (deduction === "utilities") return details.utilities?.length > 0
          if (deduction === "vehicles") return details.vehicles?.length > 0
          if (deduction === "other") return Object.values(details.other || {}).some((v) => (v as number) > 0)
          return false
        })
      case 7:
        return formData.wealthStatement.openingWealth >= 0
      case 8:
        return formData.selectedAssets.length > 0
      case 9:
        return formData.selectedAssets.every((asset) => {
          const assets = formData.wealthStatement.assets
          if (asset === "cash") return assets.cash?.balance > 0
          return assets[asset]?.length > 0
        })
      case 10:
        return true
      case 11:
        return !!formData.expense
      case 12:
        return true
      default:
        return true
    }
  }

  const handleStepChange = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      if (step <= currentStep) {
        setCurrentStep(step)
      } else {
        for (let i = 1; i < step; i++) {
          if (!validateStep(i)) {
            alert(`Please complete Step ${i} before going to Step ${step}`)
            return
          }
        }
        setCurrentStep(step)
      }
    }
  }

  const handleNextStep = async () => {
    if (currentStep === steps.length) {
      console.log("Final Submit: Form Data ->", formData)
      router.push(`/user-services/personal-tax-filing/${taxFilingId}/checkout`)
      return
    }
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <TaxYearStep formData={formData} handleInputChange={handleInputChange} />
      case 2:
  return (
    <PersonalInfoStep 
      formData={formData} 
      handleInputChange={handleInputChange}
      onNavigateNext={async () => {
        // This will be called when moving to next step
        await handleNextStep()
      }}
    />
  )
      case 3:
  return (
    <IncomeSourcesStep 
      formData={formData} 
      handleInputChange={handleInputChange}
      onNavigateNext={async () => {
        // This will be called when moving to next step
        await handleNextStep()
      }}
    />
  )
      case 4:
        return <IncomeDetailsStep formData={formData} handleInputChange={handleInputChange} />
      case 5:
        return <TaxCreditsStep formData={formData} handleInputChange={handleInputChange} onNavigateNext={() => setCurrentStep(6)} />
      case 6:
        return <DeductionsStep formData={formData} handleInputChange={handleInputChange} nextStep={function (): void {
          throw new Error("Function not implemented.")
        } } />
      case 7:
        return <OpeningWealthStep formData={formData} handleInputChange={handleInputChange} />
      case 8:
        return <AssetsStep formData={formData} handleInputChange={handleInputChange} />
      case 9:
        return <AssetDetailsStep formData={formData} handleInputChange={handleInputChange} />
      case 10:
        return <LiabilitiesStep formData={formData} handleInputChange={handleInputChange} />
      case 11:
        return <ExpenseStep formData={formData} handleInputChange={handleInputChange} />
      case 12:
        return <WrapUpStep formData={formData} handleInputChange={handleInputChange} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-row gap-6 px-2 sm:px-4 md:px-8 mx-auto py-8 mt-16 w-full">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <PersonalTaxSidebar formData={formData} />
      </div>
      {/* Main Content */}
      <div className="flex-1 min-w-0">
      {/* Responsive Stepper Header */}
      <div className="mb-8">
        {/* Desktop Stepper */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${step.id === currentStep
                        ? "bg-[#15803d] text-white border-2 border-[#15803d]"
                      : validateStep(step.id)
                        ? "bg-green-500 text-white border-2 border-green-500 hover:bg-green-600"
                        : "bg-gray-200 text-gray-500 border-2 border-gray-200 hover:bg-gray-300"
                      }`}
                    onClick={() => handleStepChange(step.id)}
                  >
                    {validateStep(step.id) && step.id !== currentStep ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium text-center ${step.id === currentStep
                        ? "text-[#15803d]"
                      : validateStep(step.id)
                        ? "text-green-800"
                        : "text-gray-500"
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Tablet Stepper */}
        <div className="hidden md:block lg:hidden">
          <div className="relative">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 text-xs ${step.id === currentStep
                        ? "bg-[#15803d] text-white border-2 border-[#15803d]"
                      : validateStep(step.id)
                        ? "bg-green-500 text-white border-2 border-green-500 hover:bg-green-600"
                        : "bg-gray-200 text-gray-500 border-2 border-gray-200 hover:bg-gray-300"
                      }`}
                    onClick={() => handleStepChange(step.id)}
                  >
                    {validateStep(step.id) && step.id !== currentStep ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-1 text-xs font-medium text-center ${step.id === currentStep
                        ? "text-[#15803d]"
                      : validateStep(step.id)
                        ? "text-green-800"
                        : "text-gray-500"
                      }`}
                  >
                    {step.shortTitle}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Stepper - Horizontal Scroll */}
        <div className="block md:hidden">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide px-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 text-xs ${step.id === currentStep
                        ? "bg-[#15803d] text-white border-2 border-[#15803d]"
                      : validateStep(step.id)
                        ? "bg-green-500 text-white border-2 border-green-500"
                        : "bg-gray-200 text-gray-500 border-2 border-gray-200"
                      }`}
                    onClick={() => handleStepChange(step.id)}
                  >
                    {validateStep(step.id) && step.id !== currentStep ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-1 text-xs font-medium text-center whitespace-nowrap ${step.id === currentStep
                        ? "text-[#15803d]"
                      : validateStep(step.id)
                        ? "text-green-800"
                        : "text-gray-500"
                      }`}
                  >
                    {step.shortTitle}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${validateStep(step.id) ? "bg-green-500" : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="w-full p-2 sm:p-4 md:p-8 mx-auto">
        <CardHeader>
          <CardTitle>
            Personal Tax Filing - Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNextStep}
              className="flex items-center"
              disabled={currentStep < steps.length && !validateStep(currentStep)}
            >
              {currentStep === steps.length ? "Submit" : "Next"}
              {currentStep < steps.length && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      </div>
    </div>
  )
}