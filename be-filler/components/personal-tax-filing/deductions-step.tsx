import React, { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useParams } from "next/navigation";
import { toast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import axios from "axios";

// Define interfaces matching backend structure
interface BankTransaction {
  transactionType: string;
  bankName: string;
  accountNumber: string;
  taxDeducted: number;
}

interface Utility {
  utilityType: string;
  provider: string;
  consumerNumber: string;
  taxDeducted: number;
}

interface Vehicle {
  activityType: string;
  vehicleType: string;
  registrationNumber: string;
  taxDeducted: number;
}

interface OtherDeduction {
  propertyPurchase: number;
  propertySale: number;
  gatherings: number;
  pensionWithdrawal: number;
}

interface TaxDeducted {
  bankTransactions?: BankTransaction[];
  utilities?: Utility[];
  vehicles?: Vehicle[];
  other?: OtherDeduction;
}

interface FormData {
  deductions: string[];
  deductionDetails: TaxDeducted;
}

interface Deduction {
  id: string;
  label: string;
}

interface DeductionsStepProps {
  formData: FormData;
  handleInputChange: (field: string, value: any) => void;
  nextStep: () => void;
}

export default function DeductionsStep({ formData, handleInputChange, nextStep }: DeductionsStepProps) {
  const params = useParams();
  const filingId = params?.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [newBank, setNewBank] = useState({
    transactionType: '',
    bankName: '',
    accountNumber: '',
    taxDeducted: ''
  });
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    activityType: '',
    vehicleType: '',
    registrationNumber: '',
    taxDeducted: ''
  });
  const [showUtilitiesForm, setShowUtilitiesForm] = useState(false);
  const [newUtility, setNewUtility] = useState({
    utilityType: '',
    provider: '',
    consumerNumber: '',
    taxDeducted: ''
  });
  const [showOtherForm, setShowOtherForm] = useState(false);
  const [otherChecks, setOtherChecks] = useState({
    purchase: false,
    sale: false,
    functions: false,
    pension: false
  });

  const deductions: Deduction[] = [
    { id: "bank_transactions", label: "Bank Transactions" },
    { id: "vehicles", label: "Vehicles" },
    { id: "utilities", label: "Utilities" },
    { id: "other", label: "Other Deductions" },
  ];

  const bankList = [
    'National Bank of Pakistan (NBP)',
    'First Women Bank Limited (FWBL)',
    'Zarai Taraqiati Bank Limited (ZTBL)',
    'The Bank of Khyber (BoK)',
    'The Bank of Punjab (BoP)',
    'Sindh Bank Limited',
    'Habib Bank Limited (HBL)',
    'United Bank Limited (UBL)',
    'MCB Bank Limited',
    'Allied Bank Limited (ABL)',
    'Askari Bank Limited',
    'Faysal Bank Limited',
    'Bank Alfalah Limited',
    'Meezan Bank Limited',
    'JS Bank Limited',
    'Soneri Bank Limited',
    'Bank of Islamabad',
    'Summit Bank Limited',
    'Bank Al Habib Limited',
    'The Punjab Provincial Cooperative Bank Ltd',
    'MCB Islamic Bank Limited',
    'Bank Islami Pakistan Limited',
    'Dubai Islamic Bank Pakistan Limited (DIBPL)',
    'Al Baraka Bank Pakistan Limited',
    'U Microfinance Bank Limited (U Bank)',
    'Standard Chartered Bank (Pakistan) Ltd',
    'Deutsche Bank AG',
    'Industrial and Commercial Bank of China (ICBC)',
    'Bank of China Limited',
    'Citibank N.A.',
    'Pak Oman Investment Company Limited',
    'Pak Libya Holding Company',
    'Pak Brunei Investment Company',
    'Pak Kuwait Investment Company',
    'Pakistan Industrial Credit and Investment Corporation (PICIC)',
    'House Building Finance Corporation (HBFC)'
  ];
  const transactionTypes = [
    'Foreign Credit Card Transactions',
    'Domestic Credit Card Transactions',
    'Wire Transfer',
    'Remittance',
    'Other'
  ];
  const vehicleActivities = [
    'Registration',
    'Transfer',
    'Sale',
    'Vehicle Tax',
    'Motor Vehicle Tax',
    'Other'
  ];
  const vehicleTypes = [
    'Car',
    'Motorcycle',
    'Van',
    'Jeep',
    'Rickshaw',
    'Other'
  ];
  const utilityTypes = [
    'Cellphone',
    'Telephone',
    'Internet',
    'Electricity'
  ];

  const fetchBankTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/deduction/bank-transactions', {
        params: {
          userId: '64fd06ddc7a225c86e8f2345', // Replace with actual user ID
          taxYear: '2024-2025'
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching bank transactions:", error);
      return [];
    }
  };

  const fetchUtilityDeductions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/deduction/utility-deductions', {
        params: {
          userId: '64fd06ddc7a225c86e8f2345', // Replace with actual user ID
          taxYear: '2024-2025'
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching utility deductions:", error);
      return [];
    }
  };

  const fetchVehicleDeductions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/deduction/vehicle-deductions', {
        params: {
          userId: '64fd06ddc7a225c86e8f2345', // Replace with actual user ID
          taxYear: '2024-2025'
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching vehicle deductions:", error);
      return [];
    }
  };

  const fetchOtherDeductions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/deduction/other-deductions', {
        params: {
          userId: '64fd06ddc7a225c86e8f2345', // Replace with actual user ID
          taxYear: '2024-2025'
        }
      });
      return response.data.data || {};
    } catch (error) {
      console.error("Error fetching other deductions:", error);
      return {};
    }
  };

  const stepData = async () => {
    try {
      setIsLoading(true);
      
      const [bankTransactions, utilities, vehicles, other] = await Promise.all([
        fetchBankTransactions(),
        fetchUtilityDeductions(),
        fetchVehicleDeductions(),
        fetchOtherDeductions()
      ]);

      const taxDeducted: TaxDeducted = {
        bankTransactions: bankTransactions.length > 0 ? bankTransactions : undefined,
        utilities: utilities.length > 0 ? utilities : undefined,
        vehicles: vehicles.length > 0 ? vehicles : undefined,
        other: Object.values(other).some(val => (val as number) > 0) ? other : undefined
      };

      const deductionTypes: string[] = [];
      if (bankTransactions.length > 0) deductionTypes.push("bank_transactions");
      if (utilities.length > 0) deductionTypes.push("utilities");
      if (vehicles.length > 0) deductionTypes.push("vehicles");
      if (Object.values(other).some(val => (val as number) > 0)) deductionTypes.push("other");

      handleInputChange("deductions", deductionTypes);
      handleInputChange("deductionDetails", taxDeducted);
    } catch (error) {
      console.error("Error fetching step data:", error);
      toast({
        title: "Error",
        description: "Failed to load deduction data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (filingId) {
      stepData();
    }
  }, [filingId]);

  function toggleDeduction(id: string) {
    const currentDeductions = Array.isArray(formData.deductions) ? [...formData.deductions] : [];
    if (currentDeductions.includes(id)) {
      handleInputChange(
        "deductions",
        currentDeductions.filter((d) => d !== id)
      );
      if (id === 'bank_transactions') setShowBankForm(false);
      if (id === 'vehicles') setShowVehicleForm(false);
      if (id === 'utilities') setShowUtilitiesForm(false);
      if (id === 'other') setShowOtherForm(false);
    } else {
      handleInputChange("deductions", [...currentDeductions, id]);
      if (id === 'bank_transactions') setShowBankForm(true);
      if (id === 'vehicles') setShowVehicleForm(true);
      if (id === 'utilities') setShowUtilitiesForm(true);
      if (id === 'other') setShowOtherForm(true);
    }
  }

  async function addBankEntry() {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/deduction/bank-transaction', {
        userId: '64fd06ddc7a225c86e8f2345', // Replace with actual user ID
        taxYear: '2024-2025',
        transactionType: newBank.transactionType,
        bankName: newBank.bankName,
        accountNumber: newBank.accountNumber,
        taxDeducted: parseFloat(newBank.taxDeducted.replace(/,/g, '')) || 0
      });

      const entry = response.data.data;
      const prev = formData.deductionDetails?.bankTransactions || [];
      handleInputChange('deductionDetails', {
        ...formData.deductionDetails,
        bankTransactions: [...prev, entry]
      });
      setNewBank({ transactionType: '', bankName: '', accountNumber: '', taxDeducted: '' });
      
      toast({
        title: "Success",
        description: "Bank transaction saved successfully",
      });
    } catch (error) {
      console.error("Error saving bank transaction:", error);
      toast({
        title: "Error",
        description: "Failed to save bank transaction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function addVehicleEntry() {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/deduction/vehicle-deduction', {
        userId: '64fd06ddc7a225c86e8f2345', // Replace with actual user ID
        taxYear: '2024-2025',
        activityType: newVehicle.activityType,
        vehicleType: newVehicle.vehicleType,
        registrationNumber: newVehicle.registrationNumber,
        taxDeducted: parseFloat(newVehicle.taxDeducted.replace(/,/g, '')) || 0
      });

      const entry = response.data.data;
      const prev = formData.deductionDetails?.vehicles || [];
      handleInputChange('deductionDetails', {
        ...formData.deductionDetails,
        vehicles: [...prev, entry]
      });
      setNewVehicle({ activityType: '', vehicleType: '', registrationNumber: '', taxDeducted: '' });
      
      toast({
        title: "Success",
        description: "Vehicle deduction saved successfully",
      });
    } catch (error) {
      console.error("Error saving vehicle deduction:", error);
      toast({
        title: "Error",
        description: "Failed to save vehicle deduction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function addUtilityEntry() {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/deduction/utility-deduction', {
        userId: '64fd06ddc7a225c86e8f2345', // Replace with actual user ID
        taxYear: '2024-2025',
        utilityType: newUtility.utilityType,
        provider: newUtility.provider,
        consumerNumber: newUtility.consumerNumber,
        taxDeducted: parseFloat(newUtility.taxDeducted.replace(/,/g, '')) || 0
      });

      const entry = response.data.data;
      const prev = formData.deductionDetails?.utilities || [];
      handleInputChange('deductionDetails', {
        ...formData.deductionDetails,
        utilities: [...prev, entry]
      });
      setNewUtility({ utilityType: '', provider: '', consumerNumber: '', taxDeducted: '' });
      
      toast({
        title: "Success",
        description: "Utility deduction saved successfully",
      });
    } catch (error) {
      console.error("Error saving utility deduction:", error);
      toast({
        title: "Error",
        description: "Failed to save utility deduction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function saveOtherDeductions() {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/deduction/other-deduction', {
        userId: '64fd06ddc7a225c86e8f2345', // Replace with actual user ID
        taxYear: '2024-2025',
        propertyPurchase: formData.deductionDetails?.other?.propertyPurchase || 0,
        propertySale: formData.deductionDetails?.other?.propertySale || 0,
        gatherings: formData.deductionDetails?.other?.gatherings || 0,
        pensionWithdrawal: formData.deductionDetails?.other?.pensionWithdrawal || 0
      });

      const updatedOther = response.data.data;
      handleInputChange('deductionDetails', {
        ...formData.deductionDetails,
        other: updatedOther
      });
      
      toast({
        title: "Success",
        description: "Other deductions saved successfully",
      });
    } catch (error) {
      console.error("Error saving other deductions:", error);
      toast({
        title: "Error",
        description: "Failed to save other deductions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleBankChange(field: string, value: string) {
    setNewBank(prev => ({ ...prev, [field]: value }));
  }

  function handleVehicleChange(field: string, value: string) {
    setNewVehicle(prev => ({ ...prev, [field]: value }));
  }

  function handleUtilityChange(field: string, value: string) {
    setNewUtility(prev => ({ ...prev, [field]: value }));
  }

  function handleOtherCheck(field: string, checked: boolean) {
    setOtherChecks(prev => ({ ...prev, [field]: checked }));
  }

  function handleOtherInput(field: string, value: string) {
    handleInputChange('deductionDetails', {
      ...formData.deductionDetails,
      other: {
        ...formData.deductionDetails?.other,
        [field]: parseFloat(value.replace(/,/g, '')) || 0
      }
    });
  }

  async function handleContinue() {
    try {
      setIsLoading(true);
      
      // Save all data before proceeding
      if (showOtherForm && formData.deductionDetails?.other) {
        await saveOtherDeductions();
      }
      
      // Proceed to next step
      nextStep();
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error",
        description: "Failed to save data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center w-full mt-8">
      <h2 className="text-3xl font-bold text-center mb-2">
        Here are some of the <span className="text-[#15803d]">common withholding taxes</span> you might have paid
      </h2>
      <div className="text-center text-lg text-muted-foreground mb-2">
        If you haven't paid any advance tax on these activities then click continue
      </div>
      <div className="mb-4">
        <span className="font-bold underline text-[#15803d] text-lg cursor-pointer">Adjustment for taxes</span>
      </div>
      <div className="flex flex-row justify-center gap-16 mt-4">
        {/* Bank Transaction */}
        <div className="flex flex-col items-center cursor-pointer" onClick={() => toggleDeduction('bank_transactions')}>
          <span className="mb-2">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="8" y="16" width="48" height="32" rx="8" fill="#f87171"/><rect x="16" y="24" width="32" height="16" rx="4" fill="#fbbf24"/><text x="32" y="38" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#fff">₨</text></svg>
          </span>
          <span className="text-lg mt-1">Bank Transaction</span>
        </div>
        {/* Vehicle */}
        <div className="flex flex-col items-center cursor-pointer" onClick={() => toggleDeduction('vehicles')}>
          <span className="mb-2">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="12" y="32" width="40" height="16" rx="8" fill="#64748b"/><circle cx="20" cy="52" r="6" fill="#ef4444"/><circle cx="44" cy="52" r="6" fill="#ef4444"/><rect x="20" y="24" width="24" height="12" rx="4" fill="#fbbf24"/></svg>
          </span>
          <span className="text-lg mt-1">Vehicle</span>
        </div>
        {/* Utilities */}
        <div className="flex flex-col items-center cursor-pointer" onClick={() => toggleDeduction('utilities')}>
          <span className="mb-2">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="20" y="28" width="24" height="24" rx="8" fill="#fbbf24"/><polygon points="32,28 40,12 48,28" fill="#f87171"/><rect x="28" y="40" width="8" height="8" rx="2" fill="#38bdf8"/></svg>
          </span>
          <span className="text-lg mt-1">Utilities</span>
        </div>
        {/* Other */}
        <div className="flex flex-col items-center cursor-pointer" onClick={() => toggleDeduction('other')}>
          <span className="mb-2">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="16" y="32" width="32" height="16" rx="8" fill="#34d399"/><rect x="24" y="24" width="16" height="16" rx="4" fill="#fbbf24"/><circle cx="32" cy="40" r="6" fill="#f87171"/></svg>
          </span>
          <span className="text-lg mt-1">Other</span>
        </div>
      </div>

      {showBankForm && (
        <div className="w-full max-w-xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-center mb-6">Bank Transaction</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Transaction Type</label>
              <Select value={newBank.transactionType} onValueChange={v => handleBankChange('transactionType', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Select Bank</label>
              <Select value={newBank.bankName} onValueChange={v => handleBankChange('bankName', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent>
                  {bankList.map(bank => (
                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Account No.</label>
              <Input value={newBank.accountNumber} onChange={e => handleBankChange('accountNumber', e.target.value)} placeholder="Enter account number" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Tax Deducted</label>
              <Input value={newBank.taxDeducted} onChange={e => handleBankChange('taxDeducted', e.target.value)} placeholder="Enter tax deducted" />
            </div>
            <Button className="mt-4 bg-gradient-to-r from-green-500 to-green-400 text-white text-lg font-bold" onClick={addBankEntry} disabled={isLoading}>
              {isLoading ? "Saving..." : "Add New Bank"}
            </Button>
          </div>
          {Array.isArray(formData.deductionDetails?.bankTransactions) && formData.deductionDetails.bankTransactions.length > 0 && (
            <div className="mt-8">
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Transaction Type</th>
                    <th className="px-4 py-2">Bank</th>
                    <th className="px-4 py-2">Account No.</th>
                    <th className="px-4 py-2">Tax Deducted</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.deductionDetails.bankTransactions.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">{entry.transactionType}</td>
                      <td className="px-4 py-2">{entry.bankName}</td>
                      <td className="px-4 py-2">{entry.accountNumber}</td>
                      <td className="px-4 py-2">{entry.taxDeducted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showVehicleForm && (
        <div className="w-full max-w-xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-center mb-6">Vehicles</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Select types of activity</label>
              <Select value={newVehicle.activityType} onValueChange={v => handleVehicleChange('activityType', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleActivities.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Select type of vehicle</label>
              <Select value={newVehicle.vehicleType} onValueChange={v => handleVehicleChange('vehicleType', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Registration No.</label>
              <Input value={newVehicle.registrationNumber} onChange={e => handleVehicleChange('registrationNumber', e.target.value)} placeholder="Enter registration number" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Tax Deducted</label>
              <Input value={newVehicle.taxDeducted} onChange={e => handleVehicleChange('taxDeducted', e.target.value)} placeholder="Enter tax deducted" />
            </div>
            <Button className="mt-4 bg-gradient-to-r from-green-500 to-green-400 text-white text-lg font-bold" onClick={addVehicleEntry} disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Another Vehicle"}
            </Button>
          </div>
          {Array.isArray(formData.deductionDetails?.vehicles) && formData.deductionDetails.vehicles.length > 0 && (
            <div className="mt-8">
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Activity Type</th>
                    <th className="px-4 py-2">Vehicle Type</th>
                    <th className="px-4 py-2">Registration No.</th>
                    <th className="px-4 py-2">Tax Deducted</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.deductionDetails.vehicles.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">{entry.activityType}</td>
                      <td className="px-4 py-2">{entry.vehicleType}</td>
                      <td className="px-4 py-2">{entry.registrationNumber}</td>
                      <td className="px-4 py-2">{entry.taxDeducted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showUtilitiesForm && (
        <div className="w-full max-w-xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-center mb-6">Utilities</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Select types of utility service</label>
              <Select value={newUtility.utilityType} onValueChange={v => handleUtilityChange('utilityType', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select utility service" />
                </SelectTrigger>
                <SelectContent>
                  {utilityTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Provider</label>
              <Input value={newUtility.provider} onChange={e => handleUtilityChange('provider', e.target.value)} placeholder="Enter provider type" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Consumer No. / Registered No.</label>
              <Input value={newUtility.consumerNumber} onChange={e => handleUtilityChange('consumerNumber', e.target.value)} placeholder="Enter consumer or registered number" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-48 text-right text-lg font-medium">Tax Deducted</label>
              <Input value={newUtility.taxDeducted} onChange={e => handleUtilityChange('taxDeducted', e.target.value)} placeholder="Enter tax deducted" />
            </div>
            <Button className="mt-4 bg-gradient-to-r from-green-500 to-green-400 text-white text-lg font-bold" onClick={addUtilityEntry} disabled={isLoading}>
              {isLoading ? "Saving..." : "Add New Utility"}
            </Button>
            <div className="text-center mt-2 text-gray-700 underline cursor-pointer">View All Utilities</div>
          </div>
          {Array.isArray(formData.deductionDetails.utilities) && formData.deductionDetails.utilities.length > 0 && (
            <div className="mt-8">
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Utility Type</th>
                    <th className="px-4 py-2">Provider</th>
                    <th className="px-4 py-2">Consumer/Reg. No.</th>
                    <th className="px-4 py-2">Tax Deducted</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.deductionDetails.utilities.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">{entry.utilityType}</td>
                      <td className="px-4 py-2">{entry.provider}</td>
                      <td className="px-4 py-2">{entry.consumerNumber}</td>
                      <td className="px-4 py-2">{entry.taxDeducted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showOtherForm && (
        <div className="w-full max-w-3xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-center mb-6">Others</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input type="checkbox" checked={otherChecks.purchase} onChange={e => handleOtherCheck('purchase', e.target.checked)} className="accent-green-700 w-5 h-5" />
              <label className="w-96 text-right text-lg font-medium">Tax paid at the time of property transaction - Purchase</label>
              {otherChecks.purchase && (
                <input 
                  className="border rounded-lg px-4 py-2 text-lg flex-1" 
                  placeholder="Enter amount here" 
                  value={formData.deductionDetails?.other?.propertyPurchase || ''} 
                  onChange={e => handleOtherInput('propertyPurchase', e.target.value)} 
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <input type="checkbox" checked={otherChecks.sale} onChange={e => handleOtherCheck('sale', e.target.checked)} className="accent-green-700 w-5 h-5" />
              <label className="w-96 text-right text-lg font-medium">Tax paid at the time of property transaction - Sale</label>
              {otherChecks.sale && (
                <input 
                  className="border rounded-lg px-4 py-2 text-lg flex-1" 
                  placeholder="Enter amount here" 
                  value={formData.deductionDetails?.other?.propertySale || ''} 
                  onChange={e => handleOtherInput('propertySale', e.target.value)} 
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <input type="checkbox" checked={otherChecks.functions} onChange={e => handleOtherCheck('functions', e.target.checked)} className="accent-green-700 w-5 h-5" />
              <label className="w-96 text-right text-lg font-medium">Functions & Gathering</label>
              {otherChecks.functions && (
                <input 
                  className="border rounded-lg px-4 py-2 text-lg flex-1" 
                  placeholder="Enter amount here" 
                  value={formData.deductionDetails?.other?.gatherings || ''} 
                  onChange={e => handleOtherInput('gatherings', e.target.value)} 
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <input type="checkbox" checked={otherChecks.pension} onChange={e => handleOtherCheck('pension', e.target.checked)} className="accent-green-700 w-5 h-5" />
              <label className="w-96 text-right text-lg font-medium">Withdrawal of funds from Voluntary Pension Scheme</label>
              {otherChecks.pension && (
                <input 
                  className="border rounded-lg px-4 py-2 text-lg flex-1" 
                  placeholder="Enter amount here" 
                  value={formData.deductionDetails?.other?.pensionWithdrawal || ''} 
                  onChange={e => handleOtherInput('pensionWithdrawal', e.target.value)} 
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* <div className="mt-8 w-full flex justify-center">
        <Button 
          className="bg-gradient-to-r from-green-500 to-green-400 text-white text-lg font-bold px-8 py-6" 
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div> */}
    </div>
  );
}