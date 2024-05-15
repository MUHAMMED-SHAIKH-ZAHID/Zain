import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../api/axios";
import { TaxAPI } from '../../../api/url'; // Define this constant to point to your taxes API

// Async thunks for tax CRUD operations
export const fetchTaxes = createAsyncThunk(
  'taxes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(TaxAPI);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTax = createAsyncThunk(
  'taxes/create',
  async (taxData, { rejectWithValue }) => {
    try {
      const response = await axios.post(TaxAPI, taxData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTax = createAsyncThunk(
  'taxes/update',
  async ({ id, ...taxData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${TaxAPI}/${id}`, taxData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTax = createAsyncThunk(
  'taxes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${TaxAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Tax slice with reducers and extra reducers
const taxSlice = createSlice({
  name: 'tax',
  initialState: {
    taxes: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaxes.fulfilled, (state, action) => {
        state.taxes = action.payload.taxes;
        state.loading = false;
      })
      .addCase(fetchTaxes.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createTax.fulfilled, (state, action) => {
        state.taxes.unshift(action.payload.taxes);
      })
      .addCase(updateTax.fulfilled, (state, action) => {
        const index = state.taxes.findIndex(t => t.id === action.payload.tax.id);
        if (index !== -1) {
          state.taxes[index] = action.payload.tax;
        }
      })
      .addCase(deleteTax.fulfilled, (state, action) => {
        state.taxes = state.taxes.filter(t => t.id !== action.payload);
      });
  }
});

export default taxSlice.reducer;
