"use client"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Home,
  Car,
  Banknote,
  Shield,
  Gem,
  Globe,
  DollarSign,
  Layers,
  Loader2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Define interfaces matching backend structure
interface Property {
  propertyType: string
  size: number
  unitType: string
  address: string
  fbrValue: number
  cost: number
  _id?: string
}

interface Vehicle {
  vehicleType: string
  cost: number
  registrationNo: string
  _id?: string
}

interface BankAccount {
  bankName: string
  accountNo: string
  cost: number
  _id?: string
}

interface Insurance {
  companyName: string
  description: string
  premiumPaid: number
  _id?: string
}

interface Possession {
  possessionType: string
  description: string
  cost: number
  _id?: string
}

interface ForeignAsset {
  description: string
  cost: number
  _id?: string
}

interface Cash {
  balance: number
  _id?: string
}

interface OtherAsset {
  transactionType: string
  description: string
  amount: number
  _id?: string
}

interface Assets {
  properties?: Property[]
  vehicles?: Vehicle[]
  bankAccounts?: BankAccount[]
  insurances?: Insurance[]
  possessions?: Possession[]
  foreignAssets?: ForeignAsset[]
  cash?: Cash
  otherAssets?: OtherAsset[]
  newProperty?: {
    propertyType: string
    size: string
    unitType: string
    address: string
    fbrValue: string
    cost: string
  }
  newVehicle?: {
    vehicleType: string
    cost: string
    registrationNo: string
  }
  newBankAccount?: {
    bankName: string
    accountNo: string
    cost: string
  }
  newInsurance?: {
    companyName: string
    description: string
    premiumPaid: string
  }
  newPossession?: {
    possessionType: string
    description: string
    cost: string
  }
  newForeignAsset?: {
    description: string
    cost: string
  }
  newCash?: {
    balance: string
  }
  newOtherAsset?: {
    transactionType: string
    description: string
    amount: string
  }
}

interface AssetDetailsStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
}

// API configuration
const API_BASE_URL = "http://localhost:5000/api/assets"

// API service functions
const apiService = {
  async saveProperty(data: any) {
    const response = await fetch(`${API_BASE_URL}/property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        taxYear: data.taxYear,
        propertyType: data.propertyType,
        size: data.size,
        unitType: data.unitType,
        address: data.address,
        fbrValue: data.fbrValue,
        cost: data.cost,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save property")
    }

    return response.json()
  },

  async saveVehicle(data: any) {
    const response = await fetch(`${API_BASE_URL}/vehicle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        taxYear: data.taxYear,
        vehicleType: data.vehicleType,
        registrationNumber: data.registrationNo,
        cost: data.cost,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save vehicle")
    }

    return response.json()
  },

  async saveBankAccount(data: any) {
    const response = await fetch(`${API_BASE_URL}/bank-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        taxYear: data.taxYear,
        bankName: data.bankName,
        accountNumber: data.accountNo,
        balance: data.cost,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save bank account")
    }

    return response.json()
  },

  async saveInsurance(data: any) {
    const response = await fetch(`${API_BASE_URL}/insurance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        taxYear: data.taxYear,
        companyName: data.companyName,
        description: data.description,
        premiumPaid: data.premiumPaid,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save insurance")
    }

    return response.json()
  },

  async savePossession(data: any) {
    const response = await fetch(`${API_BASE_URL}/possession`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        taxYear: data.taxYear,
        possessionType: data.possessionType,
        description: data.description,
        cost: data.cost,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save possession")
    }

    return response.json()
  },

  async saveForeignAsset(data: any) {
    const response = await fetch(`${API_BASE_URL}/foreign-asset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        taxYear: data.taxYear,
        description: data.description,
        cost: data.cost,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save foreign asset")
    }

    return response.json()
  },

  async saveCash(data: any) {
    const response = await fetch(`${API_BASE_URL}/cash`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        taxYear: data.taxYear,
        balance: data.balance,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save cash balance")
    }

    return response.json()
  },

  async saveOtherAsset(data: any) {
    const response = await fetch(`${API_BASE_URL}/other-asset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        taxYear: data.taxYear,
        transactionType: data.transactionType,
        description: data.description,
        amount: data.amount,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save other asset")
    }

    return response.json()
  },
}

