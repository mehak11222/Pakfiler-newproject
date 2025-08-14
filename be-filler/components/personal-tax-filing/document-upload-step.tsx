
"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { NTNService } from "@/services/ntn.service"
import { getCurrentUser, isAuthenticated } from "@/lib/auth"

interface DocumentUploadStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
}

export function DocumentUploadStep({ formData, handleInputChange }: DocumentUploadStepProps) {
  const router = useRouter()
  const user = getCurrentUser();
  const [isNtnRegistered, setIsNtnRegistered] = useState<boolean>(false);
  // Check if NTN is registered or identityCard is present
  useEffect(() => {
    const fetchNTN = async () => {
      const ns = new NTNService();
      const ntn = await ns.getAllNTNs()
      if (ntn.length > 0) {
        setIsNtnRegistered(true)
      }
    }
    fetchNTN();
  }, [user])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Document Upload</h2>
      <p className="text-sm text-muted-foreground">Confirm document upload and NTN registration status</p>

      {/* Document Upload Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="documentsUploaded"
          checked={formData.documentsUploaded || false}
          onCheckedChange={(checked) => handleInputChange("documentsUploaded", checked)}
        />
        <Label htmlFor="documentsUploaded">I have uploaded all required documents</Label>
      </div>

      {/* NTN Status */}
      <div className="mt-4">
        {isNtnRegistered ? (
          <Alert>
            <AlertDescription className="text-green-600">
              NTN already registered.
            </AlertDescription>
          </Alert>
        ) : (
          <Button
            onClick={() => router.push("/user-services/ntn-registration")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Register NTN
          </Button>
        )}
      </div>
    </div>
  )
}