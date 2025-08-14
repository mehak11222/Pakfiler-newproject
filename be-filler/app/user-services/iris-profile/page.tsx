"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Cookies from "js-cookie";

const incomeSources = [
    "salary",
    "rental income",
    "capital assets",
    "agriculture",
    "foreign other sources",
    "business income",
    "no source of income",
];

interface BankAccount {
    bankName: string;
    iban: string;
}

interface EmployerInfo {
    employerName: string;
    employerAddress: string;
    employerNTN: string;
}

interface IrisProfileData {
    email: string;
    mobile: string;
    presentAddress: string;
    pin: string;
    password: string;
    sourceOfIncome: string;
    bankAccounts: BankAccount[];
    employerInfo: EmployerInfo;
}

const CreateIrisProfile = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<IrisProfileData>({
        email: "",
        mobile: "",
        presentAddress: "",
        pin: "",
        password: "",
        bankAccounts: [{ bankName: "", iban: "" }],
        employerInfo: {
            employerName: "",
            employerAddress: "",
            employerNTN: "",
        },
        sourceOfIncome: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = Cookies.get("token");
        return {
            ...(token && { Authorization: `Bearer ${token}` }),
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const headers = getAuthHeaders();
                
                if (!headers.Authorization) {
                    throw new Error('Authentication token not found');
                }

                const [profileResponse, irisResponse] = await Promise.all([
                    fetch('https://backend-production-5fad.up.railway.app/api/auth/profile', { headers }),
                    fetch('https://backend-production-5fad.up.railway.app/api/iris-profile', { headers })
                ]);

                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const profileData = await profileResponse.json();

                if (irisResponse.ok) {
                    const irisData = await irisResponse.json();
                    setFormData({
                        email: irisData.email || "",
                        mobile: irisData.mobile || "",
                        presentAddress: irisData.presentAddress || "",
                        pin: irisData.pin || "",
                        password: irisData.password || "",
                        bankAccounts: irisData.bankAccounts || [{ bankName: "", iban: "" }],
                        employerInfo: {
                            employerName: irisData.employerName || "",
                            employerAddress: irisData.employerAddress || "",
                            employerNTN: irisData.employerNTN || "",
                        },
                        sourceOfIncome: irisData.sourceOfIncome || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to load profile",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

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

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, sourceOfIncome: value }));
    };

    const handleBankAccountChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newBankAccounts = [...formData.bankAccounts];
        newBankAccounts[index] = { ...newBankAccounts[index], [name]: value };
        setFormData(prev => ({ ...prev, bankAccounts: newBankAccounts }));
    };

    const addBankAccount = () => {
        setFormData(prev => ({
            ...prev,
            bankAccounts: [...prev.bankAccounts, { bankName: "", iban: "" }],
        }));
    };

    const removeBankAccount = (index: number) => {
        const newBankAccounts = formData.bankAccounts.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, bankAccounts: newBankAccounts }));
    };

    const validateStep1 = () => {
        const { email, mobile, presentAddress, pin, password, bankAccounts, sourceOfIncome } = formData;
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address");
            return false;
        }
        if (!mobile || !/^\d{11}$/.test(mobile.replace(/[^0-9]/g, ""))) {
            setError("Please enter a valid 11-digit mobile number");
            return false;
        }
        if (!presentAddress) {
            setError("Present address is required");
            return false;
        }
        if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
            setError("PIN must be a 4-digit number");
            return false;
        }
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        if (bankAccounts.length === 0 || bankAccounts.some((account) => !account.bankName || !account.iban)) {
            setError("All bank accounts must have a name and IBAN");
            return false;
        }
        if (!sourceOfIncome) {
            setError("Source of income is required");
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

    const handleNext = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setError(null);
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setError(null);
        setStep(prev => prev - 1);
    };

    const savePersonalInfo = async () => {
        try {
            const user = await getCurrentUser();
            const headers = getAuthHeaders();
            
            if (!headers.Authorization) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch('http://localhost:5000/api/iris-profile/personal-info', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    email: formData.email,
                    mobile: formData.mobile,
                    presentAddress: formData.presentAddress,
                    pin: formData.pin,
                    password: formData.password,
                    sourceOfIncome: formData.sourceOfIncome,
                    bankAccounts: formData.bankAccounts,
                    userId: user.id
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save personal info');
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving personal info:', error);
            throw error;
        }
    };

    const saveEmployerInfo = async () => {
        try {
            const headers = getAuthHeaders();
            
            if (!headers.Authorization) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch('http://localhost:5000/api/iris-profile/employer-info', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    employerName: formData.employerInfo.employerName,
                    employerAddress: formData.employerInfo.employerAddress,
                    employerNTN: formData.employerInfo.employerNTN
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save employer info');
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving employer info:', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (!validateStep1() || !validateStep2()) return;

        try {
            await savePersonalInfo();
            await saveEmployerInfo();
            
            toast({
                title: "Success",
                description: "IRIS profile created successfully",
                variant: "default",
            });
            router.push("/dashboard");
        } catch (error) {
            console.error('Submission error:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create IRIS profile",
                variant: "destructive",
            });
        }
    };

    if (loading) return <div className="text-center text-gray-600">Loading...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="mt-10 bg-white rounded-xl shadow-md max-w-2xl w-full p-8 transition-all duration-300">
                <h2 className="text-3xl font-extrabold text-[#15803d] mb-6 text-center tracking-tight">Create IRIS Profile</h2>

                <div className="flex justify-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${step >= 1 ? "bg-[#15803d]" : "bg-gray-300"}`}>
                                1
                            </div>
                            <span className="text-sm mt-2 text-gray-600">Personal Info</span>
                        </div>
                        <div className="h-1 w-24 bg-gray-300 rounded mb-6">
                            <div className={`h-full rounded transition-all duration-300 ${step === 2 ? "w-full bg-[#15803d]" : "w-0"}`}/>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${step === 2 ? "bg-[#15803d]" : "bg-gray-300"}`}>
                                2
                            </div>
                            <span className="text-sm mt-2 text-gray-600">Employer Info</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-md mb-6 text-center">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Email Address</Label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="email@example.com"
                                className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Mobile No.</Label>
                            <Input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                placeholder="92300xxxxxxx"
                                className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Present Address</Label>
                            <Input
                                type="text"
                                name="presentAddress"
                                value={formData.presentAddress}
                                onChange={handleInputChange}
                                placeholder="123 Main St, Lahore"
                                className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                required
                            />
                        </div>
                        <div className="flex space-x-4">
                            <div className="space-y-2 w-1/2">
                                <Label className="text-gray-700 font-medium">PIN</Label>
                                <Input
                                    type="text"
                                    name="pin"
                                    value={formData.pin}
                                    onChange={handleInputChange}
                                    placeholder="1234"
                                    className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                    required
                                />
                            </div>
                            <div className="space-y-2 w-1/2">
                                <Label className="text-gray-700 font-medium">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter password"
                                    className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Source of Income</Label>
                            <Select onValueChange={handleSelectChange} value={formData.sourceOfIncome} required>
                                <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200">
                                    <SelectValue placeholder="Select source of income" />
                                </SelectTrigger>
                                <SelectContent>
                                    {incomeSources.map((source) => (
                                        <SelectItem key={source} value={source}>
                                            {source.charAt(0).toUpperCase() + source.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-4">
                            <Label className="text-gray-700 font-medium">Bank Accounts</Label>
                            {formData.bankAccounts.map((account, index) => (
                                <div key={index} className="flex space-x-4 items-center bg-white p-4 rounded-md border border-gray-200">
                                    <Input
                                        type="text"
                                        name="bankName"
                                        value={account.bankName}
                                        onChange={(e) => handleBankAccountChange(index, e)}
                                        placeholder="Bank Name"
                                        className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                        required
                                    />
                                    <Input
                                        type="text"
                                        name="iban"
                                        value={account.iban}
                                        onChange={(e) => handleBankAccountChange(index, e)}
                                        placeholder="IBAN"
                                        className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                        required
                                    />
                                    {formData.bankAccounts.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => removeBankAccount(index)}
                                            className="bg-[#15803d] hover:bg-green-700 transition-all duration-200 rounded-full"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addBankAccount}
                                className="w-full border-gray-300 hover:bg-[#15803d]/10 text-[#15803d] hover:text-green-700 transition-all duration-200 rounded-full"
                            >
                                Add Bank Account
                            </Button>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="bg-gradient-to-r from-[#15803d] to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-transform hover:scale-105 rounded-full"
                            >
                                Next
                            </Button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Employer Name</Label>
                            <Input
                                type="text"
                                name="employerInfo.employerName"
                                value={formData.employerInfo.employerName}
                                onChange={handleInputChange}
                                placeholder="Company Name"
                                className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Employer Address</Label>
                            <Input
                                type="text"
                                name="employerInfo.employerAddress"
                                value={formData.employerInfo.employerAddress}
                                onChange={handleInputChange}
                                placeholder="Company Address, City"
                                className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Employer NTN</Label>
                            <Input
                                type="text"
                                name="employerInfo.employerNTN"
                                value={formData.employerInfo.employerNTN}
                                onChange={handleInputChange}
                                placeholder="1234567-8"
                                className="border-gray-300 focus:ring-2 focus:ring-[#15803d] rounded-md transition-all duration-200"
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                className="border-gray-300 hover:bg-[#15803d]/10 text-[#15803d] hover:text-green-700 transition-all duration-200 rounded-full"
                            >
                                Back
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-gradient-to-r from-[#15803d] to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-transform hover:scale-105 rounded-full"
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateIrisProfile;