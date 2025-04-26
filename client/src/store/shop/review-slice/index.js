import axios from "axios";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading : false,
    reviews : [],
    unreviewedProducts : [],
    
}

export const addReview = createAsyncThunk(
    "/shop/addReview",
    async (data) => {
        console.log(data, "data");
        
        const response = await axios.post(
          `http://localhost:5000/api/shop/review/add`,
          data
        );
        return response.data;
    }
  );

  export const getReviews = createAsyncThunk(
    "/shop/getReviews",
    async (productID) => {
     
        const response = await axios.get(
          `http://localhost:5000/api/shop/review/${productID}`
        );
        return response.data;
    }
  );
  
  export const getUnreviewedProducts = createAsyncThunk(
    "/shop/getUnreviewedProducts",
    async (userID) => {
      const response = await axios.get(
        `http://localhost:5000/api/shop/review/unreviewed/${userID}`
      );
      return response.data;
    }
  );


const reviewSlice = createSlice({
    name : 'reviewSlice',
    initialState,
    reducers:{
    },
    extraReducers : (builder) => {
        builder.addCase(getReviews.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(getReviews.fulfilled,(state,action)=>{
            console.log(action.payload.data);
          
            state.isLoading = false;
            state.reviews = action.payload.data;
        })
        .addCase(getReviews.rejected,(state)=>{
            state.isLoading = false;
            state.reviews = [];
        })
        
        .addCase(getUnreviewedProducts.pending, (state) => {
            state.isLoading = true;
        })
          .addCase(getUnreviewedProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.unreviewedProducts = action.payload.data;
        })
          .addCase(getUnreviewedProducts.rejected, (state) => {
            state.isLoading = false;
            state.unreviewedProducts = [];
         })
    }
})


export default reviewSlice.reducer;