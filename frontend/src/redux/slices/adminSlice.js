import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance.js';

export const fetchAllUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const res = await axios.get('/api/admin/users');
  return res.data;
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id) => {
  await axios.delete(`/api/admin/users/${id}`); // ✅ correct template string
  return id;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // ✅ corrected
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  }
});

export default adminSlice.reducer;
