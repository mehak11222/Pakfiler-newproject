"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, CreditCard, Building2, CheckCircle } from "lucide-react"
import { axiosInstance } from "@/lib/ApiClient"
import Cookies from "js-cookie"
import axios from "axios";

interface PaymentDetails {
  bankName: string
  accountNumber: string
  accountTitle: string
  swiftCode?: string
  iban?: string
}

interface PaymentProof {
  file: File | null
  fileName: string
  uploaded: boolean
}

interface ServiceCharge {
  _id: string
  category: string
  services: Array<{
    serviceName: string
    fee: string
    completionTime: string
    requirements: string[]
    contactMethods: string[]
    _id: string
  }>
  createdAt: string
  updatedAt: string
  __v: number
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const taxFilingId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[] | null>(null)
  const [paymentProof, setPaymentProof] = useState<PaymentProof>({
    file: null,
    fileName: "",
    uploaded: false,
  })
  const [transactionId, setTransactionId] = useState("")
  const [notes, setNotes] = useState("")

  // Get token from cookies
  const token = Cookies.get("token") || Cookies.get("authToken") || ""
  const taxYear = Cookies.get("taxYear") || "2024"

  // Bank transfer details
  const bankDetails: PaymentDetails = {
    bankName: "HBL Bank",
    accountNumber: "1234-5678-9012-3456",
    accountTitle: "BeFiler Tax Services",
    swiftCode: "HBLBPKKA",
    iban: "PK36HABB0000001234567890",
  }

  useEffect(() => {
    fetchCartData()
  }, [taxFilingId, taxYear])

  const fetchCartData = async () => {
    try {
      setLoading(true)

      // Set authorization header if token exists
      const headers: any = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      // Fetch comprehensive tax filing data to determine cart items
    const response = await axios.get(
  `http://localhost:5000/api/tax-filing/comprehensive/data?taxYear=${taxYear}`,
  {
    headers: {
      Authorization: `Bearer ${token}`, // add token if needed
      "Content-Type": "application/json",
    },
  }
);

      const cartItems: any[] = []

      if (response.data.success) {
        const data = response.data.data

        // Add Annual Income Tax (always included)
        const annualIncomeTaxPrice =
          data.availableServices
            ?.find((sc: any) => sc.category === "Tax Filing Services")
            ?.services.find((s: any) => s.serviceName === "Annual Income Tax")
            ?.fee.replace(/[^\d]/g, "") || 2500

        cartItems.push({
          name: "Annual Income Tax",
          fee: `Rs. ${Number(annualIncomeTaxPrice).toLocaleString()}`,
          price: Number(annualIncomeTaxPrice),
        })

        // Add NTN Registration if needed (check if user doesn't have NTN)
        // This would be determined by your business logic
        const needsNTN = true // You can determine this based on user data
        if (needsNTN) {
          const ntnPrice =
            data.availableServices
              ?.find((sc: any) => sc.category === "NTN Registration")
              ?.services.find((s: any) => s.serviceName === "NTN Registration")
              ?.fee.replace(/[^\d]/g, "") || 1500

          cartItems.push({
            name: "NTN Registration",
            fee: `Rs. ${Number(ntnPrice).toLocaleString()}`,
            price: Number(ntnPrice),
          })
        }
      }

      setCart(cartItems)

      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + item.price, 0)
      setTotalAmount(total)
    } catch (error) {
      console.error("Error fetching cart data:", error)
      toast({
        title: "Error",
        description: "Failed to load cart data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setPaymentProof({
        file,
        fileName: file.name,
        uploaded: false,
      })
    }
  }

