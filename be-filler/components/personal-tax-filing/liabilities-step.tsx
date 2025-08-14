"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface BankLoan {
  bankName: string
  outstandingLoan: number
}

interface OtherLiability {
  liabilityType: string
  amount: number
  description: string
}

interface Liabilities {
  bankLoans?: BankLoan[]
  otherLiabilities?: OtherLiability[]
}

interface FormData {
  wealthStatement: {
    liabilities: Liabilities
  }
}

interface LiabilitiesStepProps {
  formData: FormData
  handleInputChange: (field: string, value: any) => void
}

export default function LiabilitiesStep({ formData, handleInputChange }: LiabilitiesStepProps) {
  const [newBankLoan, setNewBankLoan] = useState({ bankName: "", outstandingLoan: "" })
  const [newOtherLiability, setNewOtherLiability] = useState({ liabilityType: "", amount: "", description: "" })

  const userId = "64fd06ddc7a225c86e8f2345"
  const taxYear = "2024-2025"

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "")
    return numericValue ? Number.parseInt(numericValue).toLocaleString() : ""
  }

  const handleCurrencyInput = (value: string) => value.replace(/[^\d]/g, "")

  const addBankLoan = async () => {
    if (!newBankLoan.bankName || !newBankLoan.outstandingLoan) {
      return toast({
        title: "Error",
        description: "Please fill all required fields for bank loan.",
        variant: "destructive",
      })
    }

    const payload = {
      userId,
      taxYear,
      bankName: newBankLoan.bankName,
      outstandingLoan: Number(newBankLoan.outstandingLoan),
    }

    try {
      const response = await fetch("http://localhost:5000/api/liabilities/bank-loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (response.ok) {
        const updatedLiabilities: Liabilities = {
          ...formData.wealthStatement.liabilities,
          bankLoans: [...(formData.wealthStatement.liabilities.bankLoans || []), payload],
        }
        handleInputChange("wealthStatement", {
          ...formData.wealthStatement,
          liabilities: updatedLiabilities,
        })
        setNewBankLoan({ bankName: "", outstandingLoan: "" })
        toast({ title: "Success", description: "Bank loan saved successfully." })
      } else {
        toast({ title: "API Error", description: data.message || "Failed to save bank loan.", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error while saving bank loan.", variant: "destructive" })
    }
  }

  const addOtherLiability = async () => {
    if (!newOtherLiability.liabilityType || !newOtherLiability.amount || !newOtherLiability.description) {
      return toast({
        title: "Error",
        description: "Please fill all required fields for other liability.",
        variant: "destructive",
      })
    }

    const payload = {
      userId,
      taxYear,
      liabilityType: newOtherLiability.liabilityType,
      amount: Number(newOtherLiability.amount),
      description: newOtherLiability.description,
    }

    try {
      const response = await fetch("http://localhost:5000/api/liabilities/other-liability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (response.ok) {
        const updatedLiabilities: Liabilities = {
          ...formData.wealthStatement.liabilities,
          otherLiabilities: [...(formData.wealthStatement.liabilities.otherLiabilities || []), payload],
        }
        handleInputChange("wealthStatement", {
          ...formData.wealthStatement,
          liabilities: updatedLiabilities,
        })
        setNewOtherLiability({ liabilityType: "", amount: "", description: "" })
        toast({ title: "Success", description: "Other liability saved successfully." })
      } else {
        toast({ title: "API Error", description: data.message || "Failed to save other liability.", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error while saving other liability.", variant: "destructive" })
    }
  }

  const removeBankLoan = (index: number) => {
    const updatedBankLoans = formData.wealthStatement.liabilities.bankLoans?.filter((_, i) => i !== index) || []
    handleInputChange("wealthStatement", {
      ...formData.wealthStatement,
      liabilities: {
        ...formData.wealthStatement.liabilities,
        bankLoans: updatedBankLoans,
      },
    })
  }

  const removeOtherLiability = (index: number) => {
    const updatedOtherLiabilities = formData.wealthStatement.liabilities.otherLiabilities?.filter((_, i) => i !== index) || []
    handleInputChange("wealthStatement", {
      ...formData.wealthStatement,
      liabilities: {
        ...formData.wealthStatement.liabilities,
        otherLiabilities: updatedOtherLiabilities,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liabilities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bank Loan Section */}
        <div className="space-y-4">
          <h4 className="font-medium">Add Bank Loan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={newBankLoan.bankName}
                onChange={(e) => setNewBankLoan({ ...newBankLoan, bankName: e.target.value })}
                placeholder="Enter bank name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outstandingLoan">Outstanding Loan (PKR)</Label>
              <Input
                id="outstandingLoan"
                value={formatCurrency(newBankLoan.outstandingLoan)}
                onChange={(e) =>
                  setNewBankLoan({ ...newBankLoan, outstandingLoan: handleCurrencyInput(e.target.value) })
                }
                placeholder="Enter loan amount"
              />
            </div>
          </div>
          <Button onClick={addBankLoan} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Bank Loan
          </Button>
        </div>

        {/* Display Bank Loans */}
        {(formData.wealthStatement.liabilities.bankLoans?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Added Bank Loans</h4>
            {formData.wealthStatement.liabilities.bankLoans?.map((loan, index) => (
              <div key={index} className="flex justify-between items-center border p-2 rounded">
                <div>
                  <div>{loan.bankName}</div>
                  <div>PKR {loan.outstandingLoan.toLocaleString()}</div>
                </div>
                <Button variant="ghost" onClick={() => removeBankLoan(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Other Liabilities Section */}
        <div className="space-y-4">
          <h4 className="font-medium">Add Other Liability</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liabilityType">Liability Type</Label>
              <Select
                value={newOtherLiability.liabilityType}
                onValueChange={(value) => setNewOtherLiability({ ...newOtherLiability, liabilityType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal_loan">Personal Loan</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="business_credit">Business Credit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (PKR)</Label>
              <Input
                id="amount"
                value={formatCurrency(newOtherLiability.amount)}
                onChange={(e) =>
                  setNewOtherLiability({ ...newOtherLiability, amount: handleCurrencyInput(e.target.value) })
                }
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newOtherLiability.description}
                onChange={(e) => setNewOtherLiability({ ...newOtherLiability, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
          </div>
          <Button onClick={addOtherLiability} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Other Liability
          </Button>
        </div>

        {/* Display Other Liabilities */}
        {(formData.wealthStatement.liabilities.otherLiabilities?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Added Other Liabilities</h4>
            {formData.wealthStatement.liabilities.otherLiabilities?.map((liability, index) => (
              <div key={index} className="flex justify-between items-center border p-2 rounded">
                <div>
                  <div>{liability.liabilityType}</div>
                  <div>PKR {liability.amount.toLocaleString()}</div>
                  <div>{liability.description}</div>
                </div>
                <Button variant="ghost" onClick={() => removeOtherLiability(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
