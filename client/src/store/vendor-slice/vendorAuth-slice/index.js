import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  vendor: null,
  isAuthenticatedVendor: false,
  isVendor: false,
  isLoading: true,
  allVendorList : [],
  error : []
};

// Async Thunk for Registering User
export const registerVendor = createAsyncThunk(
  'auth/registerVendor', 
  async (formData) => {
   
      const response = await axios.post(
        'http://localhost:5000/api/vendorAuth/register',
        formData,
        { withCredentials: true }
      );
      return response.data;
   
  }
);
// Async Thunk for Logging User
export const loginVendor = createAsyncThunk(
  'auth/loginVendor', 
  async (formData, { rejectWithValue }) => {
   
    try {
      const response = await axios.post(
        'http://localhost:5000/api/vendorAuth/login',
        formData,
        { withCredentials: true }
      );
      console.log("response data", response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const logoutVendor = createAsyncThunk(
  'auth/logoutVendor', 
  async () => {
   
      const response = await axios.post(
        'http://localhost:5000/api/vendorAuth/logout',{},
       
        { withCredentials: true }
      );
      return response.data;
  }
);
// Async Thunk for Checking Authorization
export const vendorAuthCheck = createAsyncThunk(
  'auth/checkauth', 
  async () => {
      
      const response = await axios.get(
        'http://localhost:5000/api/vendorAuth/check-auth',
        {
          withCredentials: true, 
          headers : {
            'Cache-Control' : 'no-store',
            Expires : '0'
          },
        }
      );
      return response.data;
   
  }
);


export const changeVendorPassword = createAsyncThunk(
  'auth/changePassword',
  async ({ vendorID, currentPassword, newPassword }) => {
   
      const response = await axios.post(`http://localhost:5000/api/vendorAuth/update/${vendorID}/change-password`, {
        currentPassword,
        newPassword
      })
      return response.data
  }
)


const vendorAuthSlice = createSlice({
  name: 'vendorAuth',
  initialState,
  reducers: {
    setVendor: (state, action) => {
      state.vendor = action.payload;
      state.isAuthenticatedVendor = !!action.payload;
      state.isVendor = !! action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerVendor.pending, (state) => {
        state.isLoading = true;
        
      })
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendor = null; 
        state.isAuthenticatedVendor = false;
        state.isVendor = false;
      })
      .addCase(registerVendor.rejected, (state) => {
        state.isLoading = false;
        state.vendor = null;
        state.isAuthenticatedVendor = false;
        state.isVendor = false;
      })
      .addCase(loginVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginVendor.fulfilled, (state, action) => {
        console.log(action.payload);
        
        state.isLoading = false;
        state.vendor = action.payload.success ? action.payload.vendor : null; 
        state.isAuthenticatedVendor = action.payload.success;
        state.isVendor = action.payload.success;
      })
      .addCase(loginVendor.rejected, (state, action) => {
        console.log(action.payload.message,"error");
        state.isLoading = false;
        state.vendor = null;
        state.isAuthenticatedVendor = false;
        state.isVendor = false;
        state.error = action.payload.message;
        
        
      })
      .addCase(vendorAuthCheck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(vendorAuthCheck.fulfilled, (state, action) => {
         
        state.isLoading = false;
        state.vendor = action.payload.success ? action.payload.vendor : null; 
        state.isAuthenticatedVendor = action.payload.success;
        state.isVendor = action.payload.success;;

      })
      .addCase(vendorAuthCheck.rejected, (state) => {
       
        
        state.isLoading = false;
        state.vendor = null;
        state.isAuthenticatedVendor = false;
        state.isVendor = false;
        
      })
      .addCase(logoutVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendor = null; 
        state.isAuthenticatedVendor = false;
        state.isVendor = false;
      })
     
      
  },
});

export const { setVendor } = vendorAuthSlice.actions;
export default vendorAuthSlice.reducer;
