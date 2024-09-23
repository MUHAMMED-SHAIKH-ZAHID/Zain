import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api/axios";  // Assuming axios is configured similarly to your auth slice
import {   getExecutiveDashboardDataAPI  } from "../../../api/url";  // Endpoint URL

// Thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(getExecutiveDashboardDataAPI);
      return response.data;  // Assuming the response contains the data needed for the dashboard
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Initial state for the dashboard slice
const initialState = {
  data: null,
  loading: false,
  error: null
};

// Slice for handling dashboard related actions
const executivedashboardSlice = createSlice({
  name: 'executivedashboard',
  initialState,
  reducers: {
    // Potential reducers for other non-async actions
    resetDashboard(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; // or adjust depending on error structure
      });
  },
});

export const { resetDashboard } = executivedashboardSlice.actions;
export default executivedashboardSlice.reducer;
