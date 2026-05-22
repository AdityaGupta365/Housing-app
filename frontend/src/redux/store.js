

// import { configureStore } from "@reduxjs/toolkit";

// export const store=configureStore({
//     reducer:{
//         user:userReducer,
//         admin:adminReducer,
//     }
// })





// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import propertyReducer from './slices/propertySlice';
// import rentalHistoryReducer from './slices/rentalHistorySlice';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/Authenticationslice';
import rentalHistoryReducer from './slices/rentalHistorySlice';
import bookingReducer from './slices/bookingSlice';
import predictionReducer from './slices/predictionSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    property: propertyReducer,
    rentalHistory: rentalHistoryReducer,
    admin: adminReducer,
    auth: authReducer,
    booking: bookingReducer, 
    prediction:predictionReducer,
  },
});
