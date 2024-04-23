import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { SalesExecutivesAPI } from '../../api/url';

// Fetch all sales executives
export const fetchAllSalesExecutives = createAsyncThunk(
  'salesExecutives/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(SalesExecutivesAPI);
      console.log(response.data,"the datat om in the sales executive page ")
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch single sales executive by ID
export const fetchSalesExecutiveById = createAsyncThunk(
  'salesExecutives/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${SalesExecutivesAPI}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a new sales executive
export const createSalesExecutive = createAsyncThunk(
  'salesExecutives/create',
  async (salesExecutiveData, thunkAPI) => {
    try {
      const response = await axios.post(SalesExecutivesAPI, salesExecutiveData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a sales executive
export const updateSalesExecutive = createAsyncThunk(
  'salesExecutives/update',
  async ({ id, salesExecutiveData }, thunkAPI) => {
    try {
      const response = await axios.put(`${SalesExecutivesAPI}/${id}`, salesExecutiveData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a sales executive
export const deleteSalesExecutive = createAsyncThunk(
  'salesExecutives/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${SalesExecutivesAPI}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Initial state for the sales executives slice
const initialState = {
  salesExecutives: [],
  loading: false,
  error: null,
  currentSalesExecutive: null,
};

// Slice definition
const salesExecutiveSlice = createSlice({
  name: 'salesExecutives',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSalesExecutives.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSalesExecutives.fulfilled, (state, action) => {
        state.salesExecutives = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllSalesExecutives.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSalesExecutiveById.fulfilled, (state, action) => {
        state.currentSalesExecutive = action.payload;
      })
      .addCase(createSalesExecutive.fulfilled, (state, action) => {
        state.salesExecutives.push(action.payload);
      })
      .addCase(updateSalesExecutive.fulfilled, (state, action) => {
        const index = state.salesExecutives.findIndex(se => se.id === action.payload.id);
        if (index !== -1) {
          state.salesExecutives[index] = action.payload;
        }
      })
      .addCase(deleteSalesExecutive.fulfilled, (state, action) => {
        state.salesExecutives = state.salesExecutives.filter(se => se.id !== action.payload);
      });
  }
});

export default salesExecutiveSlice.reducer;
