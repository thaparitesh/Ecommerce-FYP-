import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  orderList: [],
  orderDetails: null,
  salesReports: null,
  isLoading: false,
  error: null
};

export const getAllOrdersFromAllUsersForVendor = createAsyncThunk(
    "order/getAllOrdersFromAllUsersForVendor",
    async (vendorID) => {
        const response = await axios.get(
          `http://localhost:5000/api/vendor/orders/get/${vendorID}`
        );
        return response.data;
    }
    
  );
  
  export const getOrderDetailsVendor = createAsyncThunk(
    "order/getOrderDetailsVendor",
    async ({id, vendorID}) => {
        const response = await axios.get(
          `http://localhost:5000/api/vendor/orders/details/${id}/${vendorID}`
        );
        return response.data;
    }
  );

  export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({id, vendorID, orderDetailStatus}) => {
        const response = await axios.put(
          `http://localhost:5000/api/vendor/orders/update/${id}/${vendorID}`,
          {
            orderDetailStatus
          }
        );
        return response.data;
    }
  );

  export const getVendorSalesReports = createAsyncThunk(
    "vendorOrder/getVendorSalesReports",
    async (vendorID) => {
      const response = await axios.get(
        `http://localhost:5000/api/vendor/orders/sales-reports/${vendorID}`
      );
      return response.data;
    }
  );



  const vendorOrderSlice = createSlice({
    name: "vendorOrderSlice",
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
        .addCase(getAllOrdersFromAllUsersForVendor.pending, (state) => {
          state.isLoading = true;
          
        })
        .addCase(getAllOrdersFromAllUsersForVendor.fulfilled, (state, action) => {
           
            state.isLoading = false;
            state.orderList = action.payload.data ;
        })
        .addCase(getAllOrdersFromAllUsersForVendor.rejected, (state, action) => {
          state.isLoading = false;
          state.orderList = [];
          state.error = action.payload?.message || "Failed to fetch orders";
        })
  
        // Get Order Details
        .addCase(getOrderDetailsVendor.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getOrderDetailsVendor.fulfilled, (state, action) => {
          state.isLoading = false;
          state.orderDetails = action.payload.data || action.payload;
        })
        .addCase(getOrderDetailsVendor.rejected, (state, action) => {
          state.isLoading = false;
          state.orderDetails = null;
          state.error = action.payload?.message || "Failed to fetch order details";
        })
        .addCase(getVendorSalesReports.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getVendorSalesReports.fulfilled, (state, action) => {
          state.isLoading = false;
          state.salesReports = action.payload.data || action.payload;
        })
        .addCase(getVendorSalesReports.rejected, (state, action) => {
          state.isLoading = false;
          state.salesReports = null;
          state.error = action.payload?.message || "Failed to fetch sales reports";
        })
        ;
    }
  });
  
  export const { resetOrderDetails,resetSalesReports } = vendorOrderSlice.actions;
  
  export default vendorOrderSlice.reducer;