"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, FileText, Home, Phone } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { axiosInstance } from "@/lib/ApiClient"
import Cookies from "js-cookie"
import axios from "axios";

interface TaxFiling {
  id: string
  userId?: string
  taxYear: string
  payment?: {
    transactionId: string
    amount: number
    method: string
    notes?: string
    paymentProof?: string
    status?: string
  }
  status: string
  submittedAt?: string
}

export default function ConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const taxFilingId = params?.id as string

  const [filing, setFiling] = useState<TaxFiling | null>(null)
  const [loading, setLoading] = useState(true)

  // Get token from cookies
  const token = Cookies.get("token") || Cookies.get("authToken") || ""
  const taxYear = Cookies.get("taxYear") || "2024"

  useEffect(() => {
    if (taxFilingId || taxYear) {
      fetchFilingDetails()
    } else {
      setLoading(false)
      toast({
        title: "Error",
        description: "Invalid tax filing information.",
        variant: "destructive",
      })
    }
  }, [taxFilingId, taxYear])

  const fetchFilingDetails = async () => {
    try {
      setLoading(true)

      // Set authorization header if token exists
      const headers: any = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await axios.get(
  `https://backend-production-5fad.up.railway.app/api/tax-filing/comprehensive/data?taxYear=${taxYear}`,
  { headers }
);


      if (response.data.success) {
        const data = response.data.data

        // Transform the data to match our interface
        setFiling({
          id: taxFilingId || "temp-id",
          userId: data.user?._id,
          taxYear: taxYear,
          payment: {
            transactionId: "Pending",
            amount: 0, // This would come from your cart calculation
            method: "bank_transfer",
            status: "pending_verification",
          },
          status: data.finalization?.termsAccepted ? "submitted" : "draft",
          submittedAt: data.finalization?.finalizedAt,
        })
      }
    } catch (error) {
      console.error("Error fetching filing details:", error)
      toast({
        title: "Error",
        description: "Failed to load filing details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    )
  }

  if (!filing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Filing Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the tax filing details. Please check the reference number or contact support.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submission Received Successfully!</h1>
          <p className="text-gray-600">Your tax filing and payment details have been submitted and are under review.</p>
        </div>

        {/* Filing Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filing Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Tax Year</span>
                <p className="font-medium">{filing.taxYear || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Services Included</span>
                <p className="font-medium">Annual Income Tax</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status</span>
                <p className="font-medium text-yellow-600 capitalize">
                  {filing.status?.replace("_", " ") || "Pending"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Submitted At</span>
                <p className="font-medium">
                  {filing.submittedAt ? new Date(filing.submittedAt).toLocaleDateString() : "Just now"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Transaction ID</span>
                <p className="font-medium">{filing.payment?.transactionId || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Amount Paid</span>
                <p className="font-medium">Rs. {filing.payment?.amount?.toLocaleString() || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Payment Method</span>
                <p className="font-medium capitalize">{filing.payment?.method?.replace("_", " ") || "Bank Transfer"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Payment Status</span>
                <p className="font-medium text-yellow-600 capitalize">
                  {filing.payment?.status?.replace("_", " ") || "Pending Verification"}
                </p>
              </div>
            </div>

            {filing.payment?.notes && (
              <div>
                <span className="text-sm text-gray-500">Notes</span>
                <p className="text-sm">{filing.payment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Payment Verification</h4>
                  <p className="text-sm text-gray-600">Our team will verify your payment within 1-2 business days.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Tax Filing Processing</h4>
                  <p className="text-sm text-gray-600">Once payment is verified, we'll process your tax filing.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Status Updates</h4>
                  <p className="text-sm text-gray-600">You'll receive email notifications about your filing status.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Call us: +92-300-1234567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Email: support@befiler.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Business Hours: Mon-Fri 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => router.push("/dashboard")} className="flex-1">
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/user-services/personal-tax-filing/${taxFilingId}`)}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Filing Details
          </Button>
        </div>

        {/* Reference Number */}
        <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Reference Number</p>
          <p className="font-mono font-medium text-lg">{taxFilingId || "TEMP-REF"}</p>
          <p className="text-xs text-gray-500 mt-2">Keep this number for future reference</p>
        </div>
      </div>
    </div>
  )
}
