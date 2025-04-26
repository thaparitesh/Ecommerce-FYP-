import axios from "axios";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState ={
    isLoading : false,
    productList : [],
    productDetails : null

};

export const fetchAllFilteredProducts = createAsyncThunk(
    '/products/fetchAllProducts',
    async ({ filterParams, sortParams }) => {
      // console.log('filterParams:', filterParams); 
      // console.log('sortParams:', sortParams); 
      const query = new URLSearchParams();
  
      Object.entries(filterParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => query.append(key, val));
        } else {
          query.append(key, value);
        }
      });
  
      if (sortParams) {
        query.append("sortBy", sortParams);
      }
  
      // console.log('Final Query:', query.toString()); // Debug final query string
  
      const result = await axios.get(
        `http://localhost:5000/api/shop/products/get?${query}`
      );
  
      return result?.data;
    }
  );
  
  export const fetchProductDetails = createAsyncThunk(
    '/products/fetchProductDetails',
    async (id) => {
    
      const result = await axios.get(
        `http://localhost:5000/api/shop/products/get/${id}`
      );
  
      return result?.data;
    }
  );
  
  

const shopProductSlice = createSlice({
    name : 'shoppingProducts',
    initialState, 
    
    reducers : {
      clearProductDetails: (state) => {
        state.productDetails = null;
      }
    },
    extraReducers : (builder)=> {
        builder.addCase(fetchAllFilteredProducts.pending, (state) => {
                    state.isLoading = true
                })
                .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
                   console.log(action.payload);
                   
                    state.isLoading = false
                    state.productList = action.payload.data
                })
                .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
                    
                    state.isLoading = false
                    state.productList = []
                })
                .addCase(fetchProductDetails.pending, (state) => {
                    state.isLoading = true
                })
                .addCase(fetchProductDetails.fulfilled, (state, action) => {
                   console.log(action.payload);
                   
                    state.isLoading = false
                    state.productDetails = action.payload.data
                })
                .addCase(fetchProductDetails.rejected, (state, action) => {
                    
                    state.isLoading = false
                    state.productDetails = null
                })
    }
})

export const { clearProductDetails } = shopProductSlice.actions;
export default shopProductSlice.reducer;