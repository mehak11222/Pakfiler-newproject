"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { registerUser, validateCNIC, formatCNIC } from "@/lib/auth"
import { countryCodes } from "@/lib/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const userSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    countryCode: z.string(),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    cnic: z.string().refine((val) => validateCNIC(val), {
      message: "CNIC must be in the format XXXXX-XXXXXXX-X",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type UserFormValues = z.infer<typeof userSchema>

interface UserFormProps {
  email: string
}

export function UserForm({ email }: UserFormProps) {
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
      countryCode: "+92",
      phoneNumber: "",
      cnic: "",
    },
  })

  const onSubmit = async (data: UserFormValues) => {
    try {
      // Format the CNIC
      const formattedCNIC = formatCNIC(data.cnic)

      // Format the phone number with country code
      const formattedPhone = `${data.countryCode} ${data.phoneNumber}`

      // Register the user
      const result = registerUser({
        name: data.name,
        email,
        password: data.password,
        mobile: formattedPhone,
        cnic: formattedCNIC,
        role: "user", // Default role
      })

      if (result.success) {
        toast({
          title: "Registration Successful",
          description: "You have been registered successfully. Redirecting to dashboard...",
          variant: "default",
        })

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle CNIC formatting
  const handleCNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")

    if (value.length <= 13) {
      let formatted = ""

      if (value.length > 0) {
        formatted = value.substring(0, Math.min(5, value.length))

        if (value.length > 5) {
          formatted += "-" + value.substring(5, Math.min(12, value.length))

          if (value.length > 12) {
            formatted += "-" + value.substring(12, 13)
          }
        }
      }

      setValue("cnic", formatted)
    }
  }

  const watchedCNIC = watch("cnic")

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Complete Your Profile</h1>
        <p className="text-muted-foreground">Please provide the following information to complete your registration.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number</Label>
          <div className="flex gap-2">
            <Select defaultValue="+92" onValueChange={(value) => setValue("countryCode", value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.code} ({country.country})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input id="phoneNumber" placeholder="3XX XXXXXXX" {...register("phoneNumber")} className="flex-1" />
          </div>
          {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnic">CNIC Number</Label>
          <Input id="cnic" placeholder="XXXXX-XXXXXXX-X" value={watchedCNIC} onChange={handleCNICChange} />
          {errors.cnic && <p className="text-sm text-destructive">{errors.cnic.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-[#af0e0e] hover:bg-[#8a0b0b]" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Complete Registration"}
        </Button>
      </form>
    </div>
  )
}
