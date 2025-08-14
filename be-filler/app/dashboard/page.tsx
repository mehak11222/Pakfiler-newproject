"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  User, Users, FileText, UserCheck, Building, Receipt,
  DollarSign, Calculator, MailQuestion, Video, BookOpenText, Settings,
} from "lucide-react"
import Unauthorized from "@/components/Unauthorized"
import Cookies from "js-cookie"

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const token = Cookies.get("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      const res = await fetch("https://backend-production-5fad.up.railway.app/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Unauthorized")
      }

      const data = await res.json()

      if (data?.user?.role !== "user") {
        setUser(null)
      } else {
        setUser(data.user)
      }
    } catch (err) {
      console.error(err)
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }

  fetchUserProfile()
}, [router])

  const services = [
    {
      title: "Personal Tax Filing",
      description: "File your individual income tax returns",
      icon: User,
      href: "/user-services/personal-tax-filing",
      color: "bg-green-500",
    },
    {
      title: "Family Tax Filing",
      description: "File tax returns for family members",
      icon: Users,
      href: "/user-services/family-tax-filing",
      color: "bg-purple-500",
    },
    {
      title: "NTN Registration",
      description: "Register for National Tax Number",
      icon: FileText,
      href: "/user-services/ntn-registration",
      color: "bg-orange-500",
    },
    {
      title: "IRIS Profile Update",
      description: "Update your IRIS profile information",
      icon: UserCheck,
      href: "/user-services/iris-profile",
      color: "bg-cyan-500",
    },
    {
      title: "Business Incorporation",
      description: "Register and incorporate your business",
      icon: Building,
      href: "/user-services/business-incorporation",
      color: "bg-indigo-500",
    },
    {
      title: "GST Registration",
      description: "Register for Goods and Services Tax",
      icon: Receipt,
      href: "/user-services/gst-registration",
      color: "bg-pink-500",
    },
    {
      title: "Service Charges",
      description: "View and pay service charges",
      icon: DollarSign,
      href: "/user-services/service-charges",
      color: "bg-yellow-500",
    },
    {
      title: "Salary Tax Calculator",
      description: "Calculate your salary tax obligations",
      icon: Calculator,
      href: "/user-services/salary-tax-calculator",
      color: "bg-red-500",
    },
    {
      title: "FAQs",
      description: "View frequently asked questions",
      icon: MailQuestion,
      href: "/user-services/faqs",
      color: "bg-blue-500",
    },
    {
      title: "Videos",
      description: "View videos related to tax filing and NTN registration",
      icon: Video,
      href: "/user-services/videos",
      color: "bg-red-500",
    },
    {
      title: "Blogs & Updates",
      description: "View all blogs and updates related to tax filing and our app",
      icon: BookOpenText,
      href: "/user-services/blogs-and-updates",
      color: "bg-red-500",
    },
    {
      title: "Profile Settings",
      description: "Edit your profile and change your password",
      icon: Settings,
      href: "/user-services/personal-tax-filing/settings",
      color: "bg-gray-500",
    },
  ]

  const handleServiceClick = (href: string) => {
    router.push(href)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Unauthorized />
  }

  return (
    <div className="container px-4 mx-auto py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.fullName || user?.email?.split("@")[0]}
        </h1>
        <p className="text-muted-foreground">
          Choose a service to get started with your tax and business needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const IconComponent = service.icon
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleServiceClick(service.href)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${service.color} text-white group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                      {service.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </CardDescription>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-colors"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