export default function AssetDetailsStep({ formData, handleInputChange }: AssetDetailsStepProps) {
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0)
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  // Get userId and taxYear from formData (these should come from previous steps)
  const userId = formData.userId || "64fd06ddc7a225c86e8f2345" // Default for testing
  const taxYear = formData.taxYear || "2024-2025" // Default for testing

  // Initialize wealthStatement.assets and new asset states
  useEffect(() => {
    if (!formData.wealthStatement?.assets || typeof formData.wealthStatement.assets !== "object") {
      handleInputChange("wealthStatement", { ...formData.wealthStatement, assets: {} })
    }
    if (!formData.wealthStatement?.assets?.newProperty) {
      updateAssetDetails("properties", {
        newProperty: { propertyType: "", size: "", unitType: "", address: "", fbrValue: "", cost: "" },
      })
    }
    if (!formData.wealthStatement?.assets?.newVehicle) {
      updateAssetDetails("vehicles", {
        newVehicle: { vehicleType: "", cost: "", registrationNo: "" },
      })
    }
    if (!formData.wealthStatement?.assets?.newBankAccount) {
      updateAssetDetails("bankAccounts", {
        newBankAccount: { bankName: "", accountNo: "", cost: "" },
      })
    }
    if (!formData.wealthStatement?.assets?.newInsurance) {
      updateAssetDetails("insurances", {
        newInsurance: { companyName: "", description: "", premiumPaid: "" },
      })
    }
    if (!formData.wealthStatement?.assets?.newPossession) {
      updateAssetDetails("possessions", {
        newPossession: { possessionType: "", description: "", cost: "" },
      })
    }
    if (!formData.wealthStatement?.assets?.newForeignAsset) {
      updateAssetDetails("foreignAssets", {
        newForeignAsset: { description: "", cost: "" },
      })
    }
    if (!formData.wealthStatement?.assets?.newCash) {
      updateAssetDetails("cash", { newCash: { balance: "" } })
    }
    if (!formData.wealthStatement?.assets?.newOtherAsset) {
      updateAssetDetails("otherAssets", {
        newOtherAsset: { transactionType: "", description: "", amount: "" },
      })
    }
  }, [formData.wealthStatement?.assets, handleInputChange, formData.wealthStatement, handleInputChange])

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }))
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "")
    return numericValue ? Number.parseInt(numericValue).toLocaleString() : ""
  }

  const handleCurrencyInput = (value: string) => {
    return value.replace(/[^\d]/g, "")
  }

  const assetsMap: Record<string, { label: string; icon: any }> = {
    properties: { label: "Properties", icon: Home },
    vehicles: { label: "Vehicles", icon: Car },
    bankAccounts: { label: "Bank Accounts", icon: Banknote },
    insurances: { label: "Insurances", icon: Shield },
    possessions: { label: "Possessions", icon: Gem },
    foreignAssets: { label: "Foreign Assets", icon: Globe },
    cash: { label: "Cash", icon: DollarSign },
    otherAssets: { label: "Other Assets", icon: Layers },
  }

  const selectedAssets = Array.isArray(formData.selectedAssets) ? formData.selectedAssets : []
  const currentAssetId = selectedAssets[currentAssetIndex] || ""
  const currentAssetTitle = assetsMap[currentAssetId]?.label || "Unknown Asset"
  const CurrentAssetIcon = assetsMap[currentAssetId]?.icon

  const updateAssetDetails = useCallback(
    (type: string, updates: Partial<Assets>) => {
      const updatedAssets = { ...formData.wealthStatement.assets, ...updates }
      handleInputChange("wealthStatement", { ...formData.wealthStatement, assets: updatedAssets })
    },
    [formData.wealthStatement?.assets, handleInputChange],
  )

  const isAssetCompleted = (assetId: string) => {
    const assets = formData.wealthStatement?.assets
    switch (assetId) {
      case "properties":
        return !!(assets?.properties && assets.properties.length > 0)
      case "vehicles":
        return !!(assets?.vehicles && assets.vehicles.length > 0)
      case "bankAccounts":
        return !!(assets?.bankAccounts && assets.bankAccounts.length > 0)
      case "insurances":
        return !!(assets?.insurances && assets.insurances.length > 0)
      case "possessions":
        return !!(assets?.possessions && assets.possessions.length > 0)
      case "foreignAssets":
        return !!(assets?.foreignAssets && assets.foreignAssets.length > 0)
      case "cash":
        return !!(assets?.cash && assets.cash.balance > 0)
      case "otherAssets":
        return !!(assets?.otherAssets && assets.otherAssets.length > 0)
      default:
        return false
    }
  }

  const handlePreviousAsset = () => {
    if (currentAssetIndex > 0) {
      setCurrentAssetIndex(currentAssetIndex - 1)
    }
  }

  const handleNextAsset = () => {
    if (currentAssetIndex < selectedAssets.length - 1) {
      setCurrentAssetIndex(currentAssetIndex + 1)
    }
  }

  const handleAssetNavigation = (index: number) => {
    setCurrentAssetIndex(index)
  }

  const renderAssetSection = (assetId: string) => {
    const assets = formData.wealthStatement?.assets || {}
    const isLoading = loadingStates[assetId] || false

    switch (assetId) {
      case "properties":
        return (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-green-50/50 animate-fade-in">
              <h4 className="font-medium mb-3">Add Property Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={assets.newProperty?.propertyType || ""}
                    onValueChange={(value) =>
                      updateAssetDetails("properties", {
                        newProperty: { ...assets.newProperty, propertyType: value },
                      })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={assets.newProperty?.size || ""}
                    onChange={(e) =>
                      updateAssetDetails("properties", {
                        newProperty: { ...assets.newProperty, size: e.target.value },
                      })
                    }
                    placeholder="Enter size (e.g., 500)"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitType">Unit Type</Label>
                  <Select
                    value={assets.newProperty?.unitType || ""}
                    onValueChange={(value) =>
                      updateAssetDetails("properties", {
                        newProperty: { ...assets.newProperty, unitType: value },
                      })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqft">Square Feet</SelectItem>
                      <SelectItem value="sqm">Square Meters</SelectItem>
                      <SelectItem value="marla">Marla</SelectItem>
                      <SelectItem value="kanal">Kanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={assets.newProperty?.address || ""}
                    onChange={(e) =>
                      updateAssetDetails("properties", {
                        newProperty: { ...assets.newProperty, address: e.target.value },
                      })
                    }
                    placeholder="Enter address"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fbrValue">FBR Value (PKR)</Label>
                  <Input
                    id="fbrValue"
                    value={formatCurrency(assets.newProperty?.fbrValue || "")}
                    onChange={(e) =>
                      updateAssetDetails("properties", {
                        newProperty: { ...assets.newProperty, fbrValue: handleCurrencyInput(e.target.value) },
                      })
                    }
                    placeholder="Enter FBR value"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (PKR)</Label>
                  <Input
                    id="cost"
                    value={formatCurrency(assets.newProperty?.cost || "")}
                    onChange={(e) =>
                      updateAssetDetails("properties", {
                        newProperty: { ...assets.newProperty, cost: handleCurrencyInput(e.target.value) },
                      })
                    }
                    placeholder="Enter cost"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={async () => {
                    const { propertyType, size, unitType, address, fbrValue, cost } = assets.newProperty || {}
                    if (!propertyType || !size || !unitType || !address || !fbrValue || !cost) {
                      toast({
                        title: "Error",
                        description: "Please fill all required fields for property.",
                        variant: "destructive",
                      })
                      return
                    }
                    if (isNaN(Number(size)) || isNaN(Number(fbrValue)) || isNaN(Number(cost))) {
                      toast({
                        title: "Error",
                        description: "Size, FBR value, and cost must be valid numbers.",
                        variant: "destructive",
                      })
                      return
                    }

                    setLoading("properties", true)
                    try {
                      const response = await apiService.saveProperty({
                        userId,
                        taxYear,
                        propertyType,
                        size: Number(size),
                        unitType,
                        address,
                        fbrValue: Number(fbrValue),
                        cost: Number(cost),
                      })

                      const newProperty: Property = {
                        ...response.data,
                        propertyType,
                        size: Number(size),
                        unitType,
                        address,
                        fbrValue: Number(fbrValue),
                        cost: Number(cost),
                      }

                      const currentProperties = Array.isArray(assets.properties) ? [...assets.properties] : []
                      updateAssetDetails("properties", {
                        properties: [...currentProperties, newProperty],
                        newProperty: { propertyType: "", size: "", unitType: "", address: "", fbrValue: "", cost: "" },
                      })

                      toast({
                        title: "Success",
                        description: "Property saved successfully to database.",
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to save property. Please try again.",
                        variant: "destructive",
                      })
                    } finally {
                      setLoading("properties", false)
                    }
                  }}
                  disabled={
                    isLoading ||
                    !assets.newProperty?.propertyType ||
                    !assets.newProperty?.size ||
                    !assets.newProperty?.unitType ||
                    !assets.newProperty?.address ||
                    !assets.newProperty?.fbrValue ||
                    !assets.newProperty?.cost
                  }
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Property
                    </>
                  )}
                </Button>
              </div>
            </div>
            {assets.properties && assets.properties.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium">Added Properties</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {assets.properties.map((property: Property, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-green-200 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const updatedProperties = assets.properties.filter((_: any, i: number) => i !== index)
                          updateAssetDetails("properties", { properties: updatedProperties })
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <div className="space-y-2 pr-6">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {property.propertyType}
                          </Badge>
                          {property._id && (
                            <Badge variant="secondary" className="text-xs">
                              Saved
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium text-sm">
                          {property.size} {property.unitType}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Address:</span>
                            <div className="font-medium">{property.address}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cost:</span>
                            <div className="font-medium text-green-600">PKR {property.cost.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-semibold text-lg">
                      PKR {assets.properties.reduce((total: number, p: Property) => total + p.cost, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm">No properties added yet</div>
                  <div className="text-xs">Add your first property using the form above</div>
                </div>
              </div>
            )}
          </div>
        )

      case "vehicles":
        return (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-green-50/50 animate-fade-in">
              <h4 className="font-medium mb-3">Add Vehicle Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={assets.newVehicle?.vehicleType || ""}
                    onValueChange={(value) =>
                      updateAssetDetails("vehicles", {
                        newVehicle: { ...assets.newVehicle, vehicleType: value },
                      })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="jeep">Jeep</SelectItem>
                      <SelectItem value="rickshaw">Rickshaw</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (PKR)</Label>
                  <Input
                    id="cost"
                    value={formatCurrency(assets.newVehicle?.cost || "")}
                    onChange={(e) =>
                      updateAssetDetails("vehicles", {
                        newVehicle: { ...assets.newVehicle, cost: handleCurrencyInput(e.target.value) },
                      })
                    }
                    placeholder="Enter cost"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNo">Registration No</Label>
                  <Input
                    id="registrationNo"
                    value={assets.newVehicle?.registrationNo || ""}
                    onChange={(e) =>
                      updateAssetDetails("vehicles", {
                        newVehicle: { ...assets.newVehicle, registrationNo: e.target.value },
                      })
                    }
                    placeholder="Enter registration number"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={async () => {
                    const { vehicleType, cost, registrationNo } = assets.newVehicle || {}
                    if (!vehicleType || !cost || !registrationNo) {
                      toast({
                        title: "Error",
                        description: "Please fill all required fields for vehicle.",
                        variant: "destructive",
                      })
                      return
                    }
                    if (isNaN(Number(cost))) {
                      toast({
                        title: "Error",
                        description: "Cost must be a valid number.",
                        variant: "destructive",
                      })
                      return
                    }

                    setLoading("vehicles", true)
                    try {
                      const response = await apiService.saveVehicle({
                        userId,
                        taxYear,
                        vehicleType,
                        cost: Number(cost),
                        registrationNo,
                      })

                      const newVehicle: Vehicle = {
                        ...response.data,
                        vehicleType,
                        cost: Number(cost),
                        registrationNo,
                      }

                      const currentVehicles = Array.isArray(assets.vehicles) ? [...assets.vehicles] : []
                      updateAssetDetails("vehicles", {
                        vehicles: [...currentVehicles, newVehicle],
                        newVehicle: { vehicleType: "", cost: "", registrationNo: "" },
                      })

                      toast({
                        title: "Success",
                        description: "Vehicle saved successfully to database.",
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to save vehicle. Please try again.",
                        variant: "destructive",
                      })
                    } finally {
                      setLoading("vehicles", false)
                    }
                  }}
                  disabled={
                    isLoading ||
                    !assets.newVehicle?.vehicleType ||
                    !assets.newVehicle?.cost ||
                    !assets.newVehicle?.registrationNo
                  }
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Vehicle
                    </>
                  )}
                </Button>
              </div>
            </div>
            {assets.vehicles && assets.vehicles.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium">Added Vehicles</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {assets.vehicles.map((vehicle: Vehicle, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-green-200 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const updatedVehicles = assets.vehicles.filter((_: any, i: number) => i !== index)
                          updateAssetDetails("vehicles", { vehicles: updatedVehicles })
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <div className="space-y-2 pr-6">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {vehicle.vehicleType}
                          </Badge>
                          {vehicle._id && (
                            <Badge variant="secondary" className="text-xs">
                              Saved
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium text-sm">{vehicle.registrationNo}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Cost:</span>
                            <div className="font-medium text-green-600">PKR {vehicle.cost.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-semibold text-lg">
                      PKR {assets.vehicles.reduce((total: number, v: Vehicle) => total + v.cost, 0).toLocaleString()}
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
        )

      case "bankAccounts":
        return (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-green-50/50 animate-fade-in">
              <h4 className="font-medium mb-3">Add Bank Account Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={assets.newBankAccount?.bankName || ""}
                    onChange={(e) =>
                      updateAssetDetails("bankAccounts", {
                        newBankAccount: { ...assets.newBankAccount, bankName: e.target.value },
                      })
                    }
                    placeholder="Enter bank name"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNo">Account Number</Label>
                  <Input
                    id="accountNo"
                    value={assets.newBankAccount?.accountNo || ""}
                    onChange={(e) =>
                      updateAssetDetails("bankAccounts", {
                        newBankAccount: { ...assets.newBankAccount, accountNo: e.target.value },
                      })
                    }
                    placeholder="Enter account number"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Balance (PKR)</Label>
                  <Input
                    id="cost"
                    value={formatCurrency(assets.newBankAccount?.cost || "")}
                    onChange={(e) =>
                      updateAssetDetails("bankAccounts", {
                        newBankAccount: { ...assets.newBankAccount, cost: handleCurrencyInput(e.target.value) },
                      })
                    }
                    placeholder="Enter balance"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={async () => {
                    const { bankName, accountNo, cost } = assets.newBankAccount || {}
                    if (!bankName || !accountNo || !cost) {
                      toast({
                        title: "Error",
                        description: "Please fill all required fields for bank account.",
                        variant: "destructive",
                      })
                      return
                    }
                    if (isNaN(Number(cost))) {
                      toast({
                        title: "Error",
                        description: "Balance must be a valid number.",
                        variant: "destructive",
                      })
                      return
                    }

                    setLoading("bankAccounts", true)
                    try {
                      const response = await apiService.saveBankAccount({
                        userId,
                        taxYear,
                        bankName,
                        accountNo,
                        cost: Number(cost),
                      })

                      const newBankAccount: BankAccount = {
                        ...response.data,
                        bankName,
                        accountNo,
                        cost: Number(cost),
                      }

                      const currentBankAccounts = Array.isArray(assets.bankAccounts) ? [...assets.bankAccounts] : []
                      updateAssetDetails("bankAccounts", {
                        bankAccounts: [...currentBankAccounts, newBankAccount],
                        newBankAccount: { bankName: "", accountNo: "", cost: "" },
                      })

                      toast({
                        title: "Success",
                        description: "Bank account saved successfully to database.",
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to save bank account. Please try again.",
                        variant: "destructive",
                      })
                    } finally {
                      setLoading("bankAccounts", false)
                    }
                  }}
                  disabled={
                    isLoading ||
                    !assets.newBankAccount?.bankName ||
                    !assets.newBankAccount?.accountNo ||
                    !assets.newBankAccount?.cost
                  }
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Bank Account
                    </>
                  )}
                </Button>
              </div>
            </div>
            {assets.bankAccounts && assets.bankAccounts.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium">Added Bank Accounts</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {assets.bankAccounts.map((account: BankAccount, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-green-200 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const updatedBankAccounts = assets.bankAccounts.filter((_: any, i: number) => i !== index)
                          updateAssetDetails("bankAccounts", { bankAccounts: updatedBankAccounts })
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <div className="space-y-2 pr-6">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Bank Account
                          </Badge>
                          {account._id && (
                            <Badge variant="secondary" className="text-xs">
                              Saved
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium text-sm">{account.bankName}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Account No:</span>
                            <div className="font-medium">{account.accountNo}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Balance:</span>
                            <div className="font-medium text-green-600">PKR {account.cost.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Balance:</span>
                    <span className="font-semibold text-lg">
                      PKR{" "}
                      {assets.bankAccounts
                        .reduce((total: number, a: BankAccount) => total + a.cost, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm">No bank accounts added yet</div>
                  <div className="text-xs">Add your first bank account using the form above</div>
                </div>
              </div>
            )}
          </div>
        )

      case "insurances":
        return (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-green-50/50 animate-fade-in">
              <h4 className="font-medium mb-3">Add Insurance Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={assets.newInsurance?.companyName || ""}
                    onChange={(e) =>
                      updateAssetDetails("insurances", {
                        newInsurance: { ...assets.newInsurance, companyName: e.target.value },
                      })
                    }
                    placeholder="Enter company name"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={assets.newInsurance?.description || ""}
                    onChange={(e) =>
                      updateAssetDetails("insurances", {
                        newInsurance: { ...assets.newInsurance, description: e.target.value },
                      })
                    }
                    placeholder="Enter description"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premiumPaid">Premium Paid (PKR)</Label>
                  <Input
                    id="premiumPaid"
                    value={formatCurrency(assets.newInsurance?.premiumPaid || "")}
                    onChange={(e) =>
                      updateAssetDetails("insurances", {
                        newInsurance: { ...assets.newInsurance, premiumPaid: handleCurrencyInput(e.target.value) },
                      })
                    }
                    placeholder="Enter premium paid"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={async () => {
                    const { companyName, description, premiumPaid } = assets.newInsurance || {}
                    if (!companyName || !description || !premiumPaid) {
                      toast({
                        title: "Error",
                        description: "Please fill all required fields for insurance.",
                        variant: "destructive",
                      })
                      return
                    }
                    if (isNaN(Number(premiumPaid))) {
                      toast({
                        title: "Error",
                        description: "Premium paid must be a valid number.",
                        variant: "destructive",
                      })
                      return
                    }

                    setLoading("insurances", true)
                    try {
                      const response = await apiService.saveInsurance({
                        userId,
                        taxYear,
                        companyName,
                        description,
                        premiumPaid: Number(premiumPaid),
                      })

                      const newInsurance: Insurance = {
                        ...response.data,
                        companyName,
                        description,
                        premiumPaid: Number(premiumPaid),
                      }

                      const currentInsurances = Array.isArray(assets.insurances) ? [...assets.insurances] : []
                      updateAssetDetails("insurances", {
                        insurances: [...currentInsurances, newInsurance],
                        newInsurance: { companyName: "", description: "", premiumPaid: "" },
                      })

                      toast({
                        title: "Success",
                        description: "Insurance saved successfully to database.",
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to save insurance. Please try again.",
                        variant: "destructive",
                      })
                    } finally {
                      setLoading("insurances", false)
                    }
                  }}
                  disabled={
                    isLoading ||
                    !assets.newInsurance?.companyName ||
                    !assets.newInsurance?.description ||
                    !assets.newInsurance?.premiumPaid
                  }
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Insurance
                    </>
                  )}
                </Button>
              </div>
            </div>
            {assets.insurances && assets.insurances.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium">Added Insurances</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {assets.insurances.map((insurance: Insurance, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-green-200 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const updatedInsurances = assets.insurances.filter((_: any, i: number) => i !== index)
                          updateAssetDetails("insurances", { insurances: updatedInsurances })
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <div className="space-y-2 pr-6">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Insurance
                          </Badge>
                          {insurance._id && (
                            <Badge variant="secondary" className="text-xs">
                              Saved
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium text-sm">{insurance.companyName}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Description:</span>
                            <div className="font-medium">{insurance.description}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Premium:</span>
                            <div className="font-medium text-green-600">
                              PKR {insurance.premiumPaid.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Premium Paid:</span>
                    <span className="font-semibold text-lg">
                      PKR{" "}
                      {assets.insurances
                        .reduce((total: number, i: Insurance) => total + i.premiumPaid, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm">No insurances added yet</div>
                  <div className="text-xs">Add your first insurance using the form above</div>
                </div>
              </div>
            )}
          </div>
        )

      case "possessions":
        return (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-green-50/50 animate-fade-in">
              <h4 className="font-medium mb-3">Add Possession Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="possessionType">Possession Type</Label>
                  <Select
                    value={assets.newPossession?.possessionType || ""}
                    onValueChange={(value) =>
                      updateAssetDetails("possessions", {
                        newPossession: { ...assets.newPossession, possessionType: value },
                      })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="antiques">Antiques</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={assets.newPossession?.description || ""}
                    onChange={(e) =>
                      updateAssetDetails("possessions", {
                        newPossession: { ...assets.newPossession, description: e.target.value },
                      })
                    }
                    placeholder="Enter description"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (PKR)</Label>
                  <Input
                    id="cost"
                    value={formatCurrency(assets.newPossession?.cost || "")}
                    onChange={(e) =>
                      updateAssetDetails("possessions", {
                        newPossession: { ...assets.newPossession, cost: handleCurrencyInput(e.target.value) },
                      })
                    }
                    placeholder="Enter cost"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={async () => {
                    const { possessionType, description, cost } = assets.newPossession || {}
                    if (!possessionType || !description || !cost) {
                      toast({
                        title: "Error",
                        description: "Please fill all required fields for possession.",
                        variant: "destructive",
                      })
                      return
                    }
                    if (isNaN(Number(cost))) {
                      toast({
                        title: "Error",
                        description: "Cost must be a valid number.",
                        variant: "destructive",
                      })
                      return
                    }

                    setLoading("possessions", true)
                    try {
                      const response = await apiService.savePossession({
                        userId,
                        taxYear,
                        possessionType,
                        description,
                        cost: Number(cost),
                      })

                      const newPossession: Possession = {
                        ...response.data,
                        possessionType,
                        description,
                        cost: Number(cost),
                      }

                      const currentPossessions = Array.isArray(assets.possessions) ? [...assets.possessions] : []
                      updateAssetDetails("possessions", {
                        possessions: [...currentPossessions, newPossession],
                        newPossession: { possessionType: "", description: "", cost: "" },
                      })

                      toast({
                        title: "Success",
                        description: "Possession saved successfully to database.",
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to save possession. Please try again.",
                        variant: "destructive",
                      })
                    } finally {
                      setLoading("possessions", false)
                    }
                  }}
                  disabled={
                    isLoading ||
                    !assets.newPossession?.possessionType ||
                    !assets.newPossession?.description ||
                    !assets.newPossession?.cost
                  }
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Possession
                    </>
                  )}
                </Button>
              </div>
            </div>
            {assets.possessions && assets.possessions.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium">Added Possessions</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {assets.possessions.map((possession: Possession, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-green-200 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const updatedPossessions = assets.possessions.filter((_: any, i: number) => i !== index)
                          updateAssetDetails("possessions", { possessions: updatedPossessions })
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <div className="space-y-2 pr-6">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {possession.possessionType}
                          </Badge>
                          {possession._id && (
                            <Badge variant="secondary" className="text-xs">
                              Saved
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium text-sm">{possession.description}</div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Cost:</span>
                          <div className="font-medium text-green-600">PKR {possession.cost.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-semibold text-lg">
                      PKR{" "}
                      {assets.possessions.reduce((total: number, p: Possession) => total + p.cost, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm">No possessions added yet</div>
                  <div className="text-xs">Add your first possession using the form above</div>
                </div>
              </div>
            )}
          </div>
        )

      case "foreignAssets":
        return (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-green-50/50 animate-fade-in">
              <h4 className="font-medium mb-3">Add Foreign Asset Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={assets.newForeignAsset?.description || ""}
                    onChange={(e) =>
                      updateAssetDetails("foreignAssets", {
                        newForeignAsset: { ...assets.newForeignAsset, description: e.target.value },
                      })
                    }
                    placeholder="Enter description"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (PKR)</Label>
                  <Input
                    id="cost"
                    value={formatCurrency(assets.newForeignAsset?.cost || "")}
                    onChange={(e) =>
                      updateAssetDetails("foreignAssets", {
                        newForeignAsset: { ...assets.newForeignAsset, cost: handleCurrencyInput(e.target.value) },
                      })
                    }
                    placeholder="Enter cost"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={async () => {
                    const { description, cost } = assets.newForeignAsset || {}
                    if (!description || !cost) {
                      toast({
                        title: "Error",
                        description: "Please fill all required fields for foreign asset.",
                        variant: "destructive",
                      })
                      return
                    }
                    if (isNaN(Number(cost))) {
                      toast({
                        title: "Error",
                        description: "Cost must be a valid number.",
                        variant: "destructive",
                      })
                      return
                    }

                    setLoading("foreignAssets", true)
                    try {
                      const response = await apiService.saveForeignAsset({
                        userId,
                        taxYear,
                        description,
                        cost: Number(cost),
                      })

                      const newForeignAsset: ForeignAsset = {
                        ...response.data,
                        description,
                        cost: Number(cost),
                      }

                      const currentForeignAssets = Array.isArray(assets.foreignAssets) ? [...assets.foreignAssets] : []
                      updateAssetDetails("foreignAssets", {
                        foreignAssets: [...currentForeignAssets, newForeignAsset],
                        newForeignAsset: { description: "", cost: "" },
                      })

                      toast({
                        title: "Success",
                        description: "Foreign asset saved successfully to database.",
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to save foreign asset. Please try again.",
                        variant: "destructive",
                      })
                    } finally {
                      setLoading("foreignAssets", false)
                    }
                  }}
                  disabled={isLoading || !assets.newForeignAsset?.description || !assets.newForeignAsset?.cost}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Foreign Asset
                    </>
                  )}
                </Button>
              </div>
            </div>
            {assets.foreignAssets && assets.foreignAssets.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium">Added Foreign Assets</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {assets.foreignAssets.map((asset: ForeignAsset, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-green-200 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const updatedForeignAssets = assets.foreignAssets.filter((_: any, i: number) => i !== index)
                          updateAssetDetails("foreignAssets", { foreignAssets: updatedForeignAssets })
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <div className="space-y-2 pr-6">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Foreign Asset
                          </Badge>
                          {asset._id && (
                            <Badge variant="secondary" className="text-xs">
                              Saved
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium text-sm">{asset.description}</div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Cost:</span>
                          <div className="font-medium text-green-600">PKR {asset.cost.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-semibold text-lg">
                      PKR{" "}
                      {assets.foreignAssets
                        .reduce((total: number, a: ForeignAsset) => total + a.cost, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm">No foreign assets added yet</div>
                  <div className="text-xs">Add your first foreign asset using the form above</div>
                </div>
              </div>
            )}
          </div>
        )

      case "cash":
        return (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-green-50/50 animate-fade-in">
              <h4 className="font-medium mb-3">Add Cash Balance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="balance">Balance (PKR)</Label>
                  <Input
                    id="balance"
                    value={formatCurrency(assets.newCash?.balance || "")}
                    onChange={(e) =>
                      updateAssetDetails("cash", {
                        newCash: { balance: handleCurrencyInput(e.target.value) },
                      })
                    }
                    placeholder="Enter cash balance"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={async () => {
                    const { balance } = assets.newCash || {}
                    if (!balance) {
                      toast({
                        title: "Error",
                        description: "Please enter cash balance.",
                        variant: "destructive",
                      })
                      return
                    }
                    if (isNaN(Number(balance))) {
                      toast({
                        title: "Error",
                        description: "Balance must be a valid number.",
                        variant: "destructive",
                      })
                      return
                    }

                    setLoading("cash", true)
                    try {
                      const response = await apiService.saveCash({
                        userId,
                        taxYear,
                        balance: Number(balance),
                      })

                      const newCash: Cash = {
                        ...response.data,
                        balance: Number(balance),
                      }

                      updateAssetDetails("cash", {
                        cash: newCash,
                        newCash: { balance: "" },
                      })

                      toast({
                        title: "Success",
                        description: "Cash balance saved successfully to database.",
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to save cash balance. Please try again.",
                        variant: "destructive",
                      })
                    } finally {
                      setLoading("cash", false)
                    }
                  }}
                  disabled={isLoading || !assets.newCash?.balance}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Update Cash Balance
                    </>
                  )}
                </Button>
              </div>
            </div>
            {assets.cash && (
              <div className="space-y-3">
                <h4 className="font-medium">Added Cash Balance</h4>
                <div className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow">
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-green-200 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      updateAssetDetails("cash", { cash: undefined })
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <div className="space-y-2 pr-6">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Cash
                      </Badge>
                      {assets.cash._id && (
                        <Badge variant="secondary" className="text-xs">
                          Saved
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Balance:</span>
                      <div className="font-medium text-green-600">PKR {assets.cash.balance.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Balance:</span>
                    <span className="font-semibold text-lg">PKR {assets.cash.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case "otherAssets":
        return (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-green-50/50 animate-fade-in">
              <h4 className="font-medium mb-3">Add Other Asset Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transactionType">Transaction Type</Label>
                  <Select
                    value={assets.newOtherAsset?.transactionType || ""}
                    onValueChange={(value) =>
                      updateAssetDetails("otherAssets", {
                        newOtherAsset: { ...assets.newOtherAsset, transactionType: value },
                      })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stocks">Stocks</SelectItem>
                      <SelectItem value="bonds">Bonds</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={assets.newOtherAsset?.description || ""}
                    onChange={(e) =>
                      updateAssetDetails("otherAssets", {
                        newOtherAsset: { ...assets.newOtherAsset, description: e.target.value },
                      })
                    }
                    placeholder="Enter description"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (PKR)</Label>
                  <Input
                    id="amount"
                    value={formatCurrency(assets.newOtherAsset?.amount || "")}
                    onChange={(e) =>
                      updateAssetDetails("otherAssets", {
                        newOtherAsset: { ...assets.newOtherAsset, amount: handleCurrencyInput(e.target.value) },
                      })
                    }
                    placeholder="Enter amount"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={async () => {
                    const { transactionType, description, amount } = assets.newOtherAsset || {}
                    if (!transactionType || !description || !amount) {
                      toast({
                        title: "Error",
                        description: "Please fill all required fields for other asset.",
                        variant: "destructive",
                      })
                      return
                    }
                    if (isNaN(Number(amount))) {
                      toast({
                        title: "Error",
                        description: "Amount must be a valid number.",
                        variant: "destructive",
                      })
                      return
                    }

                    setLoading("otherAssets", true)
                    try {
                      const response = await apiService.saveOtherAsset({
                        userId,
                        taxYear,
                        transactionType,
                        description,
                        amount: Number(amount),
                      })

                      const newOtherAsset: OtherAsset = {
                        ...response.data,
                        transactionType,
                        description,
                        amount: Number(amount),
                      }

                      const currentOtherAssets = Array.isArray(assets.otherAssets) ? [...assets.otherAssets] : []
                      updateAssetDetails("otherAssets", {
                        otherAssets: [...currentOtherAssets, newOtherAsset],
                        newOtherAsset: { transactionType: "", description: "", amount: "" },
                      })

                      toast({
                        title: "Success",
                        description: "Other asset saved successfully to database.",
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to save other asset. Please try again.",
                        variant: "destructive",
                      })
                    } finally {
                      setLoading("otherAssets", false)
                    }
                  }}
                  disabled={
                    isLoading ||
                    !assets.newOtherAsset?.transactionType ||
                    !assets.newOtherAsset?.description ||
                    !assets.newOtherAsset?.amount
                  }
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Other Asset
                    </>
                  )}
                </Button>
              </div>
            </div>
            {assets.otherAssets && assets.otherAssets.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium">Added Other Assets</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {assets.otherAssets.map((asset: OtherAsset, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-white relative group hover:shadow-md transition-shadow"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-green-200 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const updatedOtherAssets = assets.otherAssets.filter((_: any, i: number) => i !== index)
                          updateAssetDetails("otherAssets", { otherAssets: updatedOtherAssets })
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <div className="space-y-2 pr-6">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {asset.transactionType}
                          </Badge>
                          {asset._id && (
                            <Badge variant="secondary" className="text-xs">
                              Saved
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium text-sm">{asset.description}</div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Amount:</span>
                          <div className="font-medium text-green-600">PKR {asset.amount.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-semibold text-lg">
                      PKR{" "}
                      {assets.otherAssets
                        .reduce((total: number, a: OtherAsset) => total + a.amount, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm">No other assets added yet</div>
                  <div className="text-xs">Add your first other asset using the form above</div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>Asset type implementation in progress...</p>
          </div>
        )
    }
  }

  if (selectedAssets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No assets selected. Please go back to select applicable assets.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-80 flex-shrink-0">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-lg">Assets Progress</CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedAssets.length} asset{selectedAssets.length > 1 ? "s" : ""} selected
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedAssets.map((assetId: string, index: number) => {
              const isCompleted = isAssetCompleted(assetId)
              const isCurrent = index === currentAssetIndex
              const assetTitle = assetsMap[assetId].label
              const AssetIcon = assetsMap[assetId].icon
              return (
                <div
                  key={assetId}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isCurrent
                      ? "border-green-600 bg-green-600/5"
                      : isCompleted
                        ? "border-green-600 bg-green-50 hover:bg-green-100"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleAssetNavigation(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isCurrent
                            ? "bg-green-600 text-white"
                            : isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {isCompleted && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <AssetIcon className={`w-4 h-4 ${isCurrent ? "text-green-600" : ""}`} />
                          <div className={`font-medium text-sm ${isCurrent ? "text-green-600" : ""}`}>{assetTitle}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{isCompleted ? "Completed" : "Pending"}</div>
                      </div>
                    </div>
                    {isCurrent && <Badge variant="outline">Current</Badge>}
                  </div>
                </div>
              )
            })}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium">
                  {selectedAssets.filter((assetId: string) => isAssetCompleted(assetId)).length} of{" "}
                  {selectedAssets.length} completed
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (selectedAssets.filter((assetId: string) => isAssetCompleted(assetId)).length /
                        selectedAssets.length) *
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
                <CardTitle className="text-lg flex items-center gap-2">
                  {CurrentAssetIcon && <CurrentAssetIcon className="w-5 h-5 text-green-600" />}
                  {currentAssetTitle}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Step {currentAssetIndex + 1} of {selectedAssets.length}
                </p>
              </div>
              <Badge variant="outline">{isAssetCompleted(currentAssetId) ? "Completed" : "In Progress"}</Badge>
            </div>
          </CardHeader>
          <CardContent>{renderAssetSection(currentAssetId)}</CardContent>
        </Card>
        <div className="mt-8 flex justify-between px-4">
          <Button
            variant="outline"
            onClick={handlePreviousAsset}
            disabled={currentAssetIndex === 0}
            className="flex items-center bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Asset
          </Button>
          <Button
            onClick={handleNextAsset}
            disabled={currentAssetIndex === selectedAssets.length - 1}
            className="flex items-center"
          >
            Next Asset
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
