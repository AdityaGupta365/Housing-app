import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

// Fetch Rental History
export const fetchRentalHistory = createAsyncThunk(
  'rentalHistory/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/rental-history');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Update Payment Status
export const updatePaymentStatus = createAsyncThunk(
  'rentalHistory/updatePayment',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/rental-history/${id}/payment`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const rentalHistorySlice = createSlice({
  name: 'rentalHistory',
  initialState: {
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rental History
      .addCase(fetchRentalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRentalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchRentalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Payment Status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const index = state.history.findIndex(
          (entry) => entry._id === action.payload._id
        );
        if (index !== -1) {
          state.history[index] = action.payload;
        }
      });
  },
});

export const { clearError } = rentalHistorySlice.actions;
export default rentalHistorySlice.reducer;