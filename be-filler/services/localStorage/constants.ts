// Mock data for admin dashboard

// Mock admin users
export const mockAdminUsers = [
    {
        id: "1",
        name: "Ahmed Khan",
        email: "ahmed.khan@example.com",
        role: "User",
        status: "Active",
        filings: 12,
    },
    {
        id: "2",
        name: "Fatima Ali",
        email: "fatima.ali@example.com",
        role: "User",
        status: "Active",
        filings: 8,
    },
    {
        id: "3",
        name: "Muhammad Usman",
        email: "m.usman@example.com",
        role: "Accountant",
        status: "Active",
        filings: 24,
    },
    {
        id: "4",
        name: "Ayesha Malik",
        email: "ayesha.malik@example.com",
        role: "User",
        status: "Inactive",
        filings: 5,
    },
    {
        id: "5",
        name: "Zain Ahmed",
        email: "zain.ahmed@example.com",
        role: "Admin",
        status: "Active",
        filings: 0,
    },
    {
        id: "6",
        name: "Sara Khan",
        email: "sara.khan@example.com",
        role: "User",
        status: "Active",
        filings: 3,
    },
    {
        id: "7",
        name: "Ali Hassan",
        email: "ali.hassan@example.com",
        role: "User",
        status: "Active",
        filings: 7,
    },
    {
        id: "8",
        name: "Nadia Jamil",
        email: "nadia.jamil@example.com",
        role: "Accountant",
        status: "Active",
        filings: 18,
    },
]

// Mock recent filings
export const mockRecentFilers = [
    {
        id: "f1",
        userId: "1",
        type: "Income Tax",
        status: "Approved",
        date: "2023-05-15T10:30:00Z",
    },
    {
        id: "f2",
        userId: "2",
        type: "Sales Tax",
        status: "Under Review",
        date: "2023-05-16T14:45:00Z",
    },
    {
        id: "f3",
        userId: "3",
        type: "Income Tax",
        status: "Under Review",
        date: "2023-05-17T09:15:00Z",
    },
    {
        id: "f4",
        userId: "6",
        type: "Sales Tax",
        status: "Approved",
        date: "2023-05-18T16:20:00Z",
    },
    {
        id: "f5",
        userId: "7",
        type: "Income Tax",
        status: "Under Review",
        date: "2023-05-19T11:10:00Z",
    },
]

// Mock monthly filings data
export const mockMonthlyFilings = [
    { month: "Jan", filings: 65 },
    { month: "Feb", filings: 59 },
    { month: "Mar", filings: 80 },
    { month: "Apr", filings: 81 },
    { month: "May", filings: 56 },
    { month: "Jun", filings: 55 },
    { month: "Jul", filings: 40 },
    { month: "Aug", filings: 45 },
    { month: "Sep", filings: 60 },
    { month: "Oct", filings: 70 },
    { month: "Nov", filings: 85 },
    { month: "Dec", filings: 90 },
]

// Mock revenue data
export const mockRevenueData = [
    { month: "Jan", revenue: 25000 },
    { month: "Feb", revenue: 30000 },
    { month: "Mar", revenue: 35000 },
    { month: "Apr", revenue: 40000 },
    { month: "May", revenue: 42000 },
    { month: "Jun", revenue: 45000 },
    { month: "Jul", revenue: 38000 },
    { month: "Aug", revenue: 36000 },
    { month: "Sep", revenue: 48000 },
    { month: "Oct", revenue: 52000 },
    { month: "Nov", revenue: 58000 },
    { month: "Dec", revenue: 65000 },
]
