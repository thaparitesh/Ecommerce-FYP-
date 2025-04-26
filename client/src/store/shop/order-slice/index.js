import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  paymentUrl: null,       
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  requiresPayment: false, 
  error: null           
};

export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shop/order/create",
        orderData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyEsewaPayment = createAsyncThunk(  
  "order/verifyEsewaPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/shop/order/verify-esewa",
        paymentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "order/getAllOrdersByUserId",
  async (userID, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/list/${userID}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/details/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    resetPaymentState: (state) => {  
      state.paymentUrl = null;
      state.requiresPayment = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create New Order
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // In your extraReducers for createNewOrder.fulfilled:
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.formAction = action.payload.formAction; // New
        state.formData = action.payload.formData;    // New
        state.orderId = action.payload.orderId;
        state.requiresPayment = action.payload.requiresPayment || false;
        
        // if (action.payload.requiresPayment) {
        //   sessionStorage.setItem("currentOrderId", action.payload.orderId);
        // }
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to create order";
      })

      // Verify eSewa Payment
      .addCase(verifyEsewaPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // In your shoppingOrderSlice extraReducers
    .addCase(verifyEsewaPayment.fulfilled, (state, action) => {
      // console.log(action.payload?.data,"data");
      
      state.isLoading = false;
      state.orderDetails = action.payload?.data;
      state.paymentStatus = 'verified';
      state.error = null;
  
      // Clear relevant state
      state.paymentUrl = null;
      state.requiresPayment = false;
    })
      .addCase(verifyEsewaPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Payment verification failed";
      })

      // Get All Orders
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data ;
      })
      .addCase(getAllOrdersByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data || action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        state.error = action.payload?.message || "Failed to fetch order details";
      });
  }
});

export const { resetOrderDetails, resetPaymentState } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;