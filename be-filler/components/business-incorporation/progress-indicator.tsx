interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
    return (
        <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
                {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
                    <div key={step} className="flex flex-col items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${currentStep >= step ? "bg-red-500" : "bg-gray-300"
                                }`}
                        >
                            {step}
                        </div>
                        <span className="text-sm mt-2 text-gray-600">
                            {step === 1 ? "Purpose" : step === 2 ? "Details" : "Documents"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};