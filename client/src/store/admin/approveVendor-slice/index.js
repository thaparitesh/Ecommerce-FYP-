import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

  const initialState = {
    vendors: [],
    pendingVendors: [],
    currentVendor: null,
    loading: false,
    error: null,
    statusUpdateLoading: false,
    statusUpdateError: null,   
  };

export const fetchAllVendors = createAsyncThunk(
  'vendorApproval/fetchAllVendors',
  async () => {
      const response = await axios.get(
          `http://localhost:5000/api/admin/approve/get`
        );
      return response.data;
   
  }
);

export const fetchVendorDetails = createAsyncThunk(
  'vendorApproval/fetchVendorDetails',
  async (vendorID, { rejectWithValue }) => {
    try {
      const response = await axios.get(
          `http://localhost:5000/api/admin/approve/details/${vendorID}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchPendingVendors = createAsyncThunk(
  'vendorApproval/fetchPendingVendors',
  async () => {
    
      const response = await axios.get(
          `http://localhost:5000/api/admin/approve/pending`);
      return response.data;
    
  }
);

export const updateVendorStatus = createAsyncThunk(
  'vendorApproval/updateVendorStatus',
  async ({ vendorID, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
          `http://localhost:5000/api/admin/approve/update/${vendorID}`, 
        { status });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Slice
const vendorApprovalSlice = createSlice({
  name: 'vendorApproval',
  initialState,
  reducers: {
    clearVendorError: (state) => {
      state.error = null;
      state.statusUpdateError = null;
    },
    resetVendorState: (state) => {
      state.currentVendor = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all vendors
      .addCase(fetchAllVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.data;
      })
      .addCase(fetchAllVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch vendors';
      })

      // Fetch vendor details
      .addCase(fetchVendorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVendor = action.payload.data;
      })
      .addCase(fetchVendorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch vendor details';
      })

      // Fetch pending vendors
      .addCase(fetchPendingVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingVendors = action.payload.data;
      })
      .addCase(fetchPendingVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch pending vendors';
      })

      // Update vendor status
      .addCase(updateVendorStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.statusUpdateError = null;
      })
      .addCase(updateVendorStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        // Update the vendor in both vendors and pendingVendors arrays
        const updatedVendor = action.payload.data;
        state.vendors = state.vendors.map(vendor => 
          vendor.vendorID === updatedVendor.id ? { ...vendor, status: updatedVendor.status } : vendor
        );
        state.pendingVendors = state.pendingVendors.filter(
          vendor => vendor.vendorID !== updatedVendor.id
        );
        if (state.currentVendor?.vendorID === updatedVendor.id) {
          state.currentVendor.status = updatedVendor.status;
        }
      })
      .addCase(updateVendorStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateError = action.payload?.message || 'Failed to update vendor status';
      });
  },
});

// Export actions and reducer
export const { clearVendorError, resetVendorState } = vendorApprovalSlice.actions;
export default vendorApprovalSlice.reducer;