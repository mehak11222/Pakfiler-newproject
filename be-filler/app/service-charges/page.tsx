"use client"

import React, { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { UserServices } from "@/services/user.service"
import { ServiceChargesService } from "@/services/serviceCharges.service"
import { Loader2, ShoppingBag, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ServiceCharge {
    id: string
    name: string
    fee: string
    requirements: any[]
}

const Cart: React.FC = () => {
    const initialUser = getCurrentUser()
    const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([])
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [emptyError, setEmptyError] = useState<boolean>(false)

    const fetchServiceCharges = async (userId: string) => {
        try {
            setLoading(true)
            const ss = new ServiceChargesService()
            const charges = await ss.getServiceChargesByUser(userId)
            console.log("Fetched service charges (raw):", charges)
            if (!charges || (Array.isArray(charges) && charges.length === 0)) {
                setEmptyError(true)
                setServiceCharges([])
            } else {
                const chargesArray = Array.isArray(charges) ? charges : [charges]
                setServiceCharges(chargesArray)
                setEmptyError(false)
            }
            setLoading(false)
        } catch (error) {
            console.error("Error fetching service charges:", error)
            setLoading(false)
            setServiceCharges([])
        }
    }

    useEffect(() => {
        console.log("Fetching service charges for user:", initialUser?.id)
        if (initialUser?.id) {
            fetchServiceCharges(initialUser.id)
        }
    }, [initialUser?.id])

    useEffect(() => {
        if (serviceCharges.length > 0) {
            setCollapsed(
                serviceCharges.reduce((acc, charge) => ({ ...acc, [charge.id]: true }), {})
            )
        }
    }, [serviceCharges])

    const toggleCollapse = (id: string) => {
        setCollapsed(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const parseFee = (feeString: string): number => {
        // Match main fee (e.g., "Rs.320,000") and SECP fee (e.g., "Rs. 10,500")
        const mainFeeMatch = feeString.match(/Rs\.([\d,]+)/); // First "Rs." number
        const secpFeeMatch = feeString.match(/Rs\. ([\d,]+)/); // SECP fee after "Rs."

        let total = 0;

        // Add main fee
        if (mainFeeMatch && mainFeeMatch[1]) {
            total += parseFloat(mainFeeMatch[1].replace(/,/g, "")) || 0;
        }

        // Add SECP fee if present
        if (secpFeeMatch && secpFeeMatch[1]) {
            total += parseFloat(secpFeeMatch[1].replace(/,/g, "")) || 0;
        }

        return total;
    };

    const totalAmount = serviceCharges.reduce((sum, charge) => sum + parseFee(charge.fee), 0);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center p-6 bg-white">
                <div className="text-center space-y-4 animate-pulse">
                    <Loader2 className="h-12 w-12 text-[#af0e0e] animate-spin mx-auto" />
                    <h3 className="text-2xl font-bold text-gray-900">Loading Your Cart...</h3>
                    <p className="text-sm text-gray-600">Please wait while we fetch your service charges.</p>
                </div>
            </div>
        )
    }

    if (emptyError) {
        return (
            <div className="min-h-[400px] flex items-center justify-center p-6 bg-white">
                <div className="text-center space-y-6">
                    <ShoppingBag className="h-24 w-24 text-[#af0e0e]/20 mx-auto" />
                    <div className="space-y-3">
                        <h3 className="text-3xl font-bold text-gray-900">Your Cart is Empty</h3>
                        <p className="text-base text-gray-600 max-w-md mx-auto">
                            It looks like you haven’t added any services yet. Explore our offerings to get started!
                        </p>
                    </div>
                    <Button
                        className="bg-gradient-to-r from-[#af0e0e] to-[#8a0b0b] hover:from-[#8a0b0b] hover:to-[#6b0808] text-white px-8 py-3 rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#af0e0e] focus:ring-offset-2"
                        onClick={() => window.location.href = "/services"}
                    >
                        Explore Services
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6 pt-20 bg-white min-h-screen">
            <h2 className="text-4xl font-extrabold text-[#af0e0e] mb-10 text-center tracking-tight">Your Cart</h2>
            <div className="space-y-6">
                {serviceCharges.map((charge) => {
                    const isCollapsed = collapsed[charge.id] || false
                    return (
                        <Card
                            key={charge.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                        >
                            <CardHeader
                                className="flex flex-row justify-between items-center p-4 cursor-pointer bg-white hover:bg-[#af0e0e]/5 transition-colors duration-200"
                                onClick={() => toggleCollapse(charge.id)}
                            >
                                <CardTitle className="text-xl font-semibold text-gray-900">{charge.name}</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-[#af0e0e]/10 hover:bg-[#af0e0e]/20 transition-colors"
                                >
                                    {isCollapsed ? (
                                        <ChevronUp className="h-5 w-5 text-[#af0e0e]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#af0e0e]" />
                                    )}
                                </Button>
                            </CardHeader>
                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? "max-h-0" : "max-h-96"}`}
                            >
                                <CardContent className="p-4 pt-6">
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium text-gray-900">Requirements:</span>
                                            {charge.requirements && charge.requirements.length > 0 ? (
                                                <ul className="list-disc list-inside mt-1">
                                                    {charge.requirements.map((req, index) => (
                                                        <li key={index} className="text-sm text-gray-700">
                                                            {req}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-gray-600">No specific requirements</span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium text-gray-900">Amount:</span>{" "}
                                            <span className="text-[#af0e0e] font-semibold">Rs.{charge.fee}</span>
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 bg-white border-t border-gray-200">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-[#af0e0e] hover:text-white hover:bg-[#af0e0e] transition-colors rounded-full"
                                        onClick={() => alert("Implement remove service logic here")}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove
                                    </Button>
                                </CardFooter>
                            </div>
                        </Card>
                    )
                })}
            </div>
            <div className="mt-10 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
                    Total: <span className="text-[#af0e0e] font-bold">Rs.{totalAmount.toLocaleString()}</span>
                </h3>
                <Button
                    className="bg-gradient-to-r from-[#af0e0e] to-[#8a0b0b] hover:from-[#8a0b0b] hover:to-[#6b0808] text-white px-6 py-2 rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#af0e0e] focus:ring-offset-2"
                    onClick={() => alert("Proceed to payment (implement payment logic here)")}
                >
                    Proceed to Pay
                </Button>
            </div>
        </div>
    )
}

export default Cart