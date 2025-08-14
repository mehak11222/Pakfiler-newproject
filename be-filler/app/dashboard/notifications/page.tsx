"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { NotificationService, INotification } from "@/services/notifications.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import Link from "next/link"
import { ArrowRight, Bell, CheckCircle, Clock } from "lucide-react"

export default function NotificationsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [notifications, setNotifications] = useState<INotification[]>([])
    const [filteredNotifications, setFilteredNotifications] = useState<INotification[]>([])
    const [filter, setFilter] = useState<string>("all")
    const [unreadCount, setUnreadCount] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Check authentication and user
        const isAuth = isAuthenticated()
        if (!isAuth) {
            router.push("/auth/login")
            return
        }

        const currentUser = getCurrentUser()
        if (!currentUser) {
            router.push("/auth/login")
            return
        }

        setUser(currentUser)

        // Redirect based on role
        if (currentUser.role === "admin") {
            router.push("/dashboard/admin")
            return
        }
        if (currentUser.role === "accountant") {
            router.push("/dashboard/accountant")
            return
        }

        // Fetch notifications
        const fetchNotifications = async () => {
            try {
                console.log("Fetching notifications for user:", currentUser.id)
                const notificationService = new NotificationService()
                const [userNotifications, unreadCountData] = await Promise.all([
                    notificationService.getUserNotifications(currentUser.id).catch(() => []),
                    notificationService.getUnreadCount(currentUser.id).catch(() => 0),
                ])
                console.log("Notifications fetched:", userNotifications, "Unread count:", unreadCountData)
                setNotifications(userNotifications)
                setFilteredNotifications(userNotifications)
                setUnreadCount(unreadCountData)
            } catch (err) {
                console.error("Error fetching notifications:", err)
                setError("Failed to load notifications. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
    }, [router])

    // Update filtered notifications when filter changes
    useEffect(() => {
        if (filter === "all") {
            setFilteredNotifications(notifications)
        } else if (filter === "unread") {
            setFilteredNotifications(notifications.filter(n => !n.read))
        } else if (filter === "read") {
            setFilteredNotifications(notifications.filter(n => n.read))
        } else {
            setFilteredNotifications(notifications.filter(n => n.type === filter))
        }
    }, [filter, notifications])

    const handleFilterChange = (value: string) => {
        console.log("Filter changed to:", value)
        setFilter(value)
    }

    // Placeholder for mark as read (implement if service supports)
    const handleMarkAsRead = async (notificationId: string) => {
        try {
            const notificationService = new NotificationService()
            await notificationService.markAsRead(notificationId)
            // Assume a method exists; replace with actual API call
            // await notificationService.markAsRead(notificationId)
            setNotifications(notifications.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            ))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) {
            console.error("Error marking notification as read:", err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-t-[#af0e0e] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                {error}
                <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
            </div>
        )
    }

    if (!user) {
        return <div className="text-center py-8 text-red-500">Failed to load user data</div>
    }

    return (
        <div className="container px-4 mx-auto py-8 mt-16">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">View and manage your recent updates and alerts</p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Your Notifications</CardTitle>
                            <CardDescription>All your recent updates and alerts</CardDescription>
                        </div>
                        <Select onValueChange={handleFilterChange} value={filter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter notifications" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Notifications</SelectItem>
                                <SelectItem value="unread">Unread</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="action">Action</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        {filteredNotifications.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Message</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredNotifications.map(notification => (
                                        <TableRow key={notification.id}>
                                            <TableCell className="font-medium">{notification.message}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline - flex items - center px - 2 py - 1 rounded - full text - xs ${notification.type === "info"
                                                        ? " text-blue-800 dark:text-blue-400"
                                                        : notification.type === "warning"
                                                            ? " text-yellow-800 dark:text-yellow-400"
                                                            : "text-purple-800 dark:text-purple-400"
                                                        } `}
                                                >
                                                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell>{formatDate(notification.createdAt || "")}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline - flex items - center px - 2 py - 1 rounded - full text - xs ${notification.read
                                                        ? " text-gray-800 dark:text-gray-400"
                                                        : " text-red-800 dark:text-red-400"
                                                        } `}
                                                >
                                                    {notification.read ? "Read" : "Unread"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {!notification.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" /> Mark as Read
                                                    </Button>
                                                )}
                                                {notification.link && (
                                                    <Link href={notification.link}>
                                                        <Button variant="ghost" size="sm">
                                                            View <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-sm text-muted-foreground">No notifications found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Summary</CardTitle>
                            <CardDescription>Overview of your notifications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                You have {unreadCount} unread notifications and a total of {notifications.length} notifications.
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <RecentActivity />
                </div>
            </div>
        </div>
    )
}