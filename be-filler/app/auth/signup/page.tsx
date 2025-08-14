"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { FileDigit, Lock, Mail, Phone, User } from "lucide-react"
import axios from "axios"

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phoneNumber: z
      .string()
      .trim()
      .transform((val) => val.replace(/[\s-]/g, ""))
      .superRefine((val, ctx) => {
        if (!/^(\+92[0-9]{10}|0[0-9]{10})$/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter a valid Pakistani phone number (e.g., +923001234567 or 03001234567)",
          })
        }
      }),
    cnic: z.string().regex(/^\d{13}$/, "CNIC must be 13 digits"),
    role: z.enum(["user", "admin", "accountant"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

async function registerUser(data: {
  email: string
  fullName: string
  phoneNumber: string
  cnic: string
  password: string
  role: string
}): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await axios.post("https://backend-production-5fad.up.railway.app/api/auth/register", {
      email: data.email,
      fullName: data.fullName,
      phone: data.phoneNumber,
      cnic: data.cnic,
      password: data.password,
      role: data.role,
    })
    console.log("Register response:", response.data)
    return { success: true, message: response.data.message }
  } catch (error: any) {
    console.error("Registration error:", error.message, error.response?.data)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to register user",
    }
  }
}

export default function SignupPage() {
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phoneNumber: "",
      cnic: "",
      role: "user",
      password: "",
      confirmPassword: "",
      terms: true,
    },
  })

  const onSubmit = async (data: SignupFormValues): Promise<void> => {
    const result = await registerUser({
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      cnic: data.cnic,
      password: data.password,
      role: data.role,
    })

    if (result.success) {
      toast({
        title: "Account Created",
        description: "Your account has been created successfully. You can now log in.",
      })
      setTimeout(() => {
        window.location.href = "/auth/login"
      }, 1500)
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to register. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Befiler Logo"
              width={160}
              height={70}
              priority
              className="mx-auto h-[70px] w-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">Sign up to get started with Befiler</p>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  {...register("email")}
                  className="pl-10"
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  type="text"
                  {...register("fullName")}
                  className="pl-10"
                />
              </div>
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  placeholder="+923001234567 or 03001234567"
                  type="tel"
                  {...register("phoneNumber")}
                  className="pl-10"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC</Label>
              <div className="relative">
                <FileDigit className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cnic"
                  placeholder="3520112345678"
                  type="text"
                  {...register("cnic")}
                  className="pl-10"
                />
              </div>
              {errors.cnic && <p className="text-sm text-destructive">{errors.cnic.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <select
                id="role"
                {...register("role")}
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="accountant">Accountant</option>
              </select>
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  {...register("password")}
                  className="pl-10"
                />
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  type="password"
                  {...register("confirmPassword")}
                  className="pl-10"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", {
                  onChange: () => trigger("terms"),
                })}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link href="/terms-of-service" className="text-green-600 hover:underline">
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-green-600 hover:underline">
                    privacy policy
                  </Link>
                </Label>
                {errors.terms && <p className="text-sm text-destructive">{errors.terms.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-green-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
