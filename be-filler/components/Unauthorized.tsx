import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Unauthorized() {
    return (
        <div className="container mx-auto py-8 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md border shadow-sm">
                <CardHeader className="bg-gray-50">
                    <CardTitle className="text-xl text-[#15803d]">Unauthorized Access</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-6">
                        You do not have the required role to access this page.
                    </p>
                    <Button
                        asChild
                        variant="outline"
                        className="text-[#15803d] border-[#15803d] hover:bg-[#15803d] hover:text-white w-full"
                    >
                        {/* <Link href="/auth/login" aria-label="Return to login">
                            Return to Login
                        </Link> */}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}