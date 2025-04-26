const axios = require("axios");
const crypto = require("crypto");
const { decode } = require("querystring");
const { v4: uuidv4 } = require('uuid');



const generatePaymentForm = async (paymentData) => {
  try {
    
    const {
      amount,
      taxAmount,
      deliveryCharge,
      total_amount,
      transaction_uuid,
      productCode,
      successUrl,
      failureUrl
    } = paymentData;
    

    // Generate signature
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${productCode}`;
    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
                  .createHmac("sha256", secretKey)
                  .update(message)
                  .digest("base64")
                
    return {
      formAction: `${process.env.ESEWA_GATEWAY_URL}/api/epay/main/v2/form`,
      formData: {
        amount : amount,
        tax_amount: taxAmount,
        total_amount: total_amount,
        transaction_uuid: transaction_uuid,
        product_code: productCode,
        product_service_charge: 0,
        product_delivery_charge: deliveryCharge,
        success_url: successUrl,
        failure_url: failureUrl,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature : hash
      }
    };
  } catch (error) {
    console.error("Error generating eSewa payment form:", error);
    throw error;
  }
};

const verifyPayment = async (encodedData) => {
  try {
    
    
    let decodedData = atob(encodedData);
    decodedData = await JSON.parse(decodedData);
    
    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    console.log(hash);
    console.log(decodedData.signature);
    
    
    if (hash !== decodedData.signature) {
      console.log("signature doesnot match");
      return { success: false, message: "Invalid signature" };
    }

    // Verify payment status
    if (decodedData.status !== "COMPLETE") {
      return { success: false, message: "Payment not completed" };
    }

    return { 
      success: true,
      data: {
        amount: decodedData.total_amount,
        transaction_uuid: decodedData.transaction_uuid,
        paymentID: decodedData.transaction_code

      }
    };

  } catch (error) {
    console.error("Verification error:", error);
    return { 
      success: false, 
      message: "Verification failed",
      error: error.message 
    };
  }
};

module.exports = {
  generatePaymentForm,
  verifyPayment
};