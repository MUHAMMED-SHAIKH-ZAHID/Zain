import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { PurchasesAPI } from '../../api/url';

// Fetch all purchases
export const fetchAllPurchases = createAsyncThunk(
  'purchases/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(PurchasesAPI);
      return response.data.purchases;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch single purchase by ID
export const fetchPurchaseById = createAsyncThunk(
  'purchases/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${PurchasesAPI}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a new purchase
export const createPurchase = createAsyncThunk(
  'purchases/create',
  async (purchaseData, thunkAPI) => {
    try {
      const response = await axios.post(PurchasesAPI, purchaseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a purchase
export const updatePurchase = createAsyncThunk(
  'purchases/update',
  async ({ id, purchaseData }, thunkAPI) => {
    try {
      const response = await axios.put(`${PurchasesAPI}/${id}`, purchaseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a purchase
export const deletePurchase = createAsyncThunk(
  'purchases/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${PurchasesAPI}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Initial state for the purchases slice
const initialState = {
  purchases: [],
  loading: false,
  error: null,
  currentPurchase: null,
};

// Slice definition
const purchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPurchases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.purchases = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.currentPurchase = action.payload;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.purchases.push(action.payload);
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        const index = state.purchases.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter(p => p.id !== action.payload);
      });
  }
});

export default purchaseSlice.reducer;
