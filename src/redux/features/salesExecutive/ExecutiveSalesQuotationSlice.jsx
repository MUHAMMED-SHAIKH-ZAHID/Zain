import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/axios';
import { ExecutiveSalesQuotationAPI } from '../../../api/url'; // Make sure to define this endpoint

// Fetch all sales quotations
export const fetchAllSalesQuotations = createAsyncThunk(
  'sales/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(ExecutiveSalesQuotationAPI);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch single sales quotation by ID
export const fetchSalesQuotationById = createAsyncThunk(
  'sales/fetchByIdexecutivequote',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${ExecutiveSalesQuotationAPI}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a new sales quotation
export const createSalesQuotation = createAsyncThunk(
  'invoice/create',
  async (salesData, thunkAPI) => {
    try {
      const response = await axios.post(ExecutiveSalesQuotationAPI, salesData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a sales quotation
export const updateSalesQuotation = createAsyncThunk(
  'invoice/update',
  async ({ id, salesData }, thunkAPI) => {
    try {
      const response = await axios.put(`${ExecutiveSalesQuotationAPI}/${id}`, salesData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a sales quotation
export const deleteSalesQuotation = createAsyncThunk(
  'sales/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${ExecutiveSalesQuotationAPI}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Initial state for the sales slice
const initialState = {
  sales: [],
  loading: false,
  error: null,
  currentSales: null,
  customers: [],
  products: [],
  editSales: null,
  viewSales: null,
  convertSales: null,
};

// Slice definition
const executivesalesQuotationSlice = createSlice({
  name: 'executiveSalesOrder',
  initialState,
  reducers: {
    editSalesQuotation: (state, action) => {
      state.editSales = action.payload;
    },
    viewSalesQuotation: (state, action) => {
      state.viewSales = action.payload;
    },
    convertSalesQuotation: (state, action) => {
      state.convertSales = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSalesQuotations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSalesQuotations.fulfilled, (state, action) => {
        state.sales = action.payload.quotations;
        state.customers = action.payload.customers;
        state.products = action.payload.products;
        state.loading = false;
      })
      .addCase(fetchAllSalesQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSalesQuotationById.fulfilled, (state, action) => {
        state.currentSales = action.payload;
      })
      .addCase(createSalesQuotation.fulfilled, (state, action) => {
        state.sales.unshift(action.payload.saleQuotation);
      })
      .addCase(updateSalesQuotation.fulfilled, (state, action) => {
        const index = state.sales.findIndex(s => s.id === action.payload.saleQuotation.id);
        if (index !== -1) {
          state.sales[index] = action.payload.saleQuotation;
        }
      })
      .addCase(deleteSalesQuotation.fulfilled, (state, action) => {
        state.sales = state.sales.filter(s => s.id !== action.payload);
      });
  }
});

export const { convertSalesQuotation, viewSalesQuotation, editSalesQuotation } = executivesalesQuotationSlice.actions;
export default executivesalesQuotationSlice.reducer;
