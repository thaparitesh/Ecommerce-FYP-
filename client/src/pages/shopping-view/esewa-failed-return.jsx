import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function EsewaFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen pt-20 pb-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 p-8 text-center">
          <div className="text-red-500 text-5xl mb-3">✕</div>
          <h1 className="text-2xl font-medium text-gray-800 mb-1">Payment Failed</h1>
          <p className="text-red-600">We couldn't process your payment</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 text-center">
          <p className="text-gray-600">
            Your payment was not successful. Please try again or contact support if the problem continues.
          </p>
        </div>

        {/* Buttons */}
        <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate('/shop/home')}
            className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EsewaFailurePage;