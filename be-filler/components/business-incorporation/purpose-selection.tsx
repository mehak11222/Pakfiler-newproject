import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Step1PurposeSelectionProps {
    formData: any;
    updateFormData: (data: any) => void;
    handleNext: () => void;
}

const purposes = [
    { value: "sole-proprietor", label: "Sole Proprietor" },
    { value: "aop-partnership", label: "AOP/Partnership" },
    { value: "add-business-ntn", label: "Add Business to NTN" },
    { value: "remove-business-ntn", label: "Remove Business from NTN" },
];

export const Step1PurposeSelection = ({ formData, updateFormData, handleNext }: Step1PurposeSelectionProps) => {
    const handleSelectChange = (value: string) => {
        updateFormData({ purpose: value });
    };

    return (
        <form className="space-y-6">
            <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Purpose of Business Incorporation</Label>
                <Select onValueChange={handleSelectChange} value={formData.purpose} required>
                    <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-red-500 transition-all duration-200">
                        <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                        {purposes.map((purpose) => (
                            <SelectItem key={purpose.value} value={purpose.value}>
                                {purpose.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end">
                <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                >
                    Next
                </Button>
            </div>
        </form>
    );
};