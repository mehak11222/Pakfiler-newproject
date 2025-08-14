"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileCheck, Clock, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { IMonthlyStats, IRevenueSummary } from "@/services/reports.service"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend)

interface StatsOverviewProps {
  activeUsers: number
  totalFilings: number
  pendingFilings: number
  monthlyStats: IMonthlyStats
  revenueSummary: IRevenueSummary
}

export function StatsOverview({ activeUsers, totalFilings, pendingFilings, monthlyStats, revenueSummary }: StatsOverviewProps) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Convert monthlyStats to array for filings chart
  const filingsChartData = monthNames.map((month, index) => {
    const monthData = monthlyStats[index] || monthlyStats[month] || {
      filings: 0,
      approved: 0,
      rejected: 0,
      pending: 0,
    }
    return {
      month: month,
      filings: monthData.filings,
      approved: monthData.approved,
      rejected: monthData.rejected,
      pending: monthData.pending,
    }
  })

  // Calculate monthly revenue (fixed fee per filing)
  const FEE_PER_FILING = 100 // $100 per filing
  const revenueChartData = monthNames.map((month, index) => {
    const monthData = monthlyStats[index] || monthlyStats[month] || { filings: 0 }
    return {
      month: month,
      revenue: monthData.filings * FEE_PER_FILING,
    }
  })

  // Get current and previous month data for filings
  const currentMonth = new Date().getMonth()
  const currentMonthData = monthlyStats[currentMonth] || monthlyStats[monthNames[currentMonth]] || {
    filings: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  }
  const previousMonth = currentMonth - 1 < 0 ? 11 : currentMonth - 1
  const previousMonthData = monthlyStats[previousMonth] || monthlyStats[monthNames[previousMonth]] || {
    filings: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  }

  // Calculate month-over-month filings change
  const monthlyChange = currentMonthData.filings - previousMonthData.filings
  const isPositiveChange = monthlyChange >= 0

  // Calculate month-over-month revenue change
  const thisMonthRevenue = revenueChartData[currentMonth]?.revenue || 0
  const lastMonthRevenue = revenueChartData[previousMonth]?.revenue || 0
  const revenueChange = lastMonthRevenue !== 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

  // Filings chart configuration
  const filingsChartConfig = {
    labels: monthNames,
    datasets: [
      {
        label: "Total Filings",
        data: filingsChartData.map(d => d.filings),
        borderColor: "#af0e0e",
        backgroundColor: "#af0e0e",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Approved",
        data: filingsChartData.map(d => d.approved),
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        fill: false,
        borderDash: [5, 5],
        tension: 0.4,
      },
      {
        label: "Rejected",
        data: filingsChartData.map(d => d.rejected),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        fill: false,
        borderDash: [5, 5],
        tension: 0.4,
      },
      {
        label: "Pending",
        data: filingsChartData.map(d => d.pending),
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        fill: false,
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  }

  // Revenue chart configuration
  const revenueChartConfig = {
    labels: monthNames,
    datasets: [
      {
        label: "Revenue",
        data: revenueChartData.map(d => d.revenue),
        borderColor: "#8b5cf6",
        backgroundColor: "#8b5cf6",
        fill: false,
        tension: 0.4,
      },
    ],
  }

  // Chart options for filings (counts)
  const filingsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#4b5563" },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        bodyColor: "#111827",
        borderColor: "#d1d5db",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "#e5e7eb" },
        ticks: { color: "#4b5563" },
      },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: {
          color: "#4b5563",
          callback: function (value: number) {
            return value // Show plain numbers for filings
          },
        },
      },
    },
  }

  // Chart options for revenue (dollars)
  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#4b5563" },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        bodyColor: "#111827",
        borderColor: "#d1d5db",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return `Revenue: $${context.parsed.y.toFixed(2)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "#e5e7eb" },
        ticks: { color: "#4b5563" },
      },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: {
          color: "#4b5563",
          callback: function (value: number) {
            return `$${value}` // Show dollar amounts for revenue
          },
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{activeUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">{activeUsers} active users</p>
              </div>
              <div className="w-10 h-10 bg-[#af0e0e]/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-[#af0e0e]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Filings Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Filings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalFilings}</div>
                <p className="text-xs text-muted-foreground mt-1">{pendingFilings} pending approval</p>
              </div>
              <div className="w-10 h-10 bg-[#af0e0e]/10 rounded-full flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-[#af0e0e]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month Filings Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month Filings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{currentMonthData.filings}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isPositiveChange ? "↑" : "↓"} {Math.abs(monthlyChange)} from last month
                </p>
              </div>
              <div className="w-10 h-10 bg-[#af0e0e]/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#af0e0e]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(thisMonthRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {revenueChange >= 0 ? "↑" : "↓"} {Math.abs(revenueChange).toFixed(1)}% from last month
                </p>
              </div>
              <div className="w-10 h-10 bg-[#af0e0e]/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[#af0e0e]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Filings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Filings</CardTitle>
            <CardDescription>Number of tax returns filed each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line data={filingsChartConfig} options={filingsChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue generated from tax filing services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line data={revenueChartConfig} options={revenueChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}