
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Search, UserPlus, Filter, ArrowUpDown, X, Settings, ChevronDown } from "lucide-react"
import { IUser, UserServices } from "@/services/user.service"
import { toast } from "@/hooks/use-toast"

export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  cnic: string;
}

interface UserTableProps {
  users: IUser[];
  onCreateUser?: (userData: CreateUserDto) => Promise<void> | void;
  onUpdateUserRole?: (userId: string, newRole: string) => Promise<void> | void;
  onStatusUpdate?: (userId: string, newStatus: string) => Promise<IUser | void>;
}

export function UsersTable({ users: initialUsers, onCreateUser, onUpdateUserRole, onStatusUpdate }: UserTableProps) {
  const [users, setUsers] = useState<IUser[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [updatingRoleUserId, setUpdatingRoleUserId] = useState<string | null>(null)
  const [userRoles, setUserRoles] = useState<Record<string, string>>({})
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>({})
  const [updatingStatusUserId, setUpdatingStatusUserId] = useState<string | null>(null)
  const [createUserData, setCreateUserData] = useState<CreateUserDto>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    cnic: ""
  })

  // Sync users state with initialUsers prop
  useEffect(() => {
    console.log("Updating users state with initialUsers:", initialUsers)
    setUsers(initialUsers)
  }, [initialUsers])

  // Filter users based on search term and filters
const filteredUsers = users
  .filter((user): user is IUser => {
    // Skip if user is null, undefined, or missing required fields
    if (!user || !user._id || !user.fullName || !user.email || !user.cnic) {
      console.warn("Skipping invalid user:", user)
      return false
    }
    return true
  })
  .filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cnic.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    console.log("Filtering user:", { user, matchesSearch, matchesRole, matchesStatus })
    return matchesSearch && matchesRole && matchesStatus
  })
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: any = a[sortField as keyof IUser] ?? ""
    let bValue: any = b[sortField as keyof IUser] ?? ""

    if (sortField === "createdAt") {
      aValue = aValue ? new Date(aValue).getTime() : 0
      bValue = bValue ? new Date(bValue).getTime() : 0
    }

    if (sortField === "documents") {
      aValue = (aValue as any[] | undefined)?.length ?? 0
      bValue = (bValue as any[] | undefined)?.length ?? 0
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  console.log("Sorted users:", sortedUsers)

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle create user form submission
  const handleCreateUser = async () => {
    if (!onCreateUser) return

    if (!createUserData.fullName || !createUserData.email || !createUserData.password || !createUserData.phoneNumber || !createUserData.cnic) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(createUserData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
    if (!cnicRegex.test(createUserData.cnic)) {
      toast({
        title: "Error",
        description: "Please enter a valid CNIC format (12345-1234567-1)",
        variant: "destructive",
      })
      return
    }

    const phoneRegex = /^(\+92|0)?[0-9]{10}$/
    if (!phoneRegex.test(createUserData.phoneNumber.replace(/\s/g, ''))) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreating(true)
      await onCreateUser(createUserData)
      toast({
        title: "Success",
        description: "User created successfully",
      })
      setCreateUserData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        cnic: ""
      })
      setIsCreateModalOpen(false)
    } catch (error: any) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof CreateUserDto, value: string) => {
    setCreateUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle role update
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    if (!onUpdateUserRole) return
    try {
      setUpdatingRoleUserId(userId)
      setUserRoles(prev => ({ ...prev, [userId]: newRole }))
      await onUpdateUserRole(userId, newRole)
      toast({
        title: "Success",
        description: `User role updated to ${newRole} `,
      })
    } catch (error: any) {
      console.error("Error updating user role:", error)
      setUserRoles(prev => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
      toast({
        title: "Error",
        description: error.message || "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingRoleUserId(null)
    }
  }

  // Handle status update
  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    if (!onStatusUpdate) return
    try {
      setUpdatingStatusUserId(userId)
      setUserStatuses(prev => ({ ...prev, [userId]: newStatus }))
      const updatedUser = await onStatusUpdate(userId, newStatus)
      if (updatedUser && typeof updatedUser === 'object') {
        setUsers(prev =>
          prev.map(user =>
            user._id === userId ? { ...user, status: newStatus as IUser["status"] } : user
          )
        )
      }
      toast({
        title: "Success",
        description: `User status updated to ${newStatus} `,
      })
    } catch (error: any) {
      console.error("Error updating user status:", error)
      setUserStatuses(prev => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
      toast({
        title: "Error",
        description: error.message || "Failed to update user status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatusUserId(null)
    }
  }

  // Get current role for a user
  const getCurrentRole = (user: IUser) => {
    return userRoles[user._id] || user.role
  }

  // Get current status for a user
  const getCurrentStatus = (user: IUser) => {
    return userStatuses[user._id] || user.status
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage your registered users ({sortedUsers.length} total)</CardDescription>
          </div>
          <Button variant="outline" className="ml-auto" onClick={() => setIsCreateModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or CNIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="accountant">Accountant</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("cnic")} className="cursor-pointer">
                  CNIC
                  {sortField === "cnic" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead onClick={() => handleSort("fullName")} className="cursor-pointer">
                  Name
                  {sortField === "fullName" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead onClick={() => handleSort("role")} className="cursor-pointer">
                  Role
                  {sortField === "role" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead onClick={() => handleSort("createdAt")} className="cursor-pointer">
                  Registration Date
                  {sortField === "createdAt" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                  Status
                  {sortField === "status" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead onClick={() => handleSort("documents")} className="text-right cursor-pointer">
                  Docs
                  {sortField === "documents" && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.cnic}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {getCurrentRole(user)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getCurrentStatus(user) === "approved" ? "default" : "secondary"}
                        className={
                          getCurrentStatus(user) === "approved"
                            ? "bg-green-500 hover:bg-green-600"
                            : getCurrentStatus(user) === "pending"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-red-500 hover:bg-red-600"
                        }
                      >
                        {getCurrentStatus(user)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{user.documents?.length || 0}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Select
                          value={getCurrentRole(user)}
                          onValueChange={(newRole) => handleRoleUpdate(user._id, newRole)}
                          disabled={updatingRoleUserId === user._id}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <Settings className="h-3 w-3 mr-1" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="accountant">Accountant</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={getCurrentStatus(user)}
                          onValueChange={(newStatus) => handleStatusUpdate(user._id, newStatus)}
                          disabled={updatingStatusUserId === user._id}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <Settings className="h-3 w-3 mr-1" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {(updatingRoleUserId === user._id || updatingStatusUserId === user._id) && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Updating...
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No users found matching the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Enter the details for the new user account.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter full name"
                  value={createUserData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={createUserData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={createUserData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="03XX-XXXXXXX or +92XXXXXXXXXX"
                  value={createUserData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cnic">CNIC *</Label>
                <Input
                  id="cnic"
                  placeholder="12345-1234567-1"
                  value={createUserData.cnic}
                  onChange={(e) => handleInputChange("cnic", e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateUser}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}