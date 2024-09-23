import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { PaymentApproveApi, PaymentsAPI } from '../../api/url';

// Async Thunks
export const fetchAllPayments = createAsyncThunk(
  'payments/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(PaymentsAPI);
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
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/createadmin',
  async (paymentData, thunkAPI) => {
    try {
      const response = await axios.post(PaymentsAPI, paymentData);
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
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const PaymentApprove = createAsyncThunk(
  'payments/Update',
  async ({ id }, thunkAPI) => {
    try {
      const response = await axios.get(`${PaymentApproveApi}/${id}`);
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
  accounts:null,
  customers:null,
  vendors:null,
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
        state.accounts = action.payload.accounts;
        state.customers = action.payload.customers;
        state.vendors = action.payload.vendors;
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
        state.payments.unshift(action.payload.payment);
      })
     
      .addCase(PaymentApprove.fulfilled, (state, action) => {
        const index = state.payments.findIndex(payment => payment.id === action.payload.payment.id);
        if (index !== -1) {
          state.payments[index] = action.payload.payment;
        }
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
