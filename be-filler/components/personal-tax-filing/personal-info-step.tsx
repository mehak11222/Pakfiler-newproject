"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Info } from "lucide-react"
import { useParams } from "next/navigation"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

interface PersonalInfoStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  onNavigateNext: () => Promise<void> // Add this prop
}

export function PersonalInfoStep({ formData, handleInputChange, onNavigateNext }: PersonalInfoStepProps) {
  const [cnicError, setCnicError] = useState("")
  const params = useParams()
  const filingId = params?.id as string
  const [loading, setIsLoading] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const { toast } = useToast()

  // const fetchPersonalInfo = async () => {
  //   try {
  //     setIsLoading(true)
  //     const response = await axios.get(`http://localhost:5000/api/personal-info/${filingId}`)
  //     const personalInfo = response.data.info
      
  //     // Update form data with fetched values
  //     Object.keys(personalInfo).forEach(key => {
  //       if (personalInfo[key] && !formData[key]) {
  //         handleInputChange(key, personalInfo[key])
  //       }
  //     })
  //   } catch (error) {
  //     console.error("Error fetching personal info:", error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to fetch personal information",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const submitPersonalInfo = async () => {
    try {
      setIsLoading(true)
      const payload = {
        filingId,
        fullName: formData.fullName,
        email: formData.email,
        cnic: formData.cnic,
        dateOfBirth: formData.dateOfBirth ? format(formData.dateOfBirth, "yyyy-MM-dd") : null,
        nationality: formData.nationality,
        residentialStatus: formData.residentialStatus,
        occupation: formData.occupation,
        stayMoreThan3Years: formData.stayMoreThan3Years,
        employmentBasedStay: formData.employmentBasedStay
      }

      await axios.post(
        "http://localhost:5000/api/personal-info/submit",
        payload
      )

      // Data is saved, now proceed to next step
      onNavigateNext()
    } catch (error) {
      console.error("Error submitting personal info:", error)
      toast({
        title: "Error",
        description: "Failed to save personal information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   if (filingId) {
  //     fetchPersonalInfo()
  //   }
  // }, [filingId])

  const formatCnic = (value: string) => {
    const numericValue = value.replace(/\D/g, "")
    let formatted = ""
    if (numericValue.length > 0) {
      formatted = numericValue.slice(0, 5)
    }
    if (numericValue.length > 5) {
      formatted += "-" + numericValue.slice(5, 12)
    }
    if (numericValue.length > 12) {
      formatted += "-" + numericValue.slice(12, 13)
    }
    return formatted
  }

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formattedValue = formatCnic(rawValue)
    handleInputChange("cnic", formattedValue)

    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
    if (formattedValue && !cnicRegex.test(formattedValue)) {
      setCnicError("CNIC must be in the format xxxxx-xxxxxxx-x (13 digits)")
    } else {
      setCnicError("")
    }
  }

  // if (loading) {
  //   return (
  //     <div className="space-y-4">
  //       <h2 className="text-lg font-semibold">Loading Personal Information...</h2>
  //       <p className="text-sm text-muted-foreground">Please wait while we fetch your personal information.</p>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Personal Information</h2>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName || ""}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          placeholder="Enter your full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cnic">CNIC Number</Label>
        <Input
          id="cnic"
          value={formData.cnic || ""}
          onChange={handleCnicChange}
          placeholder="xxxxx-xxxxxxx-x"
          maxLength={15}
        />
        {cnicError && <p className="text-sm text-green-500">{cnicError}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth ? format(formData.dateOfBirth, "yyyy-MM-dd") : ""}
          onChange={e => handleInputChange("dateOfBirth", e.target.value ? new Date(e.target.value) : null)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nationality">Nationality</Label>
        <Select
          onValueChange={(value) => handleInputChange("nationality", value)}
          value={formData.nationality || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select nationality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pakistan">Pakistan</SelectItem>
            <SelectItem value="Foreign">Foreign</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.nationality === "Foreign" && (
        <div className="space-y-2">
          <Label htmlFor="passportNumber">Passport Number</Label>
          <Input
            id="passportNumber"
            value={formData.passportNumber || ""}
            onChange={e => handleInputChange("passportNumber", e.target.value)}
            placeholder="Enter your passport number"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="residentialStatus">Residential Status</Label>
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(value) => handleInputChange("residentialStatus", value)}
            value={formData.residentialStatus || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select residential status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Resident">Resident</SelectItem>
              <SelectItem value="Non-Resident">Non-Resident</SelectItem>
            </SelectContent>
          </Select>
          <button
            type="button"
            className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={() => setShowHelp(true)}
            aria-label="Help about Resident status"
          >
            <Info className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>
      {showHelp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="bg-white w-full max-w-md h-full shadow-lg p-6 overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowHelp(false)}
              aria-label="Close help panel"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Resident</h2>
            <p className="mb-2 text-gray-700">You are resident for tax purposes if:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>
                (a) Your stay in Pakistan during July 1, 2020 to June 30, 2021 (Tax Year 2021) was more than 183 days.
              </li>
              <li>
                (b) Your stay in Pakistan was equal to or more than 120 days during Tax Year 2021, and 365 days or more in the four preceding tax years.
              </li>
            </ul>
            <p className="text-gray-600 text-sm">You can update your information for this year.</p>
          </div>
        </div>
      )}
      {(formData.nationality || "") === "Other" && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="stayMoreThan3Years"
              checked={formData.stayMoreThan3Years ?? false}
              onCheckedChange={(checked) => handleInputChange("stayMoreThan3Years", checked)}
            />
            <Label htmlFor="stayMoreThan3Years">Stay in Pakistan more than 3 years</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="employmentBasedStay"
              checked={formData.employmentBasedStay ?? false}
              onCheckedChange={(checked) => handleInputChange("employmentBasedStay", checked)}
            />
            <Label htmlFor="employmentBasedStay">Stay in Pakistan based on employment</Label>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="occupation">Occupation</Label>
        <Select
          onValueChange={(value) => handleInputChange("occupation", value)}
          value={formData.occupation || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select occupation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Corporate Sector">Corporate Sector</SelectItem>
            <SelectItem value="Federal Govt.">Federal Govt.</SelectItem>
            <SelectItem value="Provincial Govt.">Provincial Govt.</SelectItem>
            <SelectItem value="Researcher / Teacher">Researcher / Teacher</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}