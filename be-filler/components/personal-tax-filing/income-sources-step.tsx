"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Briefcase, User, UserCheck, Users, PiggyBank, Banknote, Building2, Handshake, Home, TrendingUp, Gift, DollarSign, Leaf, Coins, Award, Layers, FileText, UserCog } from "lucide-react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import Cookies from "js-cookie"

interface IncomeSourcesStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  onNavigateNext: () => Promise<void>
}

export function IncomeSourcesStep({ formData, handleInputChange, onNavigateNext }: IncomeSourcesStepProps) {
  const [loading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null

  const incomeSources = [
    { id: "salary", label: "Salary Income", description: "Income from employment", icon: UserCheck },
    { id: "business", label: "Business/Self Employed", description: "Income from business activities", icon: Briefcase },
    { id: "freelancer", label: "Freelancer", description: "Income from freelance work", icon: User },
    { id: "professional", label: "Professional Services", description: "Income from professional practice", icon: UserCog },
    { id: "pension", label: "Pension", description: "Retirement pension income", icon: Award },
    { id: "agriculture", label: "Agriculture", description: "Income from agricultural activities", icon: Leaf },
    { id: "commission", label: "Commission/Service", description: "Commission or service-based income", icon: Handshake },
    { id: "partnership", label: "Partnership/AOP", description: "Income from partnership or association of persons", icon: Users },
    { id: "rent", label: "Rent", description: "Income from rental properties", icon: Home },
    { id: "propertySale", label: "Property Sale", description: "Income from property transactions", icon: Building2 },
    { id: "savings", label: "Profit on Savings", description: "Interest or profit from savings/investments", icon: PiggyBank },
    { id: "dividendGain", label: "Dividend/Capital Gain", description: "Dividends and capital gains", icon: DollarSign },
    { id: "other", label: "Other Income", description: "Any other source of income", icon: FileText },
  ]

  const submitIncomeSources = async () => {
    try {
      setIsLoading(true)
      const payload = {
        userId: user?._id,
        taxYear: formData.taxYear,
        selectedSources: formData.incomeSources || []
      }

      await axios.post("http://localhost:5000/api/unified", payload)
      await submitIncomeSources()
    } catch (error) {
      console.error("Error submitting income sources:", error)
      toast({
        title: "Error",
        description: "Failed to save income sources",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const currentIncomeSources = formData.incomeSources || []

  const getSelectedSources = () => {
    return incomeSources
      .filter(source => currentIncomeSources.includes(source.id))
      .map(source => source.label)
      .join(", ")
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Saving Income Sources...</h2>
        <p className="text-sm text-muted-foreground">Please wait while we save your income sources.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Income Sources</h2>
      <p className="text-sm text-muted-foreground">Select all applicable income sources for the tax year</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {incomeSources.map((source) => (
          <div key={source.id} className="flex flex-col items-center justify-center border rounded-lg p-6 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="mb-2"><source.icon className="h-12 w-12 text-[#15803d]" /></span>
            <span className="font-semibold text-base text-center mb-1">{source.label}</span>
            <span className="text-xs text-gray-500 text-center">{source.description}</span>
            <Checkbox
              id={source.id}
              checked={currentIncomeSources.includes(source.id)}
              onCheckedChange={(checked) => {
                let updated = [...currentIncomeSources]
                if (checked) {
                  updated.push(source.id)
                } else {
                  updated = updated.filter((id) => id !== source.id)
                }
                handleInputChange("incomeSources", updated)
                handleInputChange("incomes", updated)
              }}
              className="mt-2"
            />
          </div>
        ))}
      </div>

      {currentIncomeSources.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Selected sources:</strong> {currentIncomeSources.length} income source(s) selected. You'll provide
            detailed information for each source in the next step.
          </p>
          <div className="mt-2 text-xs text-blue-600">
            Selected: {getSelectedSources()}
          </div>
        </div>
      )}

      {/* <div className="h-4" /> spacing before parent "Next" button */}

    </div>
  )
}
