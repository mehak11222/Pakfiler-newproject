"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/types/users"
import { LocalStorage } from "@/services/localStorage/localStorage"
import { UserService } from "@/services/user.service"
import { mockAdminUsers } from "@/lib/constants"

// LocalStorage keys
const LS_USERS_KEY = "admin_users_data"
const LS_USERS_LAST_UPDATED_KEY = "admin_users_last_updated"

export function useUsers() {
    // State for users data
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<string>("")
    const [isRefreshing, setIsRefreshing] = useState(false)

    // State for filters and sorting
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortField, setSortField] = useState("createdAt")
    const [sortDirection, setSortDirection] = useState("desc")

    // Load users from localStorage or API
    const loadUsers = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            // First try to get users from localStorage
            const storedUsers: any = LocalStorage.getItem<User[]>(LS_USERS_KEY, true)
            const storedLastUpdated = LocalStorage.getItem<string>(LS_USERS_LAST_UPDATED_KEY, false)

            if (storedUsers && storedUsers.length > 0) {
                setUsers(storedUsers)
                if (storedLastUpdated) {
                    setLastUpdated(storedLastUpdated)
                }
                setLoading(false)
            }

            // Then try to fetch fresh data from API
            const userService = new UserService()
            const response = await userService.getAllUsers()

            // If we got data from the API, update localStorage and state
            if (response && response.length > 0) {
                setUsers(response)

                // Update localStorage
                const now = new Date().toISOString()
                LocalStorage.setItem(LS_USERS_KEY, response)
                LocalStorage.setItem(LS_USERS_LAST_UPDATED_KEY, now)
                setLastUpdated(now)
            } else if (!storedUsers) {
                // If no data from API and no stored data, use mock data
                const mappedUsers: any = mockAdminUsers.map((user) => ({
                    id: user.id,
                    fullName: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status as "Active" | "Inactive",
                    createdAt: user.registrationDate || new Date().toISOString(),
                    filings: user.filings,
                }))

                setUsers(mappedUsers)

                // Store mock data in localStorage
                const now = new Date().toISOString()
                LocalStorage.setItem(LS_USERS_KEY, mappedUsers)
                LocalStorage.setItem(LS_USERS_LAST_UPDATED_KEY, now)
                setLastUpdated(now)
            }
        } catch (error) {
            console.error("Error loading users:", error)
            setError("Failed to load users. Using cached data if available.")

            // If API call fails but we have stored data, we're still good
            const storedUsers = LocalStorage.getItem<User[]>(LS_USERS_KEY, true)
            if (!storedUsers || storedUsers.length === 0) {
                // If no stored data either, use mock data
                const mappedUsers: any = mockAdminUsers.map((user) => ({
                    id: user.id,
                    fullName: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status as "Active" | "Inactive",
                    createdAt: user.registrationDate || new Date().toISOString(),
                    filings: user.filings,
                }))

                setUsers(mappedUsers)

                // Store mock data in localStorage
                const now = new Date().toISOString()
                LocalStorage.setItem(LS_USERS_KEY, mappedUsers)
                LocalStorage.setItem(LS_USERS_LAST_UPDATED_KEY, now)
                setLastUpdated(now)
            }
        } finally {
            setLoading(false)
        }
    }, [])

    // Load users on component mount
    useEffect(() => {
        loadUsers()
    }, [loadUsers])

    // Apply filters and sorting when dependencies change
    useEffect(() => {
        // Filter users
        let result = users.filter((user) => {
            // Search term filter
            const matchesSearch =
                user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toLowerCase().includes(searchTerm.toLowerCase())

            // Role filter
            const matchesRole = roleFilter === "all" || user.role === roleFilter

            // Status filter
            const matchesStatus = statusFilter === "all" || user.status === statusFilter

            return matchesSearch && matchesRole && matchesStatus
        })

        // Sort users
        result = [...result].sort((a, b) => {
            let aValue: any = a[sortField as keyof User]
            let bValue: any = b[sortField as keyof User]

            // Handle date comparison
            if (sortField === "createdAt") {
                aValue = new Date(aValue as string).getTime()
                bValue = new Date(bValue as string).getTime()
            }

            if (sortDirection === "asc") {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        setFilteredUsers(result)
    }, [users, searchTerm, roleFilter, statusFilter, sortField, sortDirection])

    // Function to refresh users data
    const refreshUsers = useCallback(async () => {
        setIsRefreshing(true)
        await loadUsers()
        setIsRefreshing(false)
    }, [loadUsers])

    // Function to handle sort
    const handleSort = useCallback((field: string) => {
        setSortField((prevField) => {
            if (prevField === field) {
                setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"))
            } else {
                setSortDirection("asc")
            }
            return field
        })
    }, [])

    // Add a new user
    const addUser = useCallback((newUser: User) => {
        setUsers((prevUsers) => {
            const updatedUsers = [newUser, ...prevUsers]

            // Update localStorage
            LocalStorage.setItem(LS_USERS_KEY, updatedUsers)
            const now = new Date().toISOString()
            LocalStorage.setItem(LS_USERS_LAST_UPDATED_KEY, now)
            setLastUpdated(now)

            return updatedUsers
        })
    }, [])

    // Update a user
    const updateUser = useCallback((updatedUser: User) => {
        setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))

            // Update localStorage
            LocalStorage.setItem(LS_USERS_KEY, updatedUsers)
            const now = new Date().toISOString()
            LocalStorage.setItem(LS_USERS_LAST_UPDATED_KEY, now)
            setLastUpdated(now)

            return updatedUsers
        })
    }, [])

    // Delete a user
    const deleteUser = useCallback((userId: string) => {
        setUsers((prevUsers) => {
            const updatedUsers = prevUsers.filter((user) => user.id !== userId)

            // Update localStorage
            LocalStorage.setItem(LS_USERS_KEY, updatedUsers)
            const now = new Date().toISOString()
            LocalStorage.setItem(LS_USERS_LAST_UPDATED_KEY, now)
            setLastUpdated(now)

            return updatedUsers
        })
    }, [])

    return {
        // Data
        users,
        filteredUsers,
        loading,
        error,
        lastUpdated,
        isRefreshing,

        // Filters and sorting
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        statusFilter,
        setStatusFilter,
        sortField,
        sortDirection,

        // Functions
        loadUsers,
        refreshUsers,
        handleSort,
        addUser,
        updateUser,
        deleteUser,
    }
}
