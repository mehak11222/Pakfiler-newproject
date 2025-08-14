import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string | null) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function getInitials(name: string) {
  if (!name) return ""

  const nameParts = name.split(" ")
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()

  return nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase()
}

export function formatPhoneNumber(phoneNumber: string) {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "")

  // Check if it's a Pakistani number
  if (cleaned.startsWith("92")) {
    return `+92 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 12)}`
  }

  // Return in a standard format
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }

  return phoneNumber
}

export function formatCNIC(cnic: string) {
  // Remove any non-digit characters
  const cleaned = cnic.replace(/\D/g, "")

  if (cleaned.length !== 13) return cnic

  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12)}`
}

export function generateYears(startYear: number, endYear: number) {
  const years = []
  for (let year = endYear; year >= startYear; year--) {
    years.push({
      value: `${year}-${year + 1}`,
      label: `${year}-${year + 1}`,
    })
  }
  return years
}

export const taxYears = generateYears(2015, new Date().getFullYear())
