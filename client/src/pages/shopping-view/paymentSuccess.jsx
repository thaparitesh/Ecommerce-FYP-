import { resetPaymentState } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orderId, amount, referenceId, orderDetails } = location.state || {};
  
    useEffect(() => {
      if (!orderId) {
        navigate('/shop/home');
      }
      
      // Clear any payment state
      dispatch(resetPaymentState());
      
      // Clear cart from localStorage/sessionStorage if needed
      localStorage.removeItem('cart');
      sessionStorage.removeItem('currentOrderId');
    }, [dispatch, navigate, orderId]);
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          
          <div className="mb-4 space-y-2">
            <p>Order #: {orderId}</p>
            <p>Amount: Rs {amount}</p>
            <p className="text-sm text-gray-500">Reference ID: {referenceId}</p>
          </div>
          
          {orderDetails?.items && (
            <div className="mb-6 border-t pt-4">
              <h3 className="font-semibold mb-2">Order Items:</h3>
              <ul className="space-y-1">
                {orderDetails.items.map(item => (
                  <li key={item.productID} className="flex justify-between">
                    <span>{item.title} (x{item.quantity})</span>
                    <span>Rs {item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/shop/home')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/shop/orders')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Order Details
            </button>
          </div>
        </div>
      </div>
    );
  }
  export default OrderSuccess;