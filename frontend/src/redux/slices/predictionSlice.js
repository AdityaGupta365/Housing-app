


import { createSlice,createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from 'axios';

const ML_SERVICE_URL ='http://localhost:5001';

export const predictRentPrice=createAsyncThunk(
    'prediction/predictRentPrice',
    async(propertyData,{rejectWithValue})=>{
        try{
            const response=await axios.post(`${ML_SERVICE_URL}/predict`,propertyData);
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response?.data?.error||'Prediction failed');
        }
    }
);

export const getMarketAnalysis=createAsyncThunk(
    'prediction/getMarketAnalysis',
    async(analysisData,{rejectWithValue})=>{
        try{
            const response=await axios.post(`${ML_SERVICE_URL}/market-analysis`,analysisData);
            return response.data;
        }catch(error){
            return rejectWithValue(error.response?.data?.error||'Market analysis failed');
        }
    }
);

const predictionSlice = createSlice({
  name: 'prediction',
  initialState: {
    prediction: null,
    marketAnalysis: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPrediction: (state) => {
      state.prediction = null;
      state.error = null;
    },
    clearMarketAnalysis: (state) => {
      state.marketAnalysis = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Predict rent price
      .addCase(predictRentPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(predictRentPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.prediction = action.payload;
      })
      .addCase(predictRentPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Market analysis
      .addCase(getMarketAnalysis.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMarketAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.marketAnalysis = action.payload;
      })
      .addCase(getMarketAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { clearPrediction, clearMarketAnalysis } = predictionSlice.actions;
export default predictionSlice.reducer;