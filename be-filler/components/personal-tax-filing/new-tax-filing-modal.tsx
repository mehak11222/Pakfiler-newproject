"use client";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUser } from "@/lib/auth";

interface NewTaxFilingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { taxYear: number; filingType: "individual" | "business" }) => void;
}

interface FormData {
    taxYear: string;
    filingType: "individual" | "business";
}

const NewTaxFilingModal = ({ isOpen, onClose, onSubmit }: NewTaxFilingModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: {
            taxYear: new Date().getFullYear().toString(),
            filingType: "individual",
        },
    });
    const { toast } = useToast();
    const currentUser = getCurrentUser();

    const onSubmitForm = (data: FormData) => {
        const taxYear = parseInt(data.taxYear);
        if (isNaN(taxYear) || taxYear < 2010 || taxYear > new Date().getFullYear() + 1) {
            toast({
                title: "Invalid Tax Year",
                description: `Tax year must be between 2010 and ${new Date().getFullYear() + 1}.`,
                variant: "destructive",
            });
            return;
        }
        onSubmit({ taxYear, filingType: data.filingType });
        reset();
    };

    // Generate tax year options - allow selection from 2010 to next year
    const currentYear = new Date().getFullYear();
    const taxYearOptions = [];
    for (let year = currentYear + 1; year >= 2010; year--) {
        taxYearOptions.push(year);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Tax Filing</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="userName">User Name</Label>
                            <Input
                                id="userName"
                                value={currentUser?.fullName || currentUser?.name || ""}
                                readOnly
                                className="bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <Label htmlFor="taxYear">Tax Year</Label>
                            <select
                                id="taxYear"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("taxYear", { required: "Tax Year is required" })}
                            >
                                <option value="">Select Tax Year</option>
                                {taxYearOptions.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            {errors.taxYear && (
                                <p className="text-sm text-green-600 mt-1">{errors.taxYear.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onClose();
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewTaxFilingModal;