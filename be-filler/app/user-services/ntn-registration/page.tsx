"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, FileText, Upload, CheckCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import Cookies from "js-cookie";

interface EmployerInfo {
    employerName: string;
    employerAddress: string;
    employerNTN: string;    
}

interface IrisProfileData {
    userId: string;
    email: string;
    mobile: string;
    employerInfo: EmployerInfo;
    identityCard?: string;
    createdAt?: string;
}

export default function NTNRegistration() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<IrisProfileData>({
        userId: "",
        email: "",
        mobile: "",
        employerInfo: {
            employerName: "",
            employerAddress: "",
            employerNTN: "",
        }
    });
    const [file, setFile] = useState<File | null>(null);
    const [documentName, setDocumentName] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAuthHeaders = () => {
        const token = Cookies.get("token");
        return {
            ...(token && { Authorization: `Bearer ${token}` }),
            'Content-Type': 'application/json'
        };
    };

    // Fetch user's IRIS profile on mount
    
useEffect(() => {
    const fetchProfile = async () => {
        try {
            setLoading(true);
const token = Cookies.get("token");
if (!token) {
    throw new Error("Authentication token not found");
}

            const response = await fetch('https://backend-production-5fad.up.railway.app/api/iris-profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch profile');
            }

            const data = await response.json();
            const user = getCurrentUser();
            setFormData({
                userId: user.id,
                email: data.email || "",
                mobile: data.mobile || "",
                employerInfo: {
                    employerName: data.employerName || "",
                    employerAddress: data.employerAddress || "",
                    employerNTN: data.employerNTN || "",
                },
                identityCard: data.identityCard || "",
                createdAt: data.createdAt || "",
            });
            setError(null);
        } catch (err) {
            console.error("Profile fetch error:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch profile");
            toast({
                title: "Error",
                description: "Could not fetch profile data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    fetchProfile();
}, []);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("employerInfo.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                employerInfo: { ...prev.employerInfo, [field]: value },
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Validate steps
    const validateStep1 = async () => {
        const { mobile } = formData;
        if (!mobile || !/^\d{11}$/.test(mobile.replace(/[^0-9]/g, ""))) {
            setError("Please enter a valid 11-digit mobile number");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const { employerName, employerAddress, employerNTN } = formData.employerInfo;
        if (!employerName) {
            setError("Employer name is required");
            return false;
        }
        if (!employerAddress) {
            setError("Employer address is required");
            return false;
        }
        if (!employerNTN || !/^\d{7}-?\d?$/.test(employerNTN.replace(/[^0-9]/g, ""))) {
            setError("Employer NTN must be a 7 or 8-digit number");
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (!file || !documentName) {
            setError("Please provide a document name and file");
            return false;
        }
        return true;
    };

    // Handle navigation
    const handleNext = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setError(null);
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setError(null);
        if (step === 1) {
            router.push("/dashboard");
        } else {
            setStep(prev => prev - 1);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateStep1() || !validateStep2() || !validateStep3()) return;

        setSubmitting(true);
        try {
            const token = Cookies.get("token");
if (!token) {
    throw new Error("Authentication token not found");
}


            // Prepare form data for NTN registration
            const formDataUpload = new FormData();
formDataUpload.append("cnicDocumentName", documentName);
formDataUpload.append("cnicFile", file!);
formDataUpload.append("userId", formData.userId);
formDataUpload.append("email", formData.email);
formDataUpload.append("mobile", formData.mobile);
formDataUpload.append("employerName", formData.employerInfo.employerName);
formDataUpload.append("employerAddress", formData.employerInfo.employerAddress);
formDataUpload.append("employerNTN", formData.employerInfo.employerNTN);

// 🔥 Add these default values (adjust if you collect them in future steps)
formDataUpload.append("address", "Temporary Address");
formDataUpload.append("pin", "1234"); // Or generate a random 4-digit PIN
formDataUpload.append("password", "tempPassword123"); // You can hash in backend if needed
formDataUpload.append("sourceOfIncome", "Employment");
formDataUpload.append("bankAccounts", JSON.stringify([
  { bankName: "Default Bank", accountNumber: "1234567890" }
]));
;

            const headers = {
                Authorization: `Bearer ${Cookies.get("token")}`
            };

            const response = await fetch('http://localhost:5000/api/ntn', {
                method: 'POST',
                headers,
                body: formDataUpload
            });

            if (!response.ok) {
                throw new Error("Failed to register NTN");
            }

            const result = await response.json();
            
            // Here you get the path from the response
            const filePath = result.data?.cnicFile; // Adjust based on your API response
            
            toast({
                title: "Success",
                description: `File uploaded successfully. Path: ${filePath}`,
            });
            
            router.push("/dashboard");
        } catch (err) {
            setError("Failed to process NTN registration. Please try again.");
            toast({
                title: "Error",
                description: "Could not complete NTN registration.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-6">
                <p className="text-gray-600">Loading profile status...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <Card className="w-full max-w-md border-gray-200 shadow-md rounded-xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-6 w-6 text-[#15803d]" />
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                NTN Registration
                            </CardTitle>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="border-[#15803d] text-[#15803d] hover:bg-[#15803d]/10 hover:text-[#11632a] transition-all duration-200 rounded-full"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Progress Indicator */}
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3].map((stepNumber) => (
                                <div key={stepNumber} className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${step >= stepNumber ? "bg-[#15803d]" : "bg-gray-300"}`}>
                                        {stepNumber}
                                    </div>
                                    <span className="text-sm mt-2 text-gray-600">
                                        {stepNumber === 1 ? "Personal Info" : 
                                         stepNumber === 2 ? "Employer Info" : "CNIC Upload"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-green-100 text-green-700 p-3 rounded-md text-center">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                    placeholder="email@example.com"
                                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                    required
                                    disabled
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Mobile No.
                                </Label>
                                <Input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile || ""}
                                    onChange={handleInputChange}
                                    placeholder="92300xxxxxxx"
                                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-gradient-to-r from-[#15803d] to-[#11632a] hover:from-[#11632a] hover:to-[#11632a] text-white transition-transform hover:scale-105 rounded-full"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Employer Info */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Employer Name
                                </Label>
                                <Input
                                    type="text"
                                    name="employerInfo.employerName"
                                    value={formData.employerInfo.employerName || ""}
                                    onChange={handleInputChange}
                                    placeholder="Company Name"
                                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Employer Address
                                </Label>
                                <Input
                                    type="text"
                                    name="employerInfo.employerAddress"
                                    value={formData.employerInfo.employerAddress || ""}
                                    onChange={handleInputChange}
                                    placeholder="Company Address, City"
                                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Employer NTN
                                </Label>
                                <Input
                                    type="text"
                                    name="employerInfo.employerNTN"
                                    value={formData.employerInfo.employerNTN || ""}
                                    onChange={handleInputChange}
                                    placeholder="1234567-8"
                                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="border-[#15803d] text-[#15803d] hover:bg-[#15803d]/10 hover:text-[#11632a] transition-all duration-200 rounded-full"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-gradient-to-r from-[#15803d] to-[#11632a] hover:from-[#11632a] hover:to-[#11632a] text-white transition-transform hover:scale-105 rounded-full"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: CNIC Upload */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Document Name
                                </Label>
                                <Input
                                    type="text"
                                    value={documentName}
                                    onChange={(e) => setDocumentName(e.target.value)}
                                    placeholder="e.g., CNIC Front"
                                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Upload CNIC
                                </Label>
                                <div className="mt-1 flex items-center space-x-4">
                                    <Input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                        required
                                    />
                                    {file && (
                                        <span className="text-sm text-gray-600">{file.name}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="border-[#15803d] text-[#15803d] hover:bg-[#15803d]/10 hover:text-[#11632a] transition-all duration-200 rounded-full"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={submitting || !file || !documentName}
                                    className="bg-gradient-to-r from-[#15803d] to-[#11632a] hover:from-[#11632a] hover:to-[#11632a] text-white transition-transform hover:scale-105 rounded-full"
                                >
                                    {submitting ? "Processing..." : "Submit"}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}