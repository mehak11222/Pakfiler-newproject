"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface OpeningWealthStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
}

export function OpeningWealthStep({ formData, handleInputChange }: OpeningWealthStepProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleWealthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d+$/.test(value)) {
      handleInputChange("wealthStatement", {
        ...formData.wealthStatement,
        openingWealth: value === "" ? 0 : Number(value),
      })
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number for opening wealth.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    const { userId, taxYear, wealthStatement } = formData
    const openingWealth = Number(wealthStatement?.openingWealth || 0)

    if (!userId || !taxYear || openingWealth === 0) {
      toast({
        title: "Missing Info",
        description: "Make sure all fields are filled properly.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/wealth/opening-wealth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, taxYear, openingWealth }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: result.message || "Opening wealth saved successfully",
      })

      // ✅ go to next page
      router.push("/personal-tax-filing/assets-step")

    } catch (error) {
      toast({
        title: "API Error",
        description: "Failed to save opening wealth.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <div className="mb-2 mt-4">
        <span className="inline-block mb-2">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="32" width="32" height="20" rx="4" fill="#f87171" />
            <polygon points="32,12 12,32 52,32" fill="#38bdf8" />
            <rect x="28" y="40" width="8" height="12" rx="2" fill="#fff" />
            <rect x="40" y="40" width="8" height="8" rx="2" fill="#fde68a" />
            <rect x="16" y="52" width="32" height="4" rx="2" fill="#d1d5db" />
          </svg>
        </span>
      </div>

      <div className="text-3xl font-bold text-center mb-2">
        <span className="font-black">For your Wealth Reconciliation</span>, we need to determine<br />
        your wealth at the beginning of the tax year 2025.
      </div>
      <div className="text-center text-lg text-muted-foreground mb-2">
        Please enter your total wealth as at July 1, 2024, which is closing wealth of<br />
        your wealth statement for the tax year 2024.
      </div>
      <div className="mb-4">
        <span className="font-bold underline text-[#15803d] text-lg cursor-pointer">Wealth Statement</span>
      </div>
      <div className="w-full flex justify-center mb-6">
        <Input
          id="openingWealth"
          type="text"
          value={formData.wealthStatement?.openingWealth || ""}
          onChange={handleWealthChange}
          placeholder="Enter opening wealth"
          className="max-w-xl text-2xl px-6 py-4 text-center border-2 border-blue-200 focus:border-blue-400"
        />
      </div>

      {/* <Button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg"
      >
        {loading ? "Saving..." : "Next"}
      </Button> */}
    </div>
  )
}
