import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    cartItems: [],
    isLoading: false,
    error: null
};

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ userID, productID, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/shop/cart/add-cart`, {
                userID, productID, quantity
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Error adding to cart');
        }
    }
);

export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (userID, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/shop/cart/get/${userID}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Error fetching cart');
        }
    }
);

export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async ({ userID, productID }) => {
      const response = await axios.delete(
        `http://localhost:5000/api/shop/cart/${userID}/${productID}`
      );
      return response.data;
    }
  );

export const updateCartQuantity = createAsyncThunk(
    'cart/updateCartQuantity',
    async ({ userID, productID, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/shop/cart/update-cart`, {
                userID, productID, quantity
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Error updating quantity');
        }
    }
);

const shopCartSlice = createSlice({
    name: 'shoppingCart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Add to cart
        builder.addCase(addToCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data || [];
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.isLoading = false;
            state.cartItems = [];
        })
        
        // Fetch cart items
        .addCase(fetchCartItems.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchCartItems.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data || [];
        })
        .addCase(fetchCartItems.rejected, (state, action) => {
            state.isLoading = false;
            state.cartItems = [];
        })
        
        // Update quantity
        .addCase(updateCartQuantity.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(updateCartQuantity.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data || [];
        })
        .addCase(updateCartQuantity.rejected, (state, action) => {
            state.isLoading = false;
            state.cartItems = [];
        })
        
        // Delete item
        .addCase(deleteCartItem.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(deleteCartItem.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data;
          })
          .addCase(deleteCartItem.rejected, (state) => {
            state.isLoading = false;
            state.cartItems = [];
          });
    }
});

export default shopCartSlice.reducer;