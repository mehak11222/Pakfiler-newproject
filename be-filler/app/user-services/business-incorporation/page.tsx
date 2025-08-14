"use client"
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ProgressIndicator } from "@/components/business-incorporation/progress-indicator";
import { Step1PurposeSelection } from "@/components/business-incorporation/purpose-selection";
import { Step2SoleProprietor } from "@/components/business-incorporation/sole-propreitor";
import { Step2AopPartnership } from "@/components/business-incorporation/aop-partnership";
import { Step3AopDocuments } from "@/components/business-incorporation/aop-partnership-2";
import { Step2AddBusinessNtn } from "@/components/business-incorporation/add-business-ntn";
import { Step2RemoveBusinessNtn } from "@/components/business-incorporation/remove-business-ntn";
// import { getCurrentUser } from "@/lib/auth";
import Cookies from "js-cookie";

// Define the form data structure
interface BusinessIncorporationFormData {
    purpose: string;
    businessName: string;
    email: string;
    phoneNumber: string;
    irisPin: string;
    irisPassword: string;
    cessationDate?: string;
    documents?: {
        partnershipDeed?: File;
        partnershipCertificate?: File;
        authorityLetter?: File;
        cnicCopies?: File;
        rentAgreement?: File;
        letterhead?: File;
        electricityBill?: File;
    };
}

// Define the incorporation interface based on API response
interface IBusinessIncorporation {
    _id: string;
    userId: string;
    businessName: string;
    email: string;
    phoneNumber: string;
    irisPin?: string;
    irisPassword?: string;
    cessationDate?: string;
    purpose: string;
    documents?: {
        partnershipDeed?: string;
        partnershipCertificate?: string;
        authorityLetter?: string;
        cnicCopies?: string;
        rentAgreement?: string;
        letterhead?: string;
        electricityBill?: string;
    };
    createdAt: string;
    updatedAt: string;
}

