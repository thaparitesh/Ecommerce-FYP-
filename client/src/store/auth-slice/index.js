import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  allUserList : []
};

// Async Thunk for Registering User
export const registerUser = createAsyncThunk(
  'auth/register', 
  async (formData) => {
    
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        formData,
        { withCredentials: true }
      );
      return response.data;
   
  }
);
// Async Thunk for Logging User
export const loginUser = createAsyncThunk(
  'auth/login', 
  async (formData) => {
   
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData,
        { withCredentials: true }
      );
      return response.data;
   
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout', 
  async () => {
      const response = await axios.post(
        'http://localhost:5000/api/auth/logout',{},
       
        { withCredentials: true }
      );
      return response.data;
  }
);
// Async Thunk for Checking Authorization
export const checkAuth = createAsyncThunk(
  'auth/checkauth', 
  async () => {
      
      const response = await axios.get(
        'http://localhost:5000/api/auth/check-auth',
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

export const updateUserDetails = createAsyncThunk(
  'auth/updateUserDetails',
  async ({ userID, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/users/${userID}`, updatedData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ userID, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/users/${userID}/change-password`, {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getAllUsers = createAsyncThunk(
  'auth/getAllUsers', 
  async () => { 
      const response = await axios.get(
        'http://localhost:5000/api/auth/allusers',
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null; 
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);
        
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null; 
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
         
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null; 
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null; 
        state.isAuthenticated = false;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.user = {
            ...state.user,
            ...action.payload.user
          }
        }
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        console.log(action.payload.data, "all");
        
        state.isLoading = false;
        state.allUserList = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.allUserList = [];
      })
      
      
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
