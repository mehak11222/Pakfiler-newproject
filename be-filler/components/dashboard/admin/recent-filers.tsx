"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Clock } from "lucide-react"

export interface RecentFiler {
  _id: string;
  taxYear: number;
  filingType: 'individual' | 'business';
  grossIncome: number;
  taxPaid: number;
  documents: string[];
  status: 'under_review' | 'completed' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
  user: {
    fullName: string;
    email: string;
  } | null; // Allow user to be null
}

interface RecentFilersProps {
  filers: RecentFiler[];
}

export function RecentFilers({ filers }: RecentFilersProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Tax Filers</CardTitle>
            <CardDescription>Most recent tax returns filed</CardDescription>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="h-4 w-4 mr-1" /> Last updated: {formatDate(new Date().toISOString())}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Tax Year</TableHead>
              <TableHead>Filing Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filers.map((filer: RecentFiler) => (
              <TableRow key={filer._id}>
                <TableCell>{filer.user?.fullName || 'Unknown User'}</TableCell>
                <TableCell>{filer.taxYear}</TableCell>
                <TableCell>{filer.createdAt ? formatDate(filer.createdAt) : 'N/A'}</TableCell>
                <TableCell>{formatCurrency(filer.taxPaid)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      filer.status === "completed"
                        ? "border-green-500 text-green-500"
                        : "border-yellow-500 text-yellow-500"
                    }
                  >
                    {filer.status === "completed" ? (
                      <FileCheck className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {filer.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}