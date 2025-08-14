import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ExpenseStepProps {
  formData: {
    expense?: {
      householdExpenses?: string;
    };
    advancedExpense?: {
      [key: string]: string;
    };
  };
  handleInputChange: (section: string, value: any) => void;
}

export default function ExpenseStep({ formData, handleInputChange }: ExpenseStepProps) {
  const [advanced, setAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)

  const expenseFields = [
    { label: "Rent", key: "rent" },
    { label: "Vehicle Running/Maintenance", key: "vehicle" },
    { label: "Electricity", key: "electricity" },
    { label: "Gas", key: "gas" },
    { label: "Medical", key: "medical" },
    { label: "Functions / Gatherings", key: "functions" },
    { label: "Insurance Premium", key: "insurance" },
    { label: "Interest Expense", key: "interest" },
    { label: "Traveling", key: "traveling" },
    { label: "Rates/ Taxes/ Charge/ Cess", key: "rates" },
    { label: "Income Tax", key: "incomeTax" },
    { label: "Water", key: "water" },
    { label: "Telephone", key: "telephone" },
    { label: "Educational", key: "educational" },
    { label: "Donations/Zakat/Annuity, Profit", key: "donations" },
    { label: "Personal/Household Expense", key: "personal" },
    { label: "Gift", key: "gift" },
  ]

  const leftFields = expenseFields.slice(0, 9)
  const rightFields = expenseFields.slice(9)

  const handleSubmit = async () => {
    setLoading(true)
    const userId = "64fd06ddc7a225c86e8f2345" // Replace with dynamic if needed
    const taxYear = "2024-2025" // Replace with dynamic if needed
    const adv = formData.advancedExpense || {}

    const apiBody = {
      userId,
      taxYear,
      rent: parseInt(adv.rent || "0"),
      vehicleMaintenance: parseInt(adv.vehicle || "0"),
      electricity: parseInt(adv.electricity || "0"),
      gas: parseInt(adv.gas || "0"),
      medical: parseInt(adv.medical || "0"),
      functions: parseInt(adv.functions || "0"),
      insurancePremium: parseInt(adv.insurance || "0"),
      interestExpense: parseInt(adv.interest || "0"),
      traveling: parseInt(adv.traveling || "0"),
      ratesTaxes: parseInt(adv.rates || "0"),
      incomeTax: parseInt(adv.incomeTax || "0"),
      water: parseInt(adv.water || "0"),
      telephone: parseInt(adv.telephone || "0"),
      educational: parseInt(adv.educational || "0"),
      donations: parseInt(adv.donations || "0"),
      personalExpense: parseInt(adv.personal || "0"),
    }

    try {
      const res = await fetch("http://localhost:5000/api/expense/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiBody),
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const result = await res.json()
      alert("✅ Expense data submitted successfully!")
      console.log("API response:", result)
    } catch (error) {
      console.error("Expense API Error:", error)
      alert("❌ Failed to submit expense data. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center w-full mt-8">
      <div className="mb-2 mt-4">
        <span className="inline-block mb-2">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="24" width="48" height="24" rx="8" fill="#f87171"/>
            <rect x="16" y="16" width="32" height="16" rx="4" fill="#2563eb"/>
            <rect x="24" y="40" width="16" height="8" rx="2" fill="#fde68a"/>
            <circle cx="20" cy="52" r="6" fill="#2563eb"/>
            <circle cx="44" cy="52" r="6" fill="#2563eb"/>
          </svg>
        </span>
      </div>
      <div className="text-3xl font-bold text-center mb-2">Expense</div>
      <div className="text-center mb-4">
        <span className="font-bold underline text-[#15803d] text-lg cursor-pointer" onClick={() => setAdvanced(!advanced)}>
          {advanced ? "click here for basic options" : "click here for advance options"}
        </span>
      </div>
      {!advanced ? (
        <div className="flex flex-col items-center w-full mt-4">
          <div className="flex items-center gap-4">
            <label className="text-lg font-medium">Total Household Expenses</label>
            <Input
              className="text-2xl px-6 py-4 text-center border-2 border-blue-200 focus:border-blue-400 max-w-xs"
              value={formData.expense?.householdExpenses || ""}
              onChange={e => handleInputChange("expense", { ...formData.expense, householdExpenses: e.target.value })}
              placeholder="Enter amount here"
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="grid grid-cols-2 gap-x-16 gap-y-4 w-full max-w-5xl">
            <div className="flex flex-col gap-4">
              {leftFields.map(f => (
                <div key={f.key} className="flex items-center gap-4">
                  <label className="w-56 text-right text-lg font-medium">{f.label}</label>
                  <Input
                    value={formData.advancedExpense?.[f.key] || ""}
                    onChange={e => handleInputChange("advancedExpense", { ...formData.advancedExpense, [f.key]: e.target.value })}
                    placeholder="Enter amount here"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {rightFields.map(f => (
                <div key={f.key} className="flex items-center gap-4">
                  <label className="w-56 text-right text-lg font-medium">{f.label}</label>
                  <Input
                    value={formData.advancedExpense?.[f.key] || ""}
                    onChange={e => handleInputChange("advancedExpense", { ...formData.advancedExpense, [f.key]: e.target.value })}
                    placeholder="Enter amount here"
                    readOnly={f.key === "incomeTax"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {advanced && (
        <div className="mt-8">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Expenses"}
          </Button>
        </div>
      )}
    </div>
  )
}