const uploadPaymentProof = async (): Promise<string | null> => {
  if (!paymentProof.file) return null;

  let formData: FormData | null = null;
  try {
    formData = new FormData();
    
    // 1. File upload (MUST use 'paymentProofs' as field name - plural!)
    formData.append('paymentProofs', paymentProof.file); // Critical change
    
    // 2. Required metadata fields (from your Postman screenshot)
    formData.append('paymentAmount', totalAmount.toString());
    formData.append('paymentDate', new Date().toISOString());
    formData.append('transactionId', transactionId);
    formData.append('description', notes || 'Tax filing payment');
    formData.append('bankName', bankDetails.bankName);
    formData.append('accountNumber', bankDetails.accountNumber);
    
    // 3. Optional fields from your API response
    formData.append('taxYear', taxYear);
    formData.append('paymentMethod', 'bank_transfer');

    const response = await axios.post(
      'https://backend-production-5fad.up.railway.app/api/tax-filing/upload-payment-proof',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Let browser set Content-Type with boundary
        }
      }
    );

    // Handle successful response (matches your API response structure)
    if (response.data.success) {
      return response.data.data.paymentProof.files[0].fileName;
    }
    
    return null;
  } catch (error: any) {
    console.error('Upload failed:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      request: {
        data: formData ? Array.from(formData.entries()) : null // Log actual sent data if available
      }
    });

    toast({
      title: 'Upload failed',
      description: error.response?.data?.message || 'Please check your file and try again',
      variant: 'destructive'
    });
    
    return null;
  }
};
  const handleSubmitPayment = async () => {
    if (!paymentProof.file) {
      toast({
        title: "Payment proof required",
        description: "Please upload a payment proof image.",
        variant: "destructive",
      })
      return
    }
    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID required",
        description: "Please enter the bank transaction ID.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // Upload payment proof
      const fileUrl = await uploadPaymentProof()
      if (!fileUrl) {
        setSubmitting(false)
        return
      }

      // Set authorization header if token exists
      const headers: any = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      // Submit comprehensive tax filing with payment details
      const payload = {
        taxYear: taxYear,
        filingType: "individual",
        personalInfo: {
          fullName: "",
          email: "",
          cnic: "",
          dateOfBirth: "",
          nationality: "Pakistani",
          residentialStatus: "Resident",
          occupation: "",
        },
        incomeSources: {
          selectedSources: [],
        },
        incomeDetails: {},
        taxCredits: {
          donationAmount: 0,
          pensionFundInvestment: 0,
          tuitionFee: 0,
        },
        openingWealth: {
          openingWealth: 0,
        },
        assetSelection: {},
        assetDetails: {},
        deductions: {},
        liabilities: {},
        expenses: {},
        wrapUp: {
          autoAdjustWealth: true,
          termsAccepted: true,
        },
        cart: {
          additionalServices: cart.map((item) => ({
            serviceName: item.name,
            fee: item.price,
            quantity: 1,
          })),
        },
        checkout: {
          paymentMethod: "bank_transfer",
          paymentStatus: "pending_verification",
          transactionId: transactionId.trim(),
          paymentProof: fileUrl,
          notes: notes.trim(),
          amount: totalAmount,
          billingAddress: {},
        },
      }

      const response = await axios.post(
  "https://backend-production-5fad.up.railway.app/api/tax-filing/comprehensive/submit",
  payload,
  { headers }
);


      if (response.data.success) {
        toast({
          title: "Payment submitted successfully",
          description: "Your payment proof has been submitted and is under review.",
        })

        // Redirect to confirmation page
        router.push(`/user-services/personal-tax-filing/${response.data.data.taxFiling.id}/confirmation`)
      }
    } catch (error) {
      console.error("Error submitting payment:", error)
      toast({
        title: "Submission failed",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your payment to proceed with tax filing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Bank Transfer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Bank Name:</span>
                      <span>{bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Account Number:</span>
                      <span className="font-mono">{bankDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Account Title:</span>
                      <span>{bankDetails.accountTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Swift Code:</span>
                      <span className="font-mono">{bankDetails.swiftCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">IBAN:</span>
                      <span className="font-mono text-sm">{bankDetails.iban}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Important Instructions:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>
                      • Transfer the exact amount: <strong>Rs. {totalAmount.toLocaleString()}</strong>
                    </li>
                    <li>• Use your CNIC as payment reference</li>
                    <li>• Keep the transaction receipt for upload</li>
                    <li>• Processing time: 1-2 business days</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Payment Proof Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Payment Proof
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-proof">Payment Receipt/Screenshot</Label>
                  <Input
                    id="payment-proof"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500">
                    Upload a clear image of your bank transfer receipt or screenshot
                  </p>
                </div>

                {paymentProof.file && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">{paymentProof.fileName} selected</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-id">Bank Transaction ID *</Label>
                  <Input
                    id="transaction-id"
                    placeholder="Enter the transaction ID from your bank"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about your payment..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-gray-500">No items in cart</p>
                  ) : (
                    cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-medium">{item.fee}</span>
                      </div>
                    ))
                  )}

                  <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-xl font-bold text-green-600">Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitPayment}
              disabled={submitting || !paymentProof.file || !transactionId.trim()}
              className="w-full h-12 text-lg"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Payment"
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              By submitting, you agree to our terms and conditions
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
