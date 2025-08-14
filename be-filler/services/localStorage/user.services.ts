import type { User } from "@/types/users"
import { mockAdminUsers } from "@/lib/constants"

export class UserService {
    async getAllUsers(): Promise<User[]> {
        // In a real app, this would be an API call
        // For this example, we'll simulate an API call with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
                // Convert mockAdminUsers to match the User interface
                const users: any = mockAdminUsers.map((user) => ({
                    id: user.id,
                    fullName: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status as "Active" | "Inactive",
                    createdAt: user.registrationDate || new Date().toISOString(),
                    filings: user.filings,
                }))
                resolve(users)
            }, 1000)
        })
    }

    async getUserById(id: string): Promise<User | null | any> {
        // In a real app, this would be an API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = mockAdminUsers.find((u) => u.id === id)
                if (user) {
                    resolve({
                        id: user.id,
                        fullName: user.name,
                        email: user.email,
                        role: user.role,
                        status: user.status as "Active" | "Inactive",
                        createdAt: user.registrationDate || new Date().toISOString(),
                        filings: user.filings,
                    })
                } else {
                    resolve(null)
                }
            }, 500)
        })
    }
}
