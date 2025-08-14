// components/modals/AddClientModal.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LocalStorage } from "@/services/localStorage/localStorage"

interface AddClientModalProps {
    open: boolean
    onClose: () => void
}

export function AddClientModal({ open, onClose }: AddClientModalProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const handleAddClient = () => {
        const client = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            filings: 0,
            latestFiling: "-",
            status: "Pending",
        }
        const existing = LocalStorage.getItem("clients") || []
        const clients = Array.isArray(existing) ? existing : []
        clients.push(client)
        LocalStorage.setItem("clients", clients)
        onClose()
        setName("")
        setEmail("")
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Client Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Client Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={handleAddClient} disabled={!name || !email}>
                        Add Client
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}