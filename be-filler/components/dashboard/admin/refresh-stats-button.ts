"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { LocalStorage } from "@/services/localStorage/localStorage"
import { mockAdminUsers, mockRecentFilers, mockMonthlyFilings, mockRevenueData } from "@/lib/constants"

// LocalStorage keys
const LS_KEYS = {
    ADMIN_USERS: "admin_users_data",
    RECENT_FILINGS: "admin_recent_filings",
    MONTHLY_FILINGS: "admin_monthly_filings",
    REVENUE_DATA: "admin_revenue_data",
    LAST_UPDATED: "admin_stats_last_updated",
}

interface RefreshStatsButtonProps {
    onRefresh?: () => void
    className?: string
}

export function RefreshStatsButton({ onRefresh, className }: RefreshStatsButtonProps) {
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        setIsRefreshing(true)

        try {
            // In a real app, this would fetch fresh data from an API
            // For this example, we'll just update with the mock data

            // Store mock data in localStorage
            LocalStorage.setItem(LS_KEYS.ADMIN_USERS, mockAdminUsers, true)
            LocalStorage.setItem(LS_KEYS.RECENT_FILINGS, mockRecentFilers, true)
            LocalStorage.setItem(LS_KEYS.MONTHLY_FILINGS, mockMonthlyFilings, true)
            LocalStorage.setItem(LS_KEYS.REVENUE_DATA, mockRevenueData, true)

            // Update last updated timestamp
            const now = new Date().toISOString()
            LocalStorage.setItem(LS_KEYS.LAST_UPDATED, now)

            // Call the onRefresh callback if provided
            if (onRefresh) {
                onRefresh()
            }

            // Show success message or notification
            console.log("Stats refreshed successfully")
        } catch (error) {
            console.error("Error refreshing stats:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    return (
        <Button variant="outline" size="sm" className={className} onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Stats"}
        </Button>
    )
}
