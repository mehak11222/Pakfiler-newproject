"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import Cookies from "js-cookie"
import { CheckCircle2, XCircle } from "lucide-react"

interface TaxCreditsStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  onNavigateNext: () => void
}

type TaxCreditKey = "donations" | "pensionFund" | "tuitionFees"

export function TaxCreditsStep({ formData, handleInputChange, onNavigateNext }: TaxCreditsStepProps) {
  const { toast } = useToast()
  const [errors, setErrors] = useState<Record<TaxCreditKey, string>>({
    donations: "",
    pensionFund: "",
    tuitionFees: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [answered, setAnswered] = useState(formData.taxCredits !== undefined)
  const [showForm, setShowForm] = useState(formData.taxCredits !== "none" && formData.taxCredits !== undefined)

  // Initialize tax credits data
  const taxCredits = {
    donations: formData.taxCredits?.donations || { enabled: false, taxCreditAmount: "" },
    pensionFund: formData.taxCredits?.pensionFund || { enabled: false, taxCreditAmount: "" },
    tuitionFees: formData.taxCredits?.tuitionFees || { enabled: false, taxCreditAmount: "" },
  }

  const handleYesNo = (yes: boolean) => {
    setAnswered(true)
    if (yes) {
      setShowForm(true)
      handleInputChange("taxCredits", {
        donations: { enabled: false, taxCreditAmount: "" },
        pensionFund: { enabled: false, taxCreditAmount: "" },
        tuitionFees: { enabled: false, taxCreditAmount: "" },
      })
    } else {
      setShowForm(false)
      handleInputChange("taxCredits", "none")
      handleContinue()
    }
  }

  const handleCheckboxChange = (type: TaxCreditKey, checked: boolean) => {
    const updatedTaxCredits = {
      ...taxCredits,
      [type]: {
        enabled: checked,
        taxCreditAmount: checked ? taxCredits[type].taxCreditAmount : "",
      },
    }
    handleInputChange("taxCredits", updatedTaxCredits)
    
    if (!checked) {
      setErrors(prev => ({ ...prev, [type]: "" }))
    }
  }

  const handleAmountChange = (type: TaxCreditKey, value: string) => {
    const numericValue = value === "" ? "" : Number(value)
    let error = ""

    if (taxCredits[type].enabled && (numericValue === "" || isNaN(numericValue) || numericValue <= 0)) {
      error = "Amount must be greater than 0"
    }

    setErrors(prev => ({ ...prev, [type]: error }))

    const updatedTaxCredits = {
      ...taxCredits,
      [type]: {
        ...taxCredits[type],
        taxCreditAmount: numericValue,
      },
    }
    handleInputChange("taxCredits", updatedTaxCredits)
  }

  const validateForm = (): boolean => {
    const newErrors = { ...errors }

    // Validate each enabled credit
    Object.keys(taxCredits).forEach((key) => {
      const creditKey = key as TaxCreditKey
      if (taxCredits[creditKey].enabled) {
        const amount = taxCredits[creditKey].taxCreditAmount
        if (amount === "" || isNaN(Number(amount))) {
          newErrors[creditKey] = "Please enter a valid amount"
        } else if (Number(amount) <= 0) {
          newErrors[creditKey] = "Amount must be greater than 0"
        }
      }
    })

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== "")
  }

  const handleContinue = () => {
    if (showForm && !validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before continuing",
        variant: "destructive",
      })
      return
    }
    onNavigateNext()
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      const token = Cookies.get("token")
      if (!token) throw new Error("Authentication token missing")

      const payload = {
        userId: formData.userId,
        taxYear: formData.taxYear,
        donationAmount: taxCredits.donations.enabled ? Number(taxCredits.donations.taxCreditAmount) : 0,
        pensionFundInvestment: taxCredits.pensionFund.enabled ? Number(taxCredits.pensionFund.taxCreditAmount) : 0,
        tuitionFee: taxCredits.tuitionFees.enabled ? Number(taxCredits.tuitionFees.taxCreditAmount) : 0,
      }

      const response = await fetch("http://localhost:5000/api/tax-credit/tax-credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to save tax credits")
      }

      toast({
        title: "Success",
        description: "Tax credits saved successfully",
      })

      handleContinue()
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save tax credits",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalTaxCredits = Object.values(taxCredits).reduce(
    (sum, credit) => sum + (credit.enabled && credit.taxCreditAmount ? Number(credit.taxCreditAmount) : 0),
    0
  )

  if (!answered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-xl">Tax Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <p className="text-lg">Do you have any tax credits to claim?</p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => handleYesNo(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Yes
                </Button>
                <Button
                  onClick={() => handleYesNo(false)}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-2"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  No
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!showForm) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tax Credits</CardTitle>
        <p className="text-sm text-muted-foreground">
          Specify any applicable tax credits for donations, pension funds, or tuition fees.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Donations */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-6">
            <Label className="w-[500px] text-right text-lg font-medium">
              Have you given any donations through crossed cheque to any approved charity institutions?
            </Label>
            <Checkbox
              id="donations"
              checked={taxCredits.donations.enabled}
              onCheckedChange={(checked) => handleCheckboxChange("donations", checked as boolean)}
              className="border-green-700 text-green-700"
            />
            <Input
              id="donationsAmount"
              type="number"
              min="0"
              value={taxCredits.donations.taxCreditAmount}
              onChange={(e) => handleAmountChange("donations", e.target.value)}
              placeholder="Enter amount"
              className="ml-2"
              disabled={!taxCredits.donations.enabled}
            />
          </div>
          {errors.donations && <p className="text-red-500 text-sm text-center">{errors.donations}</p>}
        </div>

        {/* Pension Fund */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-6">
            <Label className="w-[500px] text-right text-lg font-medium">
              Have you made any investment in approved pension funds?
            </Label>
            <Checkbox
              id="pensionFund"
              checked={taxCredits.pensionFund.enabled}
              onCheckedChange={(checked) => handleCheckboxChange("pensionFund", checked as boolean)}
              className="border-green-700 text-green-700"
            />
            <Input
              id="pensionFundAmount"
              type="number"
              min="0"
              value={taxCredits.pensionFund.taxCreditAmount}
              onChange={(e) => handleAmountChange("pensionFund", e.target.value)}
              placeholder="Enter amount"
              className="ml-2"
              disabled={!taxCredits.pensionFund.enabled}
            />
          </div>
          {errors.pensionFund && <p className="text-red-500 text-sm text-center">{errors.pensionFund}</p>}
        </div>

        {/* Tuition Fees */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-6">
            <Label className="w-[500px] text-right text-lg font-medium">
              Have you paid any tuition fees for higher education?
            </Label>
            <Checkbox
              id="tuitionFees"
              checked={taxCredits.tuitionFees.enabled}
              onCheckedChange={(checked) => handleCheckboxChange("tuitionFees", checked as boolean)}
              className="border-green-700 text-green-700"
            />
            <Input
              id="tuitionFeesAmount"
              type="number"
              min="0"
              value={taxCredits.tuitionFees.taxCreditAmount}
              onChange={(e) => handleAmountChange("tuitionFees", e.target.value)}
              placeholder="Enter amount"
              className="ml-2"
              disabled={!taxCredits.tuitionFees.enabled}
            />
          </div>
          {errors.tuitionFees && <p className="text-red-500 text-sm text-center">{errors.tuitionFees}</p>}
        </div>

        {/* Total Summary */}
        {totalTaxCredits > 0 && (
          <div className="mt-4 p-4 bg-muted-foreground/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Tax Credits:</span>
              <span className="font-semibold text-lg">PKR {totalTaxCredits.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : "Save & Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}