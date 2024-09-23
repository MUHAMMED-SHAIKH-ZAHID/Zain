import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";  // Assuming axios is configured similarly to your auth slice
import { getDashboardDataAPI } from "../../api/url";  // Endpoint URL

// Thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(getDashboardDataAPI);
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
  error: null,
  chartData:null,
};

// Slice for handling dashboard related actions
const dashboardSlice = createSlice({
  name: 'dashboard',
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
        state.chartData = action.payload.chartData
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; // or adjust depending on error structure
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
