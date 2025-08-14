"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/ApiClient"
import Cookies from "js-cookie"

interface Service {
  serviceName: string
  fee: string
  completionTime: string
  requirements: string[]
  contactMethods: string[]
  _id: string
  category: string
}

export default function MyCart() {
  const [cart, setCart] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const taxFilingId = params?.id as string

  // Get token from cookies
  const token = Cookies.get("token") || Cookies.get("authToken") || ""
  const taxYear = Cookies.get("taxYear") || "2024"

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        // Set authorization header if token exists
        const headers: any = {}
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const response = await axiosInstance.get(`/api/tax-filing/comprehensive/data?taxYear=${taxYear}`, {
          headers,
        })

        if (response.data.success) {
          const data = response.data.data
          const allServices =
            data.availableServices?.flatMap((cat: any) =>
              cat.services.map((s: any) => ({
                ...s,
                serviceName: s.serviceName ?? s.name,
                _id: s._id ?? "",
                category: cat.category ?? "Default Services",
              })),
            ) || []

          // Always add Annual Income Tax
          const annualIncomeTax = allServices.find((s: any) => s.serviceName === "Annual Income Tax") || {
            serviceName: "Annual Income Tax",
            fee: "Rs. 1,500",
            completionTime: "1 - 2 Working Days",
            requirements: ["Color copy of CNIC", "Latest paid electricity bill", "Phone Number", "Email address"],
            contactMethods: ["whatsapp", "freshchat"],
            _id: "default-annual-income-tax",
            category: "Default Services",
          }

          // Add NTN Registration based on user needs
          let ntnRegistration: Service | null = null
          const needsNTN = true // You can determine this based on user data
          if (needsNTN) {
            const foundNTN = allServices.find((s: any) => s.serviceName === "NTN Registration")
            ntnRegistration = foundNTN
              ? { ...foundNTN, category: foundNTN.category ?? "Default Services" }
              : {
                  serviceName: "NTN Registration",
                  fee: "Rs. 2,500",
                  completionTime: "1 - 2 Working Days",
                  requirements: [
                    "Color copy of CNIC",
                    "Rent agreement/ownership docs of Office premises",
                    "Letterhead",
                    "Latest paid electricity bill",
                    "Phone Number",
                    "Email address",
                  ],
                  contactMethods: ["whatsapp", "freshchat"],
                  _id: "default-ntn-registration",
                  category: "Default Services",
                }
          }

          const cartItems = [annualIncomeTax]
          if (ntnRegistration) cartItems.push(ntnRegistration as Service & { category: string })

          setCart(cartItems)
        }
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [taxFilingId, taxYear, token])

  const handleRemove = (serviceName: string) => {
    if (serviceName === "Annual Income Tax") {
      return // Cannot remove mandatory service
    }
    setCart(cart.filter((s) => s.serviceName !== serviceName))
  }

  const total = cart.reduce((sum, s) => sum + Number.parseInt(s.fee.replace(/[^0-9]/g, ""), 10), 0)

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto mt-12 mb-24">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>
      <div className="flex flex-col gap-6">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500">No services in cart</div>
        ) : (
          cart.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-lg shadow border border-gray-200 flex items-center justify-between px-6 py-4 mb-2"
            >
              <div>
                <div className="font-semibold text-lg">{s.serviceName}</div>
                <div className="text-gray-500 text-sm max-w-xs truncate">
                  {s.serviceName === "Annual Income Tax"
                    ? "2025 Tax will be filed on your behalf."
                    : "Pakfiler will register your National Tax Number (NTN) with FBR on your behalf."}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-bold text-lg">{s.fee}</div>
                <button
                  onClick={() => handleRemove(s.serviceName)}
                  className="ml-2 text-red-600 hover:text-red-800 text-xl font-bold"
                  disabled={s.serviceName === "Annual Income Tax"}
                >
                  &#10006;
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t mt-12 pt-6 flex flex-col items-end">
        <div className="flex justify-between w-full mb-2">
          <span className="text-lg font-medium">Total</span>
          <span className="text-2xl font-bold text-red-700">Rs. {total.toLocaleString()}</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          If you have any promo code,{" "}
          <a href="#" className="text-red-700 underline">
            Click here
          </a>
        </div>
        <button
          onClick={() => router.push(`/user-services/personal-tax-filing/${taxFilingId}/checkout`)}
          className="w-full py-3 rounded bg-gradient-to-r from-red-600 to-red-400 text-white text-lg font-bold shadow hover:from-red-700 hover:to-red-500 transition"
          disabled={cart.length === 0}
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  )
}
