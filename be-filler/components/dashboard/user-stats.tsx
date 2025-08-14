"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, BarChart3, Bell, ArrowRight, Clock } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { TaxFilingService, ITaxFiling } from "@/services/taxFiling.service"
import { DocumentService, IDocument } from "@/services/document.service"
import { NotificationService, INotification } from "@/services/notifications.service"

interface TaxReturn {
  id: string;
  taxYear: string;
  filingDate: string;
  status: "Completed" | "Pending" | "Rejected";
  taxAmount: number;
  refundAmount?: number;
}

interface WealthStatement {
  id: string;
  taxYear: string;
  filingDate: string;
  status: "Completed" | "Pending" | "Rejected";
  totalAssets: number;
  totalLiabilities: number;
}

interface UserStatsProps {
  userId: string;
}

export function UserStats({ userId }: UserStatsProps) {
  const [taxReturn, setTaxReturn] = useState<TaxReturn | null>(null)
  const [wealthStatement, setWealthStatement] = useState<WealthStatement | null>(null)
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      console.log("Starting fetchData for userId:", userId)
      setLoading(true)
      setError(null)

      try {
        const taxService = new TaxFilingService()
        const documentService = new DocumentService()
        const notificationService = new NotificationService()

        const taxPromise = taxService.getByUser(userId).then(data => {
          console.log("Tax filings fetched:", data)
          return data
        }).catch(err => {
          console.error("Tax filings error:", err)
          return []
        })

        const docPromise = documentService.getByUser(userId).then(data => {
          console.log("Documents fetched:", data)
          return data
        }).catch(err => {
          console.error("Documents error:", err)
          return []
        })

        const notifPromise = notificationService.getUserNotifications(userId).then(data => {
          console.log("Notifications fetched:", data)
          return data
        }).catch(err => {
          console.error("Notifications error:", err)
          return []
        })

        const unreadPromise = notificationService.getUnreadCount(userId).then(data => {
          console.log("Unread count fetched:", data)
          return data
        }).catch(err => {
          console.error("Unread count error:", err)
          return 0
        })

        const [taxFilings, documents, userNotifications, unreadCountData] = await Promise.all([
          taxPromise,
          docPromise,
          notifPromise,
          unreadPromise,
        ])

        console.log("All data fetched:", { taxFilings, documents, userNotifications, unreadCountData })

        // Transform and select latest tax filing
        const latestTaxFiling = taxFilings.sort((a, b) =>
          new Date(b.createdAt || "1970-01-01").getTime() - new Date(a.createdAt || "1970-01-01").getTime()
        )[0]
        if (latestTaxFiling) {
          setTaxReturn({
            id: latestTaxFiling.id,
            taxYear: latestTaxFiling.taxYear.toString(),
            filingDate: latestTaxFiling.createdAt || new Date().toISOString(),
            status: latestTaxFiling.status === "completed" ? "Completed" :
              latestTaxFiling.status === "under_review" ? "Pending" : "Rejected",
            taxAmount: latestTaxFiling.taxPaid,
            refundAmount: latestTaxFiling.grossIncome > latestTaxFiling.taxPaid
              ? latestTaxFiling.grossIncome - latestTaxFiling.taxPaid
              : undefined,
          })
        }

        // Transform and select latest document as wealth statement
        const latestDocument = documents.sort((a, b) =>
          new Date(b.createdAt || "1970-01-01").getTime() - new Date(a.createdAt || "1970-01-01").getTime()
        )[0]
        if (latestDocument) {
          setWealthStatement({
            id: latestDocument.id,
            taxYear: latestDocument.name || "Unknown",
            filingDate: latestDocument.createdAt || new Date().toISOString(),
            status: latestDocument.status === "approved" ? "Completed" : "Pending",
            totalAssets: 1000000,
            totalLiabilities: 200000,
          })
        }

        setNotifications(userNotifications.slice(0, 3))
        setUnreadCount(unreadCountData)

      } catch (err) {
        console.error("FetchData error:", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        console.log("FetchData completed, setting loading to false")
        setLoading(false)
      }
    }

    if (userId) {
      console.log("Triggering fetchData with userId:", userId)
      fetchData()
    } else {
      console.error("No userId provided")
      setError("User ID is required")
      setLoading(false)
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium">Tax Returns</CardTitle>
              <CardDescription>Filed tax returns history</CardDescription>
            </div>
            <div className="w-10 h-10 bg-[#af0e0e]/10 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#af0e0e]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {taxReturn ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Latest Return</span>
                <span className="text-sm font-medium">{taxReturn.taxYear}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Filing Date</span>
                <span className="text-sm font-medium">{formatDate(taxReturn.filingDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium">
                  <span
                    className={`inline - flex items - center px - 2 py - 1 rounded - full text - xs ${taxReturn.status === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      } `}
                  >
                    {taxReturn.status}
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tax Amount</span>
                <span className="text-sm font-medium">{formatCurrency(taxReturn.taxAmount)}</span>
              </div>
              {taxReturn.refundAmount && taxReturn.refundAmount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Refund</span>
                  <span className="text-sm font-medium text-green-600">{formatCurrency(taxReturn.refundAmount)}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tax returns found.</p>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/tax-returns" className="w-full">
            <Button variant="outline" className="w-full">
              View All Returns <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium">Wealth Statements</CardTitle>
              <CardDescription>Assets and liabilities declaration</CardDescription>
            </div>
            <div className="w-10 h-10 bg-[#af0e0e]/10 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-[#af0e0e]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {wealthStatement ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Latest Statement</span>
                <span className="text-sm font-medium">{wealthStatement.taxYear}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Filing Date</span>
                <span className="text-sm font-medium">{formatDate(wealthStatement.filingDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium">
                  <span
                    className={`inline - flex items - center px - 2 py - 1 rounded - full text - xs ${wealthStatement.status === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      } `}
                  >
                    {wealthStatement.status}
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Assets</span>
                <span className="text-sm font-medium">{formatCurrency(wealthStatement.totalAssets)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Liabilities</span>
                <span className="text-sm font-medium">{formatCurrency(wealthStatement.totalLiabilities)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No wealth statements found.</p>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/wealth-statements" className="w-full">
            <Button variant="outline" className="w-full">
              View All Statements <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium">Notifications</CardTitle>
              <CardDescription>Recent updates and alerts</CardDescription>
            </div>
            <div className="w-10 h-10 bg-[#af0e0e]/10 rounded-full flex items-center justify-center">
              <Bell className="h-5 w-5 text-[#af0e0e]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={notification.id} className={`flex items - start gap - 4 ${index !== 0 ? "pt-3 border-t" : ""} `}>
                  <div
                    className={`w - 2 h - 2 mt - 2 rounded - full ${!notification.read ? "bg-[#af0e0e]" : "bg-gray-300 dark:bg-gray-600"} `}
                  ></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.type}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" /> {formatDate(notification.createdAt || "")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No notifications found.</p>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/notifications" className="w-full">
            <Button variant="outline" className="w-full">
              View All Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-[#af0e0e] px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}