"use client"

import { v4 as uuidv4 } from "uuid"
import Cookies from "js-cookie"

// Mock function to generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Mock function to send OTP via email (in a real app, this would be an API call)
export const sendOTP = async (email: string, otp: string) => {
  console.log(`Sending OTP: ${otp} to email: ${email}`)
  // In a real app, this would be an API call to send an email

  // For demonstration, we'll just return a successful response
  return {
    success: true,
    message: "OTP sent successfully",
  }
}

// Mock function to verify OTP
export const verifyOTP = (email: string, otp: string, storedOTP: string) => {
  return otp === storedOTP
}

// Mock function to register a user
export const registerUser = (userData: any) => {
  const user = {
    id: uuidv4(),
    ...userData,
    createdAt: new Date().toISOString(),
  }

  // Store in localStorage
  localStorage.setItem("user", JSON.stringify(user))
  localStorage.setItem("token", `mock-jwt-token-${user.id}`)

  return {
    success: true,
    user,
    token: `mock-jwt-token-${user.id}`,
  }
}

// Mock function to log in a user
export const loginUser = (email: string, password: string) => {
  // In a real app, this would verify credentials against a database

  // For demo purposes, we'll create mock users
  const mockUsers = [
    {
      id: "1",
      email: "user@example.com",
      password: "user123",
      name: "Regular User",
      role: "user",
      mobile: "+92 3001234567",
      cnic: "12345-1234567-1",
    },
    {
      id: "2",
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
      mobile: "+92 3009876543",
      cnic: "54321-7654321-9",
    },
    {
      id: "3",
      email: "accountant@example.com",
      password: "accountant123",
      name: "Accountant User",
      role: "accountant",
      mobile: "+92 3005555555",
      cnic: "98765-4321987-6",
    },
  ]

  const user = mockUsers.find((u) => u.email === email && u.password === password)

  if (user) {
    const { password, ...userWithoutPassword } = user
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    localStorage.setItem("token", `mock-jwt-token-${user.id}`)
    Cookies.set("user", JSON.stringify(userWithoutPassword))
    Cookies.set("token", `mock-jwt-token-${user.id}`)

    return {
      success: true,
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}`,
    }
  }

  return {
    success: false,
    message: "Invalid email or password",
  }
}

// Mock function to check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false

  const token = Cookies.get("token")
  const userStr = Cookies.get("user")

  return !!token && !!userStr
}

// Mock function to get current user
export const getCurrentUser:any = () => {
  if (typeof window === "undefined") return null

  const userStr = Cookies.get("user")
  console.log(!!userStr)
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      if (!user) return null
      return user
    } catch (e) {
      return null
    }
  }

  return null
}


// Mock function to log out user
export const logoutUser = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

// Mock function to validate CNIC format
export const validateCNIC = (cnic: string) => {
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
  return cnicRegex.test(cnic)
}

// Function to format CNIC number
export const formatCNIC = (cnic: string) => {
  // Remove any non-numeric characters
  const numericOnly = cnic.replace(/[^0-9]/g, "")

  if (numericOnly.length !== 13) {
    return cnic // Return original if not valid length
  }

  // Format as XXXXX-XXXXXXX-X
  return `${numericOnly.slice(0, 5)}-${numericOnly.slice(5, 12)}-${numericOnly.slice(12)}`
}
