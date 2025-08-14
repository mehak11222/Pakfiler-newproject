"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, DollarSign, FileCheck, User2, BookOpenText } from "lucide-react"
import Unauthorized from "@/components/Unauthorized"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState<{
    totalDocuments: number
    totalUsers: number
    totalCharges: number
    totalTaxFilings: number
  } | null>(null)

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      const token = Cookies.get("token")
      if (!token) return router.push("/auth/login")

      try {
        const res = await fetch("https://backend-production-5fad.up.railway.app/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) throw new Error("Unauthorized")

        const data = await res.json()
        if (data?.user?.role !== "admin") {
          setUser(null)
        } else {
          setUser(data.user)
          await fetchStatistics(token)
        }
      } catch (err) {
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    const fetchStatistics = async (token: string) => {
      try {
        const dashboardRes = await fetch("https://backend-production-5fad.up.railway.app/api/admin/documents/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const chargeRes = await fetch("https://backend-production-5fad.up.railway.app/api/service-charge/count", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!dashboardRes.ok || !chargeRes.ok) throw new Error("Failed to fetch statistics")

        const dashboardData = await dashboardRes.json()
        const chargeData = await chargeRes.json()

        setStatistics({
          totalDocuments: dashboardData?.data?.documents?.total || 0,
          totalUsers: dashboardData?.data?.users?.total || 0,
          totalTaxFilings: dashboardData?.data?.taxFilings?.total || 0,
          totalCharges: chargeData?.total || 0,
        })
      } catch (error) {
        console.error("Error fetching statistics:", error)
      }
    }

    fetchProfileAndStats()
  }, [router])

  const services = [
    {
      title: "Users Management",
      description: "View and manage all users",
      icon: User2,
      href: "/admin/users",
      color: "bg-orange-500",
    },
    {
      title: "Document Management",
      description: "Organize and manage business documents",
      icon: FileText,
      href: "/admin/document-management",
      color: "bg-blue-500",
    },
    {
      title: "Service Charges",
      description: "Track and manage service charges",
      icon: DollarSign,
      href: "/admin/service-charges",
      color: "bg-green-500",
    },
    {
      title: "Tax Filing",
      description: "Handle tax filings and compliance",
      icon: FileCheck,
      href: "/admin/tax-filing",
      color: "bg-red-500",
    },
    {
      title: "Reports",
      description: "Generate document reports",
      icon: BookOpenText,
      href: "/admin/reports",
      color: "bg-yellow-500",
    },
  ]

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return <Unauthorized />
  }

  return (
    <div className="container px-4 mx-auto py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, Admin</h1>
        <p className="text-muted-foreground">Manage your administration tasks</p>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#af0e0e]">
              {statistics ? statistics.totalUsers : "--"}
            </div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#af0e0e]">
              {statistics ? statistics.totalDocuments : "--"}
            </div>
            <p className="text-sm text-muted-foreground">Total Documents</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {statistics ? statistics.totalCharges : "--"}
            </div>
            <p className="text-sm text-muted-foreground">Total Charges</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {statistics ? statistics.totalTaxFilings : "--"}
            </div>
            <p className="text-sm text-muted-foreground">Total Tax Filings</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const IconComponent = service.icon
          return (
            <Card
              key={index}
              onClick={() => router.push(service.href)}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${service.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </CardDescription>
                <Button variant="outline" className="w-full">View</Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
