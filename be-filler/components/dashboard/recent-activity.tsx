"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Activity, FileText, BarChart3, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { TaxFilingService, ITaxFiling } from "@/services/taxFiling.service"
import { axiosInstance } from "@/lib/ApiClient"
import { useToast } from "@/hooks/use-toast"
import Cookies from "js-cookie"
import { DocumentService, IDocument } from "@/services/document.service"


interface Activity {
  id: string
  type: "tax-return" | "document"
  title: string
  date: string
  status?: string
}

export function RecentActivity() {
  const router = useRouter()
  const { toast } = useToast()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated()) {
        console.log("Redirecting to /auth/login due to unauthenticated user")
        router.push("/auth/login")
        return
      }

      const user = getCurrentUser()
      if (!user || !user.id) {
        console.log("Redirecting to /auth/login due to missing or invalid user")
        router.push("/auth/login")
        return
      }

      try {
        const taxService = new TaxFilingService()
        const docService = new DocumentService()

        const [taxFilings, documents] = await Promise.all([
          taxService.getByUser(user.id),
          docService.getByUser(user.id),
        ])

        const activityList: Activity[] = [
          ...taxFilings.map((item: ITaxFiling) => ({
            id: item.id,
            type: "tax-return" as const,
            title: `Tax return filed for ${item.taxYear}`,
            date: item.createdAt ?? "",
            status: item.status,
          })),
          ...documents.map((item: IDocument) => ({
            id: item.id,
            type: "document" as const,
            title: `Document ${item.name} uploaded(${item.type})`,
            date: item.createdAt ?? "",
          })),
        ]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 6)

        setActivities(activityList)
      } catch (err: any) {
        console.error("Error fetching activities:", err.message)
        setError("Failed to load recent activities")
        toast({
          title: "Error",
          description: "Unable to load recent activities. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, toast])

  const getIcon = (activity: Activity) => {
    switch (activity.type) {
      case "tax-return":
        return <FileText className="h-4 w-4" />
      case "document":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusIcon = (activity: Activity) => {
    if (activity.type === "document") return null

    if (activity.status === "completed") {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    } else {
      return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground">Loading activities...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <CardDescription>Your latest actions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">No recent activities found.</div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div
                  className={`w - 9 h - 9 rounded - full flex items - center justify - center flex - shrink - 0 ${activity.type === "tax-return"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    } `}
                >
                  {getIcon(activity)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{activity.title}</p>
                    {getStatusIcon(activity)}
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" /> {formatDate(activity.date)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}