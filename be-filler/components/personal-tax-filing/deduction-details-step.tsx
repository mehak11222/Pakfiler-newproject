import React, { useState, useEffect, useCallback } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus, X, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

// Define interfaces matching backend structure
interface BankTransaction {
    transactionType: string;
    bankName: string;
    accountNo: string;
    taxDeducted: number;
}

interface Utility {
    utilityType: string;
    provider: string;
    consumerNo: string;
    taxDeducted: number;
}

interface Vehicle {
    activityType: string;
    vehicleType: string;
    registrationNo: string;
    taxDeducted: number;
}

interface OtherDeduction {
    propertyPurchaseTax: number;
    propertySaleTax: number;
    functionsGatheringTax: number;
    pensionWithdrawalTax: number;
}

interface TaxDeducted {
    bankTransactions?: BankTransaction[];
    utilities?: Utility[];
    vehicles?: Vehicle[];
    other?: OtherDeduction;
}


interface DeductionDetailsStepProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
}

export default function DeductionDetailsStep({ formData, handleInputChange }: DeductionDetailsStepProps) {
    const [currentDeductionIndex, setCurrentDeductionIndex] = useState(0);

    // Debug formData changes and ensure deductionDetails is an object
    useEffect(() => {
        if (!formData.deductionDetails || typeof formData.deductionDetails !== "object") {
            handleInputChange("deductionDetails", {});
        }
    }, [formData, handleInputChange]);

    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/[^\d]/g, "");
        return numericValue ? Number.parseInt(numericValue).toLocaleString() : "";
    };

    const handleCurrencyInput = (value: string) => {
        return value.replace(/[^\d]/g, "");
    };

    const deductionsMap: Record<string, string> = {
        bank_transactions: "Bank Transactions",
        vehicles: "Vehicles",
        utilities: "Utilities",
        other: "Other Deductions",
    };

    const selectedDeductions = Array.isArray(formData.deductions) ? formData.deductions : [];
    const currentDeductionId = selectedDeductions[currentDeductionIndex] || "";
    const currentDeductionTitle = deductionsMap[currentDeductionId] || "Unknown Deduction";

    // Helper to update deduction details
    const updateDeductionDetails = useCallback(
        (type: string, updates: Partial<TaxDeducted>) => {
            const updatedDetails = { ...formData.deductionDetails, ...updates };
            handleInputChange("deductionDetails", updatedDetails);
        },
        [formData.deductionDetails, handleInputChange]
    );

    // Check if a deduction is completed
    const isDeductionCompleted = (deductionId: string) => {
        const details = formData.deductionDetails;
        switch (deductionId) {
            case "bank_transactions":
                return !!(details.bankTransactions && details.bankTransactions.length > 0);
            case "vehicles":
                return !!(details.vehicles && details.vehicles.length > 0);
            case "utilities":
                return !!(details.utilities && details.utilities.length > 0);
            case "other":
                return !!(details.other && Object.values(details.other).some((v) => v > 0));
            default:
                return false;
        }
    };

    const handlePreviousDeduction = () => {
        if (currentDeductionIndex > 0) {
            setCurrentDeductionIndex(currentDeductionIndex - 1);
        }
    };

    const handleNextDeduction = () => {
        if (currentDeductionIndex < selectedDeductions.length - 1) {
            setCurrentDeductionIndex(currentDeductionIndex + 1);
        }
    };

    const handleDeductionNavigation = (index: number) => {
        setCurrentDeductionIndex(index);
    };

    const renderDeductionSection = (deductionId: string) => {
        const details = formData.deductionDetails;

        switch (deductionId) {
            case "bank_transactions":
                return (
                    <div className="space-y-6">
                        <div className="border rounded-lg p-4 bg-blue-50/50">
                            <h4 className="font-medium mb-3">Add Bank Transaction Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <Input
                                        id="bankName"
                                        value={details.newBankName || ""}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, { newBankName: e.target.value })
                                        }
                                        placeholder="Enter bank name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="transactionType">Transaction Type</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            updateDeductionDetails(deductionId, { newTransactionType: value })
                                        }
                                        value={details.newTransactionType || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select transaction type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash transaction">Cash Transaction</SelectItem>
                                            <SelectItem value="profit on debt">Profit on Debt</SelectItem>
                                            <SelectItem value="others">Others</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accountNo">Account Number (Last 4 Digits)</Label>
                                    <Input
                                        id="accountNo"
                                        value={details.newAccountNo || ""}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, { newAccountNo: e.target.value.slice(0, 4) })
                                        }
                                        placeholder="XXXX"
                                        maxLength={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taxDeducted">Tax Deducted (PKR)</Label>
                                    <Input
                                        id="taxDeducted"
                                        value={formatCurrency(details.newTaxDeducted || "")}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, {
                                                newTaxDeducted: handleCurrencyInput(e.target.value),
                                            })
                                        }
                                        placeholder="Enter tax deducted"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (!details.newBankName || !details.newTransactionType || !details.newAccountNo) {
                                            toast({
                                                title: "Error",
                                                description: "Please fill all required fields",
                                                variant: "destructive",
                                            });
                                            return;
                                        }
                                        if (isNaN(Number(details.newTaxDeducted))) {
                                            toast({
                                                title: "Error",
                                                description: "Tax Deducted must be a valid number",
                                                variant: "destructive",
                                            });
                                            return;
                                        }
                                        const newTransaction: BankTransaction = {
                                            transactionType: details.newTransactionType,
                                            bankName: details.newBankName,
                                            accountNo: details.newAccountNo,
                                            taxDeducted: Number(details.newTaxDeducted) || 0,
                                        };
                                        const currentTransactions = Array.isArray(details.bankTransactions)
                                            ? [...details.bankTransactions]
                                            : [];
                                        updateDeductionDetails(deductionId, {
                                            bankTransactions: [...currentTransactions, newTransaction],
                                            newBankName: "",
                                            newTransactionType: "",
                                            newAccountNo: "",
                                            newTaxDeducted: "",
                                        });
                                        toast({
                                            title: "Success",
                                            description: "Bank transaction added",
                                        });
                                    }}
                                    disabled={!details.newBankName || !details.newTransactionType || !details.newAccountNo}
                                    className="w-full md:w-auto"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Bank Transaction
                                </Button>
                            </div>
                        </div>
                        {details.bankTransactions && details.bankTransactions.length > 0 ? (
                            <div className="space-y-3">
                                <h4 className="font-medium">Added Bank Transactions</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    {details.bankTransactions.map((entry: BankTransaction, index: number) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow"
                                        >
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    const updatedEntries = details.bankTransactions.filter((_, i) => i !== index);
                                                    updateDeductionDetails(deductionId, { bankTransactions: updatedEntries });
                                                }}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                            <div className="space-y-2 pr-6">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {entry.transactionType === "savings" && "Savings"}
                                                        {entry.transactionType === "current" && "Current"}
                                                        {entry.transactionType === "foreign" && "Foreign Currency"}
                                                        {entry.transactionType === "business" && "Business"}
                                                    </Badge>
                                                </div>
                                                <div className="font-medium text-sm">{entry.bankName}</div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-muted-foreground">Account Number:</span>
                                                        <div className="font-medium">XXXX-XXXX-XXXX-{entry.accountNo}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Tax Deducted:</span>
                                                        <div className="font-medium text-green-600">
                                                            PKR {entry.taxDeducted.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Tax Deduction:</span>
                                        <span className="font-semibold text-lg">
                                            PKR{" "}
                                            {details.bankTransactions
                                                .reduce((total: number, entry: BankTransaction) => total + entry.taxDeducted, 0)
                                                .toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                <div className="space-y-2">
                                    <div className="text-sm">No bank transactions added yet</div>
                                    <div className="text-xs">Add your first transaction using the form above</div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "vehicles":
                return (
                    <div className="space-y-6">
                        <div className="border rounded-lg p-4 bg-blue-50/50">
                            <h4 className="font-medium mb-3">Add Vehicle Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="activityType">Activity Type</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            updateDeductionDetails(deductionId, { newActivityType: value })
                                        }
                                        value={details.newActivityType || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select activity type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="purchase">Purchase</SelectItem>
                                            <SelectItem value="lease">Lease</SelectItem>
                                            <SelectItem value="transfer">Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            updateDeductionDetails(deductionId, { newVehicleType: value })
                                        }
                                        value={details.newVehicleType || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select vehicle type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="car">Car</SelectItem>
                                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                                            <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="registrationNo">Registration Number</Label>
                                    <Input
                                        id="registrationNo"
                                        value={details.newRegistrationNo || ""}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, { newRegistrationNo: e.target.value })
                                        }
                                        placeholder="e.g. ABC-123"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taxDeducted">Tax Deducted (PKR)</Label>
                                    <Input
                                        id="taxDeducted"
                                        value={formatCurrency(details.newTaxDeducted || "")}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, {
                                                newTaxDeducted: handleCurrencyInput(e.target.value),
                                            })
                                        }
                                        placeholder="Enter tax deducted"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (!details.newActivityType || !details.newVehicleType || !details.newRegistrationNo) {
                                            toast({
                                                title: "Error",
                                                description: "Please fill all required fields",
                                                variant: "destructive",
                                            });
                                            return;
                                        }
                                        if (isNaN(Number(details.newTaxDeducted))) {
                                            toast({
                                                title: "Error",
                                                description: "Tax Deducted must be a valid number",
                                                variant: "destructive",
                                            });
                                            return;
                                        }
                                        const newVehicle: Vehicle = {
                                            activityType: details.newActivityType,
                                            vehicleType: details.newVehicleType,
                                            registrationNo: details.newRegistrationNo,
                                            taxDeducted: Number(details.newTaxDeducted) || 0,
                                        };
                                        const currentVehicles = Array.isArray(details.vehicles) ? [...details.vehicles] : [];
                                        updateDeductionDetails(deductionId, {
                                            vehicles: [...currentVehicles, newVehicle],
                                            newActivityType: "",
                                            newVehicleType: "",
                                            newRegistrationNo: "",
                                            newTaxDeducted: "",
                                        });
                                        toast({
                                            title: "Success",
                                            description: "Vehicle added",
                                        });
                                    }}
                                    disabled={!details.newActivityType || !details.newVehicleType || !details.newRegistrationNo}
                                    className="w-full md:w-auto"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Vehicle
                                </Button>
                            </div>
                        </div>
                        {details.vehicles && details.vehicles.length > 0 ? (
                            <div className="space-y-3">
                                <h4 className="font-medium">Added Vehicles</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    {details.vehicles.map((vehicle: Vehicle, index: number) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow"
                                        >
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    const updatedVehicles = details.vehicles.filter((_, i) => i !== index);
                                                    updateDeductionDetails(deductionId, { vehicles: updatedVehicles });
                                                }}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                            <div className="space-y-2 pr-6">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {vehicle.vehicleType === "car" && "Car"}
                                                        {vehicle.vehicleType === "motorcycle" && "Motorcycle"}
                                                        {vehicle.vehicleType === "commercial" && "Commercial"}
                                                    </Badge>
                                                </div>
                                                <div className="font-medium text-sm">{vehicle.activityType}</div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-muted-foreground">Reg Number:</span>
                                                        <div className="font-medium">{vehicle.registrationNo}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Tax Deducted:</span>
                                                        <div className="font-medium text-green-600">
                                                            PKR {vehicle.taxDeducted.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Tax Deduction:</span>
                                        <span className="font-semibold text-lg">
                                            PKR{" "}
                                            {details.vehicles
                                                .reduce((total: number, vehicle: Vehicle) => total + vehicle.taxDeducted, 0)
                                                .toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                <div className="space-y-2">
                                    <div className="text-sm">No vehicles added yet</div>
                                    <div className="text-xs">Add your first vehicle using the form above</div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "utilities":
                return (
                    <div className="space-y-6">
                        <div className="border rounded-lg p-4 bg-green-50/50">
                            <h4 className="font-medium mb-3">Add Utility Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="utilityType">Utility Type</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            updateDeductionDetails(deductionId, { newUtilityType: value })
                                        }
                                        value={details.newUtilityType || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select utility type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="electricity">Electricity</SelectItem>
                                            <SelectItem value="gas">Gas</SelectItem>
                                            <SelectItem value="water">Water</SelectItem>
                                            <SelectItem value="internet">Internet</SelectItem>
                                            <SelectItem value="phone">Phone</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="provider">Provider/Company</Label>
                                    <Input
                                        id="provider"
                                        value={details.newProvider || ""}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, { newProvider: e.target.value })
                                        }
                                        placeholder="e.g. WAPDA, SNGPL"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="consumerNo">Consumer Number</Label>
                                    <Input
                                        id="consumerNo"
                                        value={details.newConsumerNo || ""}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, { newConsumerNo: e.target.value })
                                        }
                                        placeholder="Enter consumer number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taxDeducted">Tax Deducted (PKR)</Label>
                                    <Input
                                        id="taxDeducted"
                                        value={formatCurrency(details.newTaxDeducted || "")}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, {
                                                newTaxDeducted: handleCurrencyInput(e.target.value),
                                            })
                                        }
                                        placeholder="Enter tax deducted"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (!details.newUtilityType || !details.newProvider || !details.newConsumerNo) {
                                            toast({
                                                title: "Error",
                                                description: "Please fill all required fields",
                                                variant: "destructive",
                                            });
                                            return;
                                        }
                                        if (isNaN(Number(details.newTaxDeducted))) {
                                            toast({
                                                title: "Error",
                                                description: "Tax Deducted must be a valid number",
                                                variant: "destructive",
                                            });
                                            return;
                                        }
                                        const newUtility: Utility = {
                                            utilityType: details.newUtilityType,
                                            provider: details.newProvider,
                                            consumerNo: details.newConsumerNo,
                                            taxDeducted: Number(details.newTaxDeducted) || 0,
                                        };
                                        const currentUtilities = Array.isArray(details.utilities) ? [...details.utilities] : [];
                                        updateDeductionDetails(deductionId, {
                                            utilities: [...currentUtilities, newUtility],
                                            newUtilityType: "",
                                            newProvider: "",
                                            newConsumerNo: "",
                                            newTaxDeducted: "",
                                        });
                                        toast({
                                            title: "Success",
                                            description: "Utility added",
                                        });
                                    }}
                                    disabled={!details.newUtilityType || !details.newProvider || !details.newConsumerNo}
                                    className="w-full md:w-auto rounded-lg bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Utility
                                </Button>
                            </div>
                        </div>
                        {details.utilities && details.utilities.length > 0 ? (
                            <div className="space-y-3">
                                <h4 className="font-medium">Added Utilities</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    {details.utilities.map((utility: Utility, index: number) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow"
                                        >
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-green-200 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    const updatedEntries = details.utilities.filter((_, i) => i !== index);
                                                    updateDeductionDetails(deductionId, { utilities: updatedEntries });
                                                }}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                            <div className="space-y-2 pr-6">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {utility.utilityType === "electricity" && "Electricity"}
                                                        {utility.utilityType === "gas" && "Gas"}
                                                        {utility.utilityType === "water" && "Water"}
                                                        {utility.utilityType === "internet" && "Internet"}
                                                        {utility.utilityType === "phone" && "Phone"}
                                                    </Badge>
                                                </div>
                                                <div className="font-medium text-sm">{utility.provider}</div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-muted-foreground">Consumer Number:</span>
                                                        <div className="font-medium">{utility.consumerNo}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Tax Deducted:</span>
                                                        <div className="font-medium text-green-600">
                                                            PKR {utility.taxDeducted.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Tax Deduction:</span>
                                        <span className="font-semibold text-lg">
                                            PKR{" "}
                                            {details.utilities
                                                .reduce((total: number, utility: Utility) => total + utility.taxDeducted, 0)
                                                .toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                <div className="space-y-2">
                                    <div className="text-sm">No utilities added yet</div>
                                    <div className="text-xs">Add your first utility using the form above</div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "other":
                return (
                    <div className="space-y-6">
                        <div className="border rounded-lg p-4 bg-gray-50/50">
                            <h4 className="font-medium mb-3">Add Other Deduction Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="propertyPurchaseTax">Property Purchase Tax (PKR)</Label>
                                    <Input
                                        id="propertyPurchaseTax"
                                        value={formatCurrency(details.newPropertyPurchaseTax || "")}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, {
                                                newPropertyPurchaseTax: handleCurrencyInput(e.target.value),
                                            })
                                        }
                                        placeholder="Enter property purchase tax"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="propertySaleTax">Property Sale Tax (PKR)</Label>
                                    <Input
                                        id="propertySaleTax"
                                        value={formatCurrency(details.newPropertySaleTax || "")}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, {
                                                newPropertySaleTax: handleCurrencyInput(e.target.value),
                                            })
                                        }
                                        placeholder="Enter property sale tax"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="functionsGatheringTax">Functions/Gathering Tax (PKR)</Label>
                                    <Input
                                        id="functionsGatheringTax"
                                        value={formatCurrency(details.newFunctionsGatheringTax || "")}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, {
                                                newFunctionsGatheringTax: handleCurrencyInput(e.target.value),
                                            })
                                        }
                                        placeholder="Enter functions/gathering tax"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pensionWithdrawalTax">Pension Withdrawal Tax (PKR)</Label>
                                    <Input
                                        id="pensionWithdrawalTax"
                                        value={formatCurrency(details.newPensionWithdrawalTax || "")}
                                        onChange={(e) =>
                                            updateDeductionDetails(deductionId, {
                                                newPensionWithdrawalTax: handleCurrencyInput(e.target.value),
                                            })
                                        }
                                        placeholder="Enter pension withdrawal tax"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (
                                            !details.newPropertyPurchaseTax &&
                                            !details.newPropertySaleTax &&
                                            !details.newFunctionsGatheringTax &&
                                            !details.newPensionWithdrawalTax
                                        ) {
                                            toast({
                                                title: "Error",
                                                description: "Please enter at least one tax amount",
                                                variant: "destructive",
                                            });
                                            return;
                                        }
                                        const newOther: OtherDeduction = {
                                            propertyPurchaseTax: Number(details.newPropertyPurchaseTax) || 0,
                                            propertySaleTax: Number(details.newPropertySaleTax) || 0,
                                            functionsGatheringTax: Number(details.newFunctionsGatheringTax) || 0,
                                            pensionWithdrawalTax: Number(details.newPensionWithdrawalTax) || 0,
                                        };
                                        updateDeductionDetails(deductionId, {
                                            other: newOther,
                                            newPropertyPurchaseTax: "",
                                            newPropertySaleTax: "",
                                            newFunctionsGatheringTax: "",
                                            newPensionWithdrawalTax: "",
                                        });
                                        toast({
                                            title: "Success",
                                            description: "Other deduction added",
                                        });
                                    }}
                                    disabled={
                                        !details.newPropertyPurchaseTax &&
                                        !details.newPropertySaleTax &&
                                        !details.newFunctionsGatheringTax &&
                                        !details.newPensionWithdrawalTax
                                    }
                                    className="w-full md:w-auto"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Other Deduction
                                </Button>
                            </div>
                        </div>
                        {details.other && Object.values(details.other).some((v) => v > 0) ? (
                            <div className="space-y-3">
                                <h4 className="font-medium">Added Other Deductions</h4>
                                <div className="border rounded-lg p-3 bg-white">
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-muted-foreground">Property Purchase:</span>
                                                <div className="font-medium">
                                                    PKR {details.other.propertyPurchaseTax.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Property Sale:</span>
                                                <div className="font-medium">
                                                    PKR {details.other.propertySaleTax.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Functions/Gathering:</span>
                                                <div className="font-medium">
                                                    PKR {details.other.functionsGatheringTax.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Pension Withdrawal:</span>
                                                <div className="font-medium">
                                                    PKR {details.other.pensionWithdrawalTax.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Tax Deduction:</span>
                                        <span className="font-semibold text-lg">
                                            PKR{" "}
                                            {Object.values(details.other)
                                                .reduce((total: number, value: number) => total + value, 0)
                                                .toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                <div className="space-y-2">
                                    <div className="text-sm">No other deductions added yet</div>
                                    <div className="text-xs">Add your first deduction using the form above</div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (selectedDeductions.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No deductions selected. Please go back to select applicable deductions.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-80 flex-shrink-0">
                <Card className="sticky top-4">
                    <CardHeader>
                        <CardTitle className="text-lg">Deductions Progress</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {selectedDeductions.length} deduction{selectedDeductions.length > 1 ? "s" : ""} selected
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {selectedDeductions.map((deductionId: string, index: number) => {
                            const isCompleted = isDeductionCompleted(deductionId);
                            const isCurrent = index === currentDeductionIndex;
                            const deductionTitle = deductionsMap[deductionId];

                            return (
                                <div
                                    key={deductionId}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isCurrent
                                        ? "border-blue-600 bg-blue-600/5"
                                        : isCompleted
                                            ? "border-green-600 bg-green-50 hover:bg-green-100"
                                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                        }`}
                                    onClick={() => handleDeductionNavigation(index)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${isCurrent
                                                    ? "bg-blue-600 text-white"
                                                    : isCompleted
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-300 text-gray-600"
                                                    }`}
                                            >
                                                {isCompleted && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                                            </div>
                                            <div>
                                                <div className={`font-medium text-sm ${isCurrent ? "text-blue-600" : ""}`}>
                                                    {deductionTitle}
                                                </div>
                                                <div className="text-xs text-muted-foreground">{isCompleted ? "Completed" : "Pending"}</div>
                                            </div>
                                        </div>
                                        {isCurrent && <Badge variant="outline">Current</Badge>}
                                    </div>
                                </div>
                            );
                        })}
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress:</span>
                                <span className="font-medium">
                                    {selectedDeductions.filter((deductionId: string) => isDeductionCompleted(deductionId)).length} of{" "}
                                    {selectedDeductions.length} completed
                                </span>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(selectedDeductions.filter((deductionId: string) => isDeductionCompleted(deductionId)).length /
                                            selectedDeductions.length) *
                                            100
                                            }%`,
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex-1">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">{currentDeductionTitle}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Step {currentDeductionIndex + 1} of {selectedDeductions.length}
                                </p>
                            </div>
                            <Badge variant="outline">{isDeductionCompleted(currentDeductionId) ? "Completed" : "In Progress"}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>{renderDeductionSection(currentDeductionId)}</CardContent>
                </Card>
                <div className="mt-8 flex justify-between px-4">
                    <Button
                        variant="outline"
                        onClick={handlePreviousDeduction}
                        disabled={currentDeductionIndex === 0}
                        className="flex items-center"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous Deduction
                    </Button>
                    <Button
                        onClick={handleNextDeduction}
                        disabled={currentDeductionIndex === selectedDeductions.length - 1}
                        className="flex items-center"
                    >
                        Next Deduction
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}