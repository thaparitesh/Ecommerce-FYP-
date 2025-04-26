import { useLocation, useNavigate } from "react-router-dom";
import { resetOrderDetails } from "@/store/shop/order-slice";
import { useDispatch } from "react-redux";

function EsewaSuccessPage() {
  const { state } = useLocation(); // Get data passed from EsewaReturnPage
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!state) {
    navigate("/shop/home"); // Fallback if accessed directly
    return null;
  }

  return (
    <div className="flex items-start justify-center min-h-screen pt-20 pb-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-50 p-8 text-center">
          <div className="text-green-500 text-5xl mb-3">✓</div>
          <h1 className="text-2xl font-medium text-gray-800 mb-1">Payment Successful</h1>
          <p className="text-green-600">Your order has been placed</p>
        </div>

        {/* Order Details */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">#{state.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">Rs {state.amount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Reference ID:</span>
                <span>{state.paymentId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/shop/home')}
            className="flex-1 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              navigate('/shop/account');
              dispatch(resetOrderDetails());
            }}
            className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            View Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default EsewaSuccessPage;