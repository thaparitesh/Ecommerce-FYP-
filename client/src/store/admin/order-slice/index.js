import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  orderList: [],
  orderDetails: null,    
  salesReports: null,
  isLoading: false,
  error: null    
};
export const getAllOrdersFromAllUsers = createAsyncThunk(
    "order/getAllOrdersFromAllUsers",
    async () => {
        const response = await axios.get(
          `http://localhost:5000/api/admin/orders/get`
        );
        return response.data;
    }
    
  );
  
  export const getOrderDetailsAdmin = createAsyncThunk(
    "order/getOrderDetailsAdmin",
    async (id) => {
        const response = await axios.get(
          `http://localhost:5000/api/admin/orders/details/${id}`
        );
        return response.data;
    }
  );

  export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({id, orderStatus, paymentStatus}) => {
        const response = await axios.put(
          `http://localhost:5000/api/admin/orders/update/${id}`,
          {
            orderStatus, paymentStatus 
          }
        );
        return response.data;
    }
  );
  // export const updatePaymentStatus = createAsyncThunk(
  //   "order/updatePaymentStatus",
  //   async ({id, paymentStatus}) => {
  //       const response = await axios.put(
  //         `http://localhost:5000/api/admin/orders/payment/update/${id}`,
  //         {
  //           paymentStatus
  //         }
  //       );
  //       return response.data;
  //   }
  // );

  export const getAdminSalesReports = createAsyncThunk(
    "order/getAdminSalesReports",
    async () => {
      const response = await axios.get(
        `http://localhost:5000/api/admin/orders/get/sales-reports`
      );
      return response.data;
    }
  );

  const adminOrderSlice = createSlice({
    name: "adminOrderSlice",
    initialState,
    reducers: {
      resetOrderDetails: (state) => {
        state.orderDetails = null;
      },
      resetSalesReports: (state) => {
        state.salesReports = null;
      }
    
    },
    extraReducers: (builder) => {
      builder
        .addCase(getAllOrdersFromAllUsers.pending, (state) => {
          state.isLoading = true;
          
        })
        .addCase(getAllOrdersFromAllUsers.fulfilled, (state, action) => {
           
            state.isLoading = false;
            state.orderList = action.payload.data ;
        })
        .addCase(getAllOrdersFromAllUsers.rejected, (state, action) => {
          state.isLoading = false;
          state.orderList = [];
          state.error = action.payload?.message || "Failed to fetch orders";
        })
  
        // Get Order Details
        .addCase(getOrderDetailsAdmin.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getOrderDetailsAdmin.fulfilled, (state, action) => {
          state.isLoading = false;
          state.orderDetails = action.payload.data || action.payload;
        })
        .addCase(getOrderDetailsAdmin.rejected, (state, action) => {
          state.isLoading = false;
          state.orderDetails = null;
          state.error = action.payload?.message || "Failed to fetch order details";
        })
          .addCase(getAdminSalesReports.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getAdminSalesReports.fulfilled, (state, action) => {
            state.isLoading = false;
            state.salesReports = action.payload.data || action.payload;
          })
          .addCase(getAdminSalesReports.rejected, (state, action) => {
            state.isLoading = false;
            state.salesReports = null;
            state.error = action.payload?.message || "Failed to fetch sales reports";
          })
          ;
    }
  });
  
  export const { resetOrderDetails, resetSalesReports } = adminOrderSlice.actions;
  
  export default adminOrderSlice.reducer;