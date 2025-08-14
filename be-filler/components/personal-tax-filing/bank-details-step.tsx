"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface Expense {
  householdExpenses: number;
}

interface FormData {
  expense: Expense;
  bankDetails: string;
  // Add other fields as needed
}

interface BankDetailsStepProps {
  formData: FormData;
  handleInputChange: (field: string, value: any) => void;
}

export function BankDetailsStep({ formData, handleInputChange }: BankDetailsStepProps) {
  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, positive integers, or decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numericValue = value === "" ? 0 : Number(value);
      handleInputChange("expense", { householdExpenses: numericValue });
      console.log("Input changed:", { value, numericValue, formData });
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number for household expense.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Expense Details</h2>
      <p className="text-sm text-muted-foreground">Provide expense details for tax refunds</p>
      <div className="space-y-2">
        <Label htmlFor="householdExpense">Household Expense (PKR)</Label>
        <Input
          id="householdExpense"
          value={formData.expense.householdExpenses}
          type="number"
          step="0.01" // Allow decimals
          min="0" // Prevent negative numbers
          onChange={handleExpenseChange}
          placeholder="Enter household expense"
        />
      </div>
    </div>
  );
}