import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEsewaPayment } from "@/store/shop/order-slice";

function EsewaReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const esewaData = searchParams.get('data');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!esewaData) throw new Error("No payment data received");
        
        const result = await dispatch(verifyEsewaPayment({ params: { data: esewaData } }));
        
        if (verifyEsewaPayment.fulfilled.match(result)) {
          navigate("/shop/payment/esewa-success", { state: result.payload.data }); 
        } else {
          navigate("/shop/payment/esewa-failed", { state: { error: result.error.message } }); 
        }
      } catch (err) {
        navigate("/shop/payment/esewa-failed", { state: { error: err.message } });
      }
    };

    verifyPayment();
  }, [dispatch, esewaData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing your payment...</p>
      </div>
    </div>
  );
}

export default EsewaReturnPage;