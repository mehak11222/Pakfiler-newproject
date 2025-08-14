
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, CalendarClock, Check, AlertCircle } from "lucide-react"
import { taxYears } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { TaxFilingService } from "@/services/taxFiling.service"
import { useToast } from "@/hooks/use-toast"

interface FilingStep {
  id: string
  name: string
  completed: boolean
}

interface TaxFiling {
  id: string
  taxYear: string
  status: string
  progress: number
  steps: FilingStep[]
}

export function TaxFilingStatus() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedYear, setSelectedYear] = useState(taxYears[0].value)
  const [filing, setFiling] = useState<TaxFiling | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Default steps if no filing exists
  const defaultSteps: FilingStep[] = [
    { id: "1", name: "Registration", completed: false },
    { id: "2", name: "Personal Information", completed: false },
    { id: "3", name: "Income Details", completed: false },
    { id: "4", name: "Deductions & Credits", completed: false },
    { id: "5", name: "Assets & Liabilities", completed: false },
    { id: "6", name: "Review & Submit", completed: false },
  ]

  // Time remaining calculation
  const currentDate = new Date()
  const deadlineDate = new Date(Number.parseInt(selectedYear.split("-")[1]), 8, 30) // September 30th
  const timeRemaining = deadlineDate.getTime() - currentDate.getTime()
  const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)))

  useEffect(() => {
    const fetchFiling = async () => {
      if (!isAuthenticated()) {
        console.log("Redirecting to /auth/login due to unauthenticated user")
        router.push("/auth/login")
        return
      }

      const user = getCurrentUser()
      if (!user || !user.id) {
        console.log("Redirecting to /auth/login due to missing or invalid user")
        router.push("/auth/login")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const taxService = new TaxFilingService()
        const filings = await taxService.getByUser(user.id)
        console.log("Fetched filings:", filings)

        const matchedFiling = filings.find((f) => f.taxYear === selectedYear)
        if (matchedFiling) {
          setFiling(matchedFiling)
        } else {
          // No filing for selected year
          setFiling({
            id: "",
            taxYear: selectedYear,
            status: "not started",
            progress: 0,
            steps: defaultSteps,
          })
        }
      } catch (err: any) {
        console.error("Error fetching tax filings:", err.message)
        setError("Failed to load tax filing status")
        toast({
          title: "Error",
          description: "Unable to load tax filing status. Please try again.",
          variant: "destructive",
        })
        // Fallback to "not started"
        setFiling({
          id: "",
          taxYear: selectedYear,
          status: "not started",
          progress: 0,
          steps: defaultSteps,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFiling()
  }, [selectedYear, router, toast])

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Tax Filing Progress</CardTitle>
          <CardDescription>Complete your tax return for the selected tax year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground">Loading filing status...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Tax Filing Progress</CardTitle>
          <CardDescription>Complete your tax return for the selected tax year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const steps = filing?.steps || defaultSteps
  const progress = filing?.progress || 0
  const status = filing?.status || "not started"

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">Tax Filing Progress</CardTitle>
            <CardDescription>Complete your tax return for the selected tax year</CardDescription>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Tax Year" />
            </SelectTrigger>
            <SelectContent>
              {taxYears.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted p-4 rounded-lg">
            <div className="flex items-center">
              <FileCheck className="h-10 w-10 text-[#af0e0e] mr-4" />
              <div>
                <h3 className="font-medium">Current Status</h3>
                <p className="text-sm text-muted-foreground">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <CalendarClock className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <h3 className="font-medium">{daysRemaining} days remaining</h3>
                <p className="text-sm text-muted-foreground">Until deadline</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#af0e0e] transition-all" style={{ width: `${progress}% ` }} />
            </div>
          </div>

          {/* Filing Steps */}
          <div className="space-y-4">
            <h3 className="font-medium">Filing Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items - center p - 3 rounded - lg border ${step.completed ? "bg-[#af0e0e]/5 border-[#af0e0e]/20" : "bg-muted border-border"
                    } `}
                >
                  {step.completed ? (
                    <Check className="h-5 w-5 text-[#af0e0e] mr-3" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground mr-3 flex-shrink-0"></div>
                  )}
                  <span className={step.completed ? "font-medium" : "text-muted-foreground"}>{step.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alert */}
          {daysRemaining < 30 && (
            <div className="flex items-start p-4 rounded-lg bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Deadline approaching</p>
                <p className="text-sm">
                  The deadline for filing your tax return is approaching. Complete your return soon to avoid penalties.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}