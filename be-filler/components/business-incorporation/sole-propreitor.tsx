import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Step2SoleProprietorProps {
    formData: any;
    updateFormData: (data: any) => void;
    handleBack: () => void;
    handleSubmit: () => void;
}

export const Step2SoleProprietor = ({
    formData,
    updateFormData,
    handleBack,
    handleSubmit,
}: Step2SoleProprietorProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    };

    return (
        <form className="space-y-6">
            <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Business Name</Label>
                <Input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter business name"
                    className="border-gray-300 focus:ring-2 focus:ring-red-500 transition-all duration-200"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Email</Label>
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="border-gray-300 focus:ring-2 focus:ring-red-500 transition-all duration-200"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Phone Number</Label>
                <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="92300xxxxxxx"
                    className="border-gray-300 focus:ring-2 focus:ring-red-500 transition-all duration-200"
                    required
                />
            </div>
            <div className="flex space-x-4">
                <div className="space-y-2 w-1/2">
                    <Label className="text-gray-700 font-medium">IRIS PIN</Label>
                    <Input
                        type="text"
                        name="irisPin"
                        value={formData.irisPin}
                        onChange={handleInputChange}
                        placeholder="1234"
                        className="border-gray-300 focus:ring-2 focus:ring-red-500 transition-all duration-200"
                        required
                    />
                </div>
                <div className="space-y-2 w-1/2">
                    <Label className="text-gray-700 font-medium">IRIS Password</Label>
                    <Input
                        type="password"
                        name="irisPassword"
                        value={formData.irisPassword}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        className="border-gray-300 focus:ring-2 focus:ring-red-500 transition-all duration-200"
                        required
                    />
                </div>
            </div>
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