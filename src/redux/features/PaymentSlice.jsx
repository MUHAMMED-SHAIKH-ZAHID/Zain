import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { PaymentsAPI } from '../../api/url';

// Async Thunks
export const fetchAllPayments = createAsyncThunk(
  'payments/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(PaymentsAPI);
      console.log("Fetched all payments:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${PaymentsAPI}/${id}`);
      console.log("Fetched payment by ID:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/create',
  async (paymentData, thunkAPI) => {
    try {
      const response = await axios.post(PaymentsAPI, paymentData);
      console.log("Created payment:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const updatePayment = createAsyncThunk(
  'payments/update',
  async ({ id, paymentData }, thunkAPI) => {
    try {
      const response = await axios.put(`${PaymentsAPI}/${id}`, paymentData);
      console.log("Updated payment:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deletePayment = createAsyncThunk(
  'payments/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${PaymentsAPI}/${id}`);
      console.log("Deleted payment:", id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Initial State
const initialState = {
  payments: [],
  loading: false,
  error: null,
  currentPayment: null,
  account:null,
  purchases:null
};

// Payment Slice
const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.purchases = action.payload.purchases;
        state.account = action.payload.accounts
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload);
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex(payment => payment.id === action.payload.id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter(payment => payment.id !== action.payload);
      });
  }
});

export default paymentSlice.reducer;