const BusinessIncorporationPage = () => {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"tiles" | "add" | "view">("tiles");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<BusinessIncorporationFormData>({
        purpose: "",
        businessName: "",
        email: "",
        phoneNumber: "",
        irisPin: "",
        irisPassword: "",
        cessationDate: "",
        documents: {},
    });
    const [error, setError] = useState<string | null>(null);
    const [existingIncorporations, setExistingIncorporations] = useState<IBusinessIncorporation[]>([]);
    const [loading, setLoading] = useState(true);

    const updateFormData = (data: Partial<BusinessIncorporationFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };
     const getAuthToken = () => {
        const user = Cookies.get("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            return parsedUser.token;
        }
        return null;
    };
    // Fetch existing incorporations on mount
    useEffect(() => {
        const fetchIncorporations = async () => {
            try {
           
                // if (!user?.id) throw new Error("User not authenticated");

                const token = Cookies.get("token");
                console.log("Token:", Cookies.get("token"));
                const response = await fetch("https://backend-production-5fad.up.railway.app/api/business-incorporation", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch incorporations");
                }

                const result = await response.json();
                const incorporations = Array.isArray(result) ? result : result.data || [];
                setExistingIncorporations(incorporations);
            } catch (error) {
                console.error("Error fetching incorporations:", error);
                setExistingIncorporations([]);
                toast({
                    title: "Error",
                    description: "Failed to fetch existing incorporations",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchIncorporations();
    }, []);

    const validateStep1 = () => {
        if (!formData.purpose) {
            setError("Please select the purpose of business incorporation");
            return false;
        }
        setError(null);
        return true;
    };

    const validateStep2 = () => {
        const { purpose, businessName, email, phoneNumber, irisPin, irisPassword, cessationDate } = formData;
        if (!businessName) {
            setError("Business name is required");
            return false;
        }
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address");
            return false;
        }
        if (!phoneNumber || !/^\d{11}$/.test(phoneNumber.replace(/[^0-9]/g, ""))) {
            setError("Please enter a valid 11-digit mobile number");
            return false;
        }

        if (purpose === "sole-proprietor" || purpose === "add-business-ntn") {
            if (!irisPin || irisPin.length !== 4 || !/^\d+$/.test(irisPin)) {
                setError("IRIS PIN must be a 4-digit number");
                return false;
            }
            if (!irisPassword || irisPassword.length < 6) {
                setError("IRIS password must be at least 6 characters");
                return false;
            }
        }

        if (purpose === "remove-business-ntn") {
            if (!irisPin || irisPin.length !== 4 || !/^\d+$/.test(irisPin)) {
                setError("IRIS PIN must be a 4-digit number");
                return false;
            }
            if (!irisPassword || irisPassword.length < 6) {
                setError("IRIS password must be at least 6 characters");
                return false;
            }
            if (!cessationDate) {
                setError("Cessation date is required");
                return false;
            }
        }

        setError(null);
        return true;
    };

    const validateStep3 = () => {
        if (formData.purpose !== "aop-partnership") return true;
        const { documents } = formData;
        if (
            !documents?.partnershipDeed ||
            !documents?.partnershipCertificate ||
            !documents?.authorityLetter ||
            !documents?.cnicCopies ||
            !documents?.rentAgreement ||
            !documents?.letterhead ||
            !documents?.electricityBill
        ) {
            setError("Please upload all required documents");
            return false;
        }
        setError(null);
        return true;
    };

    const handleNext = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        if (step === 3 && !validateStep3()) return;
        setError(null);
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setError(null);
        if (step === 1) {
            setViewMode("tiles");
        } else {
            setStep((prev) => prev - 1);
        }
    };

   const handleSubmit = async () => {
    if (step === 2 && formData.purpose !== "aop-partnership" && !validateStep2()) return;
    if (step === 3 && formData.purpose === "aop-partnership" && !validateStep3()) return;

    try {
        const token = Cookies.get("token");

        if (!token) {
            toast({
                title: "Error",
                description: "Please login to continue",
                variant: "destructive",
            });
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("businessName", formData.businessName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phoneNumber", formData.phoneNumber);
        formDataToSend.append("irisPin", formData.irisPin);
        formDataToSend.append("irisPassword", formData.irisPassword);
        formDataToSend.append("purpose", formData.purpose.toUpperCase().replace(/-/g, "_"));

        if (formData.cessationDate) {
            formDataToSend.append("cessationDate", formData.cessationDate);
        }

        if (formData.documents) {
            Object.entries(formData.documents).forEach(([key, file]) => {
                if (file) formDataToSend.append(key, file);
            });
        }

        const response = await fetch("http://localhost:5000/api/business-incorporation", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to submit business incorporation");
        }

        const result = await response.json();
        toast({
            title: "Success",
            description: result.message || "Business incorporation submitted successfully",
            variant: "default",
        });
        router.push("/dashboard");
    } catch (error) {
        console.error("Submission error:", error);
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Submission failed",
            variant: "destructive",
        });
    }
};


    const totalSteps = formData.purpose === "aop-partnership" ? 3 : 2;

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100 p-6">
            <div className="mt-10 bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Business Incorporation</h2>

                {viewMode === "tiles" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            onClick={() => setViewMode("view")}
                            className="cursor-pointer bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow-md flex items-center justify-center transition-all duration-200"
                        >
                            <h3 className="text-xl font-semibold text-blue-700">View Requests</h3>
                        </div>
                        <div
                            onClick={() => setViewMode("add")}
                            className="cursor-pointer bg-red-50 hover:bg-red-100 p-6 rounded-lg shadow-md flex items-center justify-center transition-all duration-200"
                        >
                            <h3 className="text-xl font-semibold text-red-700">Add a Request</h3>
                        </div>
                    </div>
                )}

                {viewMode === "view" && (
                    <div className="space-y-4">
                        {existingIncorporations.length === 0 ? (
                            <p className="text-center text-gray-600">No business incorporations found.</p>
                        ) : (
                            existingIncorporations.map((incorporation) => (
                                <div key={incorporation._id} className="border rounded-lg p-4 shadow-md bg-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-800">{incorporation.businessName}</h3>
                                    <p className="text-gray-600"><strong>Purpose:</strong> {incorporation.purpose.replace(/_/g, " ").toUpperCase()}</p>
                                    <p className="text-gray-600"><strong>Email:</strong> {incorporation.email}</p>
                                    <p className="text-gray-600"><strong>Phone Number:</strong> {incorporation.phoneNumber}</p>
                                    {incorporation.irisPin && (
                                        <p className="text-gray-600"><strong>IRIS PIN:</strong> {incorporation.irisPin}</p>
                                    )}
                                    {incorporation.cessationDate && (
                                        <p className="text-gray-600"><strong>Cessation Date:</strong> {new Date(incorporation.cessationDate).toLocaleDateString()}</p>
                                    )}
                                    {incorporation.documents && Object.keys(incorporation.documents).length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-gray-600 font-semibold">Documents:</p>
                                            <ul className="list-disc pl-5">
                                                {Object.entries(incorporation.documents).map(([key, value]) => (
                                                    <li key={key} className="text-gray-600">{key} ({value})</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <p className="text-gray-500 text-sm mt-2">
                                        <strong>Created At:</strong> {new Date(incorporation.createdAt).toLocaleString("en-US", { timeZone: "Asia/Karachi" })}
                                    </p>
                                </div>
                            ))
                        )}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setViewMode("tiles")}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-all duration-200"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {viewMode === "add" && (
                    <>
                        <ProgressIndicator currentStep={step} totalSteps={totalSteps} />

                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6 text-center">
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <Step1PurposeSelection formData={formData} updateFormData={updateFormData} handleNext={handleNext} />
                        )}

                        {step === 2 && formData.purpose === "sole-proprietor" && (
                            <Step2SoleProprietor
                                formData={formData}
                                updateFormData={updateFormData}
                                handleBack={handleBack}
                                handleSubmit={handleSubmit}
                            />
                        )}

                        {step === 2 && formData.purpose === "aop-partnership" && (
                            <Step2AopPartnership
                                formData={formData}
                                updateFormData={updateFormData}
                                handleBack={handleBack}
                                handleNext={handleNext}
                            />
                        )}

                        {step === 3 && formData.purpose === "aop-partnership" && (
                            <Step3AopDocuments
                                formData={formData}
                                updateFormData={updateFormData}
                                handleBack={handleBack}
                                handleSubmit={handleSubmit}
                            />
                        )}

                        {step === 2 && formData.purpose === "add-business-ntn" && (
                            <Step2AddBusinessNtn
                                formData={formData}
                                updateFormData={updateFormData}
                                handleBack={handleBack}
                                handleSubmit={handleSubmit}
                            />
                        )}

                        {step === 2 && formData.purpose === "remove-business-ntn" && (
                            <Step2RemoveBusinessNtn
                                formData={formData}
                                updateFormData={updateFormData}
                                handleBack={handleBack}
                                handleSubmit={handleSubmit}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BusinessIncorporationPage;