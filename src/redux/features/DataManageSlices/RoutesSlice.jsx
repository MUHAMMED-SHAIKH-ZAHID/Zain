import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../api/axios";
import { RouteAPI } from '../../../api/url'; // Define this constant to point to your routes API

// Async thunks for route CRUD operations
export const fetchRoutes = createAsyncThunk(
  'routes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(RouteAPI);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createRoute = createAsyncThunk(
  'routes/create',
  async (routeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(RouteAPI, routeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRoute = createAsyncThunk(
  'routes/update',
  async ({ id, ...routeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${RouteAPI}/${id}`, routeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRoute = createAsyncThunk(
  'routes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${RouteAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Route slice with reducers and extra reducers
const routeSlice = createSlice({
  name: 'routeslice',
  initialState: {
    routes: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.routes = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createRoute.fulfilled, (state, action) => {
        state.routes.push(action.payload);
      })
      .addCase(updateRoute.fulfilled, (state, action) => {
        const index = state.routes.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.routes[index] = action.payload;
        }
      })
      .addCase(deleteRoute.fulfilled, (state, action) => {
        state.routes = state.routes.filter(r => r.id !== action.payload);
      });
  }
});

export default routeSlice.reducer;
