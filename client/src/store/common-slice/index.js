import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {    
  isLoading: false,
  featureImageList: [],        
};

export const getFeatureImage = createAsyncThunk(
  "shop/getFeatureImage",
  async () => {
      const response = await axios.get(
        "http://localhost:5000/api/common/feature/get"
      );
      return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
    "shop/getFeatureImage",
    async (image) => {
        const response = await axios.post(
          "http://localhost:5000/api/common/feature/add",
          {image}
        );
        return response.data;
    }
  );
  export const deleteFeatureImage = createAsyncThunk(
    "shop/deleteFeatureImage",
    async (featureID) => {
        const response = await axios.delete(
          `http://localhost:5000/api/common/feature/${featureID}`
        );
        return response.data;
    }
  );


const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImage.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })

  }
});

export default commonSlice.reducer;