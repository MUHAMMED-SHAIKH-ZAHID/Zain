import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../api/axios";
import { LocationAPI } from '../../../api/url';

// Async thunk for fetching all locations
export const fetchLocations = createAsyncThunk(
  'locations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${LocationAPI}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for creating a new location
export const createLocation = createAsyncThunk(
  'locations/create',
  async (locationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${LocationAPI}`, locationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating a location
export const updateLocation = createAsyncThunk(
  'locations/update',
  async ({ id, ...locationData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${LocationAPI}/${id}`, locationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a location
export const deleteLocation = createAsyncThunk(
  'locations/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${LocationAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const locationSlice = createSlice({
  name: 'locations',
  initialState: {
    locations: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        console.log("checking the datat type from the backend what the type will they give",action.payload.locations ,"and the type is",typeof(action.payload.locations))
        state.locations = action.payload.locations.map(item =>  item);
        state.loading = false;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        console.log(action.payload.location,"checking whats beign pushed")

        if (Array.isArray(state.locations)) {
            state.locations.unshift(action.payload.location);
        } else {
            console.error('state.locations is not an array:', typeof(state.locations));
        }
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        const index = state.locations.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.locations[index] = action.payload;
        }
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.locations = state.locations.filter(l => l.id !== action.payload);
      });
  }
});

export default locationSlice.reducer;
