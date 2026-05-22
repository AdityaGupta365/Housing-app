// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import axios from '../../utils/axiosInstance.js';
// import axios from '../../utils/axiosInstance.js';

// // Fetch All Properties
// export const fetchAllProperties = createAsyncThunk(
//     'property/fetchAll',
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await axios.get('/api/properties/properties');
//             console.log(response);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

// // Fetch Owner Properties
// export const fetchOwnerProperties = createAsyncThunk(
//     'property/fetchOwner',
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await axios.get('/api/properties/owner');
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

// // Create Property
// export const createProperty = createAsyncThunk(
//     'property/create',
//     async (propertyData, { rejectWithValue }) => {
//         try {
//             const response = await axios.post('/api/properties/addproperty', propertyData);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

// // Update Property
// export const updateProperty = createAsyncThunk(
//     'property/update',
//     async ({ id, propertyData }, { rejectWithValue }) => {
//         try {
//             // Changed from POST to PUT for update operations
//             const response = await axios.put(`/api/properties/${id}`, propertyData);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

// // Delete Property
// export const deleteProperty = createAsyncThunk(
//     'property/delete',
//     async (id, { rejectWithValue }) => {
//         try {
//             // Fixed: only pass the ID, not as an object
//             await axios.delete(`/api/properties/${id}`);
//             return id; // Return the ID for filtering in the reducer
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

// const propertySlice = createSlice({
//     name: 'property',
//     initialState: {
//         properties: [],
//         ownerProperties: [],
//         selectedProperty: null,
//         loading: false,
//         error: null,
//     },
//     reducers: {
//         setSelectedProperty: (state, action) => {
//             state.selectedProperty = action.payload;
//         },
//         clearError: (state) => {
//             state.error = null;
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             // Fetch All Properties
//             .addCase(fetchAllProperties.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchAllProperties.fulfilled, (state, action) => {
//                 state.loading = false; // Fixed: was true
//                 state.properties = action.payload;
//             })
//             .addCase(fetchAllProperties.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload; // Fixed: was setting properties
//             })
//             // Fetch Owner Properties
//             .addCase(fetchOwnerProperties.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchOwnerProperties.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.ownerProperties = action.payload;
//             })
//             .addCase(fetchOwnerProperties.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })
//             // Create Property
//             .addCase(createProperty.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(createProperty.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.ownerProperties.push(action.payload);
//             })
//             .addCase(createProperty.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })
//             // Update Property
//             .addCase(updateProperty.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(updateProperty.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const index = state.ownerProperties.findIndex(
//                     (property) => property._id === action.payload._id
//                 );
//                 if (index !== -1) {
//                     state.ownerProperties[index] = action.payload;
//                 }
//             })
//             .addCase(updateProperty.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })
//             // Delete Property
//             .addCase(deleteProperty.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(deleteProperty.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.ownerProperties = state.ownerProperties.filter(
//                     (property) => property._id !== action.payload
//                 );
//             })
//             .addCase(deleteProperty.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });
//     }
// });

// export const { setSelectedProperty, clearError } = propertySlice.actions;
// export default propertySlice.reducer;









import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance.js';

// Fetch All Properties
export const fetchAllProperties = createAsyncThunk(
  'property/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/properties/properties');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch Properties Owned by Logged-in User
export const fetchOwnerProperties = createAsyncThunk(
  'property/fetchOwner',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/properties/owner');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create Property (supports FormData for image upload)
export const createProperty = createAsyncThunk(
  'property/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/properties/addproperty', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update Property (also supports FormData)
export const updateProperty = createAsyncThunk(
  'property/update',
  async ({ id, propertyData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/properties/${id}`, propertyData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete Property
export const deleteProperty = createAsyncThunk(
  'property/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/properties/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Initial State
const initialState = {
  properties: [],
  ownerProperties: [],
  selectedProperty: null,
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchAllProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Owner
      .addCase(fetchOwnerProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerProperties = action.payload;
      })
      .addCase(fetchOwnerProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerProperties.push(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ownerProperties.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.ownerProperties[index] = action.payload;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerProperties = state.ownerProperties.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedProperty, clearError } = propertySlice.actions;
export default propertySlice.reducer;
