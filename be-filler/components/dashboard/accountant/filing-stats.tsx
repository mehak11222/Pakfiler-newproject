"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ITaxFiling } from "@/services/taxFiling.service"

interface FilingStatsProps {
  taxFilings: ITaxFiling[]
}

export function FilingStats({ taxFilings }: FilingStatsProps) {
  // Process monthly filings for Bar Chart
  const monthlyFilings = (() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]
    const filingsByMonth = Array(12).fill(0)

    taxFilings.forEach(filing => {
      if (filing.createdAt) {
        const date = new Date(filing.createdAt)
        const month = date.getMonth() // 0-11
        filingsByMonth[month] += 1
      }
    })

    return months.map((month, index) => ({
      month,
      filings: filingsByMonth[index],
    }))
  })()

  // Process filing status for Pie Chart
  const filingStatusData = (() => {
    const statusCounts = {
      completed: 0,
      under_review: 0,
      rejected: 0,
    }

    taxFilings.forEach(filing => {
      if (filing.status in statusCounts) {
        statusCounts[filing.status] += 1
      }
    })

    return [
      { name: "Completed", value: statusCounts.completed, color: "var(--chart-1)" },
      { name: "Under Review", value: statusCounts.under_review, color: "var(--chart-2)" },
      { name: "Rejected", value: statusCounts.rejected, color: "var(--chart-3)" },
    ].filter(status => status.value > 0) // Remove statuses with zero filings
  })()

  // Process filing types for optional Pie Chart
  const filingTypesData = (() => {
    const typeCounts = {
      individual: 0,
      business: 0,
    }

    taxFilings.forEach(filing => {
      if (filing.filingType in typeCounts) {
        typeCounts[filing.filingType] += 1
      }
    })

    return [
      { name: "Individual", value: typeCounts.individual, color: "var(--chart-4)" },
      { name: "Business", value: typeCounts.business, color: "var(--chart-5)" },
    ].filter(type => type.value > 0)
  })()

  // Debugging: Log processed data
  console.log("Monthly Filings:", monthlyFilings)
  console.log("Filing Status:", filingStatusData)
  console.log("Filing Types:", filingTypesData)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Filings Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Filings</CardTitle>
          <CardDescription>Tax returns processed per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {monthlyFilings.every(m => m.filings === 0) ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No filings data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyFilings}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="filings" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filing Status Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Filing Status</CardTitle>
          <CardDescription>Status distribution of tax filings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {filingStatusData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No status data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}% `}
                  >
                    {filingStatusData.map((entry, index) => (
                      <Cell key={`cell - ${index} `} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optional Filing Types Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Filing Types</CardTitle>
          <CardDescription>Distribution of filing types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {filingTypesData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No filing type data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filingTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}% `}
                  >
                    {filingTypesData.map((entry, index) => (
                      <Cell key={`cell - ${index} `} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
