"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import type React from "react"
import { useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

const FamilyTaxFiling = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"create" | "tag">("create")
  const [accountName, setAccountName] = useState("")
  const [relation, setRelation] = useState("")
  const [cnic, setCnic] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [userType, setUserType] = useState("")
  const [accountEmail, setAccountEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [tagEmail, setTagEmail] = useState("")
  const [tagUserType, setTagUserType] = useState("")
  const [tagError, setTagError] = useState<string | null>(null)
  const [tagSuccess, setTagSuccess] = useState<string | null>(null)
  const [tagLoading, setTagLoading] = useState(false)

  const currentUser = getCurrentUser()
  if (!currentUser) {
    Cookies.remove("user")
    Cookies.remove("token")
    router.push("/auth/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (!accountName) {
      setError("Account name is required")
      setLoading(false)
      return
    }
    if (relation === "") {
      setError("Select a relation before submitting form")
      setLoading(false)
      return
    }
    if (cnic.length === 0 || !validateCNIC(cnic)) {
      setError("Please enter a valid CNIC xxxxx-xxxxxxx-x")
      setLoading(false)
      return
    }
    if (!validateMobile(phoneNumber)) {
      setError("Please enter a valid phone number 03xx-xxxxxxx")
      setLoading(false)
      return
    }
    if (!email) {
      setError("Email is required")
      setLoading(false)
      return
    }
    if (!accountEmail) {
      setError("Account email is required")
      setLoading(false)
      return
    }
    if (!userType) {
      setError("User type is required")
      setLoading(false)
      return
    }

    try {
      const token = Cookies.get("token")
      const response = await fetch("https://backend-production-5fad.up.railway.app/api/family-account/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountName,
          cnic,
          email,
          mobile: phoneNumber,
          relation,
          accountEmail,
          userType,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Family Account Created",
          description: `Account for ${result.data.accountName} created successfully`,
          variant: "default",
        })

        // Reset form
        setAccountName("")
        setRelation("")
        setCnic("")
        setEmail("")
        setPhoneNumber("")
        setUserType("")
        setAccountEmail("")
      } else {
        throw new Error(result.message || "Failed to create account")
      }
    } catch (error: any) {
      console.error("Error creating family account:", error)
      toast({
        title: "Error Creating Family Account",
        description: error.message || "Cannot create family account due to server error.",
        variant: "destructive",
      })
      setError(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const handleTagSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTagLoading(true)
    setTagSuccess(null)
    setTagError(null)

    if (!tagEmail) {
      setTagError("Account email is required")
      setTagLoading(false)
      return
    }
    if (!tagUserType) {
      setTagError("User type is required")
      setTagLoading(false)
      return
    }

    try {
      const token = Cookies.get("token")
      const apiUrl = "https://backend-production-5fad.up.railway.app/api/family-account/tag"

      console.log("Making request to:", apiUrl)
      console.log("Request payload:", {
        accountEmail: tagEmail,
        userType: tagUserType,
      })

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          accountEmail: tagEmail,
          userType: tagUserType,
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          // If response is not JSON, use the status text
          console.log("Could not parse error response as JSON")
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("Success response:", result)

      setTagSuccess("Account tagged successfully!")
      toast({
        title: "Account Tagged",
        description: `Account ${result.data?.accountEmail || tagEmail} tagged successfully`,
        variant: "default",
      })

      // Reset form
      setTagEmail("")
      setTagUserType("")
    } catch (error: any) {
      console.error("Error tagging account:", error)

      let errorMessage = "Failed to tag account"

      if (error.message.includes("404")) {
        errorMessage = "API endpoint not found. Please check if the server is running and the route exists."
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Cannot connect to server. Please check if the server is running on localhost:5000."
      } else {
        errorMessage = error.message || errorMessage
      }

      setTagError(errorMessage)
      toast({
        title: "Error Tagging Account",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setTagLoading(false)
    }
  }

  const validateCNIC = (value: string) => {
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/
    return cnicPattern.test(value) ? value : ""
  }

  const validateMobile = (value: string) => {
    const mobilePattern = /^\d{11}$/
    return mobilePattern.test(value) ? value : ""
  }

  return (
    <div className="p-12 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Manage Account</h2>
      <p className="mb-6 text-gray-600">
        Please provide the below information which is required to create another profile.
      </p>

      <div className="flex mb-6">
        <button
          className={`px-8 py-2 font-semibold rounded-tl rounded-bl ${activeTab === "create" ? "bg-gradient-to-r from-green-700 to-green-400 text-white" : "bg-gray-300 text-gray-600"} transition`}
          onClick={() => setActiveTab("create")}
        >
          CREATE ACCOUNT
        </button>
        <button
          className={`px-8 py-2 font-semibold rounded-tr rounded-br ${activeTab === "tag" ? "bg-gradient-to-r from-green-700 to-green-400 text-white" : "bg-gray-300 text-gray-600"} transition`}
          onClick={() => setActiveTab("tag")}
        >
          TAG ACCOUNT
        </button>
      </div>

      <hr className="border-t-2 border-green-400 mb-8" />

      {activeTab === "create" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <span className="block text-red-600 font-semibold mb-2">{error}</span>}

          <div>
            <Label className="block mb-1">Your Account Name</Label>
            <Input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className={`w-full p-3 bg-white border-b-2 ${!accountName && error ? "border-red-400 bg-red-50" : "border-green-400"} focus:outline-none focus:ring-2 focus:ring-green-400`}
              placeholder="Enter your account name here"
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <Label className="block mb-1">Relation</Label>
              <Select value={relation} onValueChange={setRelation} disabled={loading}>
                <SelectTrigger className="w-full bg-gray-100 border-b-2 border-gray-400">
                  <SelectValue placeholder="Select relation..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Brother">Brother</SelectItem>
                  <SelectItem value="Sister">Sister</SelectItem>
                  <SelectItem value="Wife">Wife</SelectItem>
                  <SelectItem value="Husband">Husband</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="block mb-1">CNIC No.</Label>
              <Input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                className="w-full p-3 bg-gray-100 border-b-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="XXXXX-XXXXXXX-X"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <Label className="block mb-1">Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-100 border-b-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="example@email.com"
                required
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <Label className="block mb-1">Mobile No.</Label>
              <div className="flex items-center bg-gray-100 border-b-2 border-gray-400 p-3 rounded">
                <span className="mr-2">🇵🇰</span>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 bg-gray-100 border-none focus:outline-none"
                  placeholder="03012345678"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <Label className="block mb-1">Account Email</Label>
              <Input
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="w-full p-3 bg-green-50 border-b-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="account@email.com"
                required
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <Label className="block mb-1">User Type</Label>
              <Select value={userType} onValueChange={setUserType} disabled={loading}>
                <SelectTrigger className="w-full bg-gray-100 border-b-2 border-gray-400">
                  <SelectValue placeholder="Select user type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business">Business account</SelectItem>
                  <SelectItem value="Family">Family account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              disabled={loading}
              className="px-10 py-3 rounded bg-gradient-to-r from-green-700 to-green-400 text-white text-lg font-semibold shadow hover:from-green-800 hover:to-green-500 transition"
            >
              {loading ? "Creating..." : "Submit"}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleTagSubmit} className="space-y-6">
          {tagError && <span className="block text-red-600 font-semibold mb-2">{tagError}</span>}
          {tagSuccess && <span className="block text-green-600 font-semibold mb-2">{tagSuccess}</span>}

          <div className="flex gap-6">
            <div className="flex-1">
              <Label className="block mb-1">Account Email</Label>
              <Input
                type="email"
                value={tagEmail}
                onChange={(e) => setTagEmail(e.target.value)}
                className="w-full p-3 bg-green-50 border-b-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="example@email.com"
                required
                disabled={tagLoading}
              />
            </div>
            <div className="flex-1">
              <Label className="block mb-1">User Type</Label>
              <Select value={tagUserType} onValueChange={setTagUserType} disabled={tagLoading}>
                <SelectTrigger className="w-full bg-gray-100 border-b-2 border-gray-400">
                  <SelectValue placeholder="Select user type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business">Business account</SelectItem>
                  <SelectItem value="Family">Family account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              disabled={tagLoading}
              className="px-10 py-3 rounded bg-gradient-to-r from-green-700 to-green-400 text-white text-lg font-semibold shadow hover:from-green-800 hover:to-green-500 transition"
            >
              {tagLoading ? "Tagging..." : "Submit"}
            </Button>
          </div>
        </form>
      )}
      {/* Debug section - remove this in production */}
      {/* <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <p>
          <strong>API URL:</strong> http://localhost:5000/api/family-account/tag
        </p>
        <p>
          <strong>Token exists:</strong> {Cookies.get("token") ? "Yes" : "No"}
        </p>
        <p>
          <strong>Current User:</strong> {currentUser?.email || "Not found"}
        </p>
      </div> */}
    </div>
  )
}

export default FamilyTaxFiling
