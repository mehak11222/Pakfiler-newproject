"use client"

import { useState, useEffect, useCallback } from "react"
import { LocalStorage } from "@/services/localStorage/localStorage"
import { mockRecentFilers } from "@/lib/constants"

// Define the filer data type
interface Filer {
    id: string
    user: string
    taxYear: string
    filingDate: string
    taxAmount: number
    status: "Completed" | "Under Review"
}

// LocalStorage keys
const LS_KEY = "recent_filers_data"
const LS_LAST_UPDATED_KEY = "recent_filers_last_updated"

export function useFilersData() {
    const [filers, setFilers] = useState<Filer[] | any>([])
    const [isLoading, setIsLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Load data from localStorage or use mock data
    const loadFilersData = useCallback(() => {
        setIsLoading(true)

        // Try to load data from localStorage
        const storedFilers: any = LocalStorage.getItem<Filer[]>(LS_KEY, true)
        const storedLastUpdated = LocalStorage.getItem<string>(LS_LAST_UPDATED_KEY, false)

        // If we have stored data, use it
        if (storedFilers && storedFilers.length > 0) {
            setFilers(storedFilers)
            if (storedLastUpdated) {
                setLastUpdated(storedLastUpdated)
            }
        } else {
            // Otherwise use mock data and store it in localStorage
            setFilers(mockRecentFilers)

            // Store mock data in localStorage for future use
            LocalStorage.setItem(LS_KEY, mockRecentFilers)

            // Set last updated timestamp
            const now = new Date().toISOString()
            LocalStorage.setItem(LS_LAST_UPDATED_KEY, now)
            setLastUpdated(now)
        }

        setIsLoading(false)
    }, [])

    // Load data on component mount
    useEffect(() => {
        loadFilersData()
    }, [loadFilersData])

    // Function to refresh data
    const refreshData = useCallback(() => {
        setIsRefreshing(true)

        // In a real app, this would fetch fresh data from an API
        // For this example, we'll just update with the mock data
        setTimeout(() => {
            // Store mock data in localStorage
            LocalStorage.setItem(LS_KEY, mockRecentFilers)

            // Update last updated timestamp
            const now = new Date().toISOString()
            LocalStorage.setItem(LS_LAST_UPDATED_KEY, now)
            setLastUpdated(now)

            // Update state
            setFilers(mockRecentFilers)
            setIsRefreshing(false)
        }, 800) // Simulate API delay
    }, [])

    // Function to add a new filer
    const addFiler = useCallback(
        (newFiler: Filer) => {
            const updatedFilers = [newFiler, ...filers].slice(0, 10) // Keep only the 10 most recent
            setFilers(updatedFilers)
            LocalStorage.setItem(LS_KEY, updatedFilers)

            // Update last updated timestamp
            const now = new Date().toISOString()
            LocalStorage.setItem(LS_LAST_UPDATED_KEY, now)
            setLastUpdated(now)
        },
        [filers],
    )

    // Function to update a filer's status
    const updateFilerStatus = useCallback(
        (id: string, newStatus: "Completed" | "Under Review") => {
            const updatedFilers = filers.map((filer: any) => (filer.id === id ? { ...filer, status: newStatus } : filer))
            setFilers(updatedFilers)
            LocalStorage.setItem(LS_KEY, updatedFilers)

            // Update last updated timestamp
            const now = new Date().toISOString()
            LocalStorage.setItem(LS_LAST_UPDATED_KEY, now)
            setLastUpdated(now)
        },
        [filers],
    )

    // Calculate some stats
    const stats = {
        totalFilers: filers.length,
        completedFilings: filers.filter((filer: any) => filer.status === "Completed").length,
        pendingFilings: filers.filter((filer: any) => filer.status === "Under Review").length,
        totalTaxAmount: filers.reduce((sum: any, filer: any) => sum + filer.taxAmount, 0),
    }

    return {
        filers,
        isLoading,
        isRefreshing,
        lastUpdated,
        stats,
        loadFilersData,
        refreshData,
        addFiler,
        updateFilerStatus,
    }
}
