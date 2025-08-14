"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/types/users"

// Form schema
const userFormSchema = z.object({
    id: z.string().optional(),
    fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    role: z.enum(["user", "admin", "accountant"], {
        required_error: "Please select a role",
    }),
    status: z.enum(["Active", "Inactive"], {
        required_error: "Please select a status",
    }),
    createdAt: z.string().optional(),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (user: any) => void
    user: User | null
    mode: "add" | "edit"
}

export function UserModal({ isOpen, onClose, onSave, user, mode }: UserModalProps) {
    // Initialize the form
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            role: "user",
            status: "Active",
        },
    })

    // Reset form when user changes
    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && user) {
                form.reset({
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role as "user" | "admin" | "accountant",
                    status: user.status === "Active" || user.status === "Inactive" ? user.status : "Active",
                    createdAt: user.createdAt,
                })
            } else {
                form.reset({
                    fullName: "",
                    email: "",
                    role: "user",
                    status: "Active",
                })
            }
        }
    }, [isOpen, user, mode, form])

    // Handle form submission
    const onSubmit = (values: UserFormValues) => {
        if (mode === "add") {
            // Generate a new ID and createdAt for new users
            const newUser: any = {
                id: `USR-${Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, "0")}`,
                fullName: values.fullName,
                email: values.email,
                role: values.role,
                status: values.status,
                createdAt: new Date().toISOString(),
            }
            onSave(newUser)
        } else {
            // For edit mode, preserve the existing ID and createdAt
            onSave({
                id: user?.id || "",
                fullName: values.fullName,
                email: values.email,
                role: values.role,
                status: values.status,
                createdAt: user?.createdAt || new Date().toISOString(),
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add" ? "Fill in the details to create a new user." : "Update the user's information."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john.doe@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="accountant">Accountant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>The user's role determines their access level.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Inactive users cannot log in to the system.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">{mode === "add" ? "Add User" : "Save Changes"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
