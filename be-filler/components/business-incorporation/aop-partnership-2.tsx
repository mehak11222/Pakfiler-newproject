import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Step3AopDocumentsProps {
    formData: any;
    updateFormData: (data: any) => void;
    handleBack: () => void;
    handleSubmit: () => void;
}

const documentFields = [
    { name: "partnershipDeed", label: "Partnership Deed (Signed & Registered)" },
    { name: "partnershipCertificate", label: "Partnership Registration Certificate" },
    { name: "authorityLetter", label: "Authority Letter for Partner Representation" },
    { name: "cnicCopies", label: "Color Copy of CNICs of All Partners" },
    { name: "rentAgreement", label: "Rent Agreement/Ownership Documents" },
    { name: "letterhead", label: "Letterhead of the Firm" },
    { name: "electricityBill", label: "Latest Paid Electricity Bill" },
];

export const Step3AopDocuments = ({
    formData,
    updateFormData,
    handleBack,
    handleSubmit,
}: Step3AopDocumentsProps) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            updateFormData({ documents: { ...formData.documents, [name]: files[0] } });
        }
    };

    return (
        <form className="space-y-6">
            {documentFields.map((field) => (
                <div key={field.name} className="space-y-2">
                    <Label className="text-gray-700 font-medium">{field.label}</Label>
                    <Input
                        type="file"
                        name={field.name}
                        onChange={handleFileChange}
                        className="border-gray-300 focus:ring-2 focus:ring-red-500 transition-all duration-200"
                        required
                    />
                </div>
            ))}
            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="hover:bg-gray-100 transition-all duration-200"
                >
                    Back
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                >
                    Submit
                </Button>
            </div>
        </form>
    );
};