"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AccountantService } from "@/services/accountant.service";

interface LogoutButtonProps {
    variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function LogoutButton({
    variant = "outline",
    size = "default",
    className = "",
}: LogoutButtonProps) {
    const router = useRouter();
    const service: AccountantService = new AccountantService();

    const getAccountants = async () => {
        try {

            await service.getDocuments();
        } catch (error) { }
    };

    const handleLogout = () => {
        // Clear the token cookie
        document.cookie =
            "userToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";

        // Redirect to login page
        router.push("/auth/login");
        router.refresh(); // Refresh to update middleware state
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleLogout}
            className={className}
        >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
    );
}
