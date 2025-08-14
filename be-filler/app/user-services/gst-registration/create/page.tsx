"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Calendar, FileText, Hash, Loader2 } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { environment } from "@/environment/environment";

const CreateGstRegistration = () => {
    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [businessNature, setBusinessNature] = useState("");
    const [description, setDescription] = useState("");
    const [consumerNumber, setConsumerNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

const getAuthToken = () => {
    const token = Cookies.get("token");
    console.log("Raw token cookie:", token);
    if (!token) {
        console.error("Token cookie not found");
        return null;
    }
    return token;
};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessName || !businessType || !startDate || !businessNature || !consumerNumber) {
            toast({
                title: "Error",
                description: "Please fill all required fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSubmitting(true);
           const token = Cookies.get("token");
            const response = await axios.post(
                `https://backend-production-5fad.up.railway.app/api/gst/business-details`,
                {
                    businessName,
                    businessType,
                    startDate,
                    businessNature,
                    description,
                    consumerNumber,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast({
                title: "Success",
                description: `GST registration for ${businessName} created successfully.`,
                className: "bg-green-100 text-green-800 border-green-500",
            });
            router.push(`/user-services/gst-registration/${response.data.data._id}/documents`);
        } catch (error) {
            console.error("Error creating GST registration:", error);
            toast({
                title: "Error",
                description: "Failed to create GST registration. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-20">
            <div className="max-w-7xl mx-auto w-full">
                {/* Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
                                1
                            </div>
                            <span className="ml-2 font-medium text-gray-900">Business Details</span>
                        </div>
                        <div className="h-px flex-1 bg-gray-300 mx-4"></div>
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                2
                            </div>
                            <span className="ml-2 font-medium text-gray-600">Document Upload</span>
                        </div>
                        <div className="h-px flex-1 bg-gray-300 mx-4"></div>
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                3
                            </div>
                            <span className="ml-2 font-medium text-gray-600">Review & Submit</span>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="border border-red-200 shadow-lg animate-in fade-in duration-500">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-900">Create New GST Registration</CardTitle>
                        <p className="text-gray-600">Enter your business details to start the GST registration process.</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Business Details Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                                            Business Name
                                        </Label>
                                        <div className="relative mt-1">
                                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                id="businessName"
                                                value={businessName}
                                                onChange={(e) => setBusinessName(e.target.value)}
                                                placeholder="Enter business name"
                                                className="pl-10 transition-shadow hover:shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="businessType" className="text-sm font-medium text-gray-700">
                                            Business Type
                                        </Label>
                                        <Select value={businessType} onValueChange={setBusinessType}>
                                            <SelectTrigger className="mt-1 transition-shadow hover:shadow-sm">
                                                <SelectValue placeholder="Select business type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AOP/Partnership">AOP/Partnership</SelectItem>
                                                <SelectItem value="Private Limited">Private Limited</SelectItem>
                                                <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="relative">
                                        <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                                            Start Date
                                        </Label>
                                        <div className="relative mt-1">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                id="startDate"
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="pl-10 transition-shadow hover:shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="businessNature" className="text-sm font-medium text-gray-700">
                                            Business Nature
                                        </Label>
                                        <Select value={businessNature} onValueChange={setBusinessNature}>
                                            <SelectTrigger className="mt-1 transition-shadow hover:shadow-sm">
                                                <SelectValue placeholder="Select business nature" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Retailer">Retailer</SelectItem>
                                                <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                                                <SelectItem value="Service Provider">Service Provider</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="relative md:col-span-2">
                                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                            Description
                                        </Label>
                                        <div className="relative mt-1">
                                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                id="description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Enter business description"
                                                className="pl-10 transition-shadow hover:shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Utility Details Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Utility Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <Label htmlFor="consumerNumber" className="text-sm font-medium text-gray-700">
                                            Consumer Number (GAS/Electricity)
                                        </Label>
                                        <div className="relative mt-1">
                                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                id="consumerNumber"
                                                value={consumerNumber}
                                                onChange={(e) => setConsumerNumber(e.target.value)}
                                                placeholder="Enter consumer number"
                                                className="pl-10 transition-shadow hover:shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Next"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateGstRegistration;