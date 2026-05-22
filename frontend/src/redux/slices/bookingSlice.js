




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance.js';

// Create Booking
export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

// Fetch Tenant Bookings
export const fetchTenantBookings = createAsyncThunk(
  'booking/fetchTenant',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/bookings/tenant');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenant bookings');
    }
  }
);

// Fetch Owner Bookings
export const fetchOwnerBookings = createAsyncThunk(
  'booking/fetchOwner',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/bookings/owner');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch owner bookings');
    }
  }
);

// Fetch All Bookings (Admin)
export const fetchAllBookings = createAsyncThunk(
  'booking/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/bookings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all bookings');
    }
  }
);

// Approve Booking
export const approveBooking = createAsyncThunk(
  'booking/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/bookings/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve booking');
    }
  }
);

// Reject Booking
export const rejectBooking = createAsyncThunk(
  'booking/reject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/bookings/${id}/reject`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    tenantBookings: [],
    ownerBookings: [],
    allBookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBookings: (state) => {
      state.tenantBookings = [];
      state.ownerBookings = [];
      state.allBookings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.tenantBookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Tenant Bookings
      .addCase(fetchTenantBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenantBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.tenantBookings = action.payload;
      })
      .addCase(fetchTenantBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Owner Bookings
      .addCase(fetchOwnerBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerBookings = action.payload;
      })
      .addCase(fetchOwnerBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch All Bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Approve Booking
      .addCase(approveBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Update in ownerBookings
        const ownerIndex = state.ownerBookings.findIndex(
          (booking) => booking._id === action.payload._id
        );
        if (ownerIndex !== -1) {
          state.ownerBookings[ownerIndex] = action.payload;
        }
        
        // Update in allBookings if it exists
        const allIndex = state.allBookings.findIndex(
          (booking) => booking._id === action.payload._id
        );
        if (allIndex !== -1) {
          state.allBookings[allIndex] = action.payload;
        }
      })
      .addCase(approveBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Reject Booking
      .addCase(rejectBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Update in ownerBookings
        const ownerIndex = state.ownerBookings.findIndex(
          (booking) => booking._id === action.payload._id
        );
        if (ownerIndex !== -1) {
          state.ownerBookings[ownerIndex] = action.payload;
        }
        
        // Update in allBookings if it exists
        const allIndex = state.allBookings.findIndex(
          (booking) => booking._id === action.payload._id
        );
        if (allIndex !== -1) {
          state.allBookings[allIndex] = action.payload;
        }
      })
      .addCase(rejectBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;