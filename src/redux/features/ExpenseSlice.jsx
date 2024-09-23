import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import {  ExpensesAPI } from '../../api/url';

export const fetchAllExpenses = createAsyncThunk(
  'expenses/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(ExpensesAPI);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchExpenseById = createAsyncThunk(
  'expenses/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${ExpensesAPI}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/create',
  async (expenseData, thunkAPI) => {
    try {
      const response = await axios.post(ExpensesAPI, expenseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ id, expenseData }, thunkAPI) => {
    try {
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${ExpensesAPI}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);



const initialState = {
  expenses: [],
  loading: false,
  error: null,
  locations:[],
  currentExpense:[],
  currentPurchase:[],
  ExpenseTypes:[],
  customers:[],
  suppliers:[],
  accounts:[],
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses;
        state.ExpenseTypes = action.payload.expenseType
        state.customers = action.payload.customer
        state.suppliers = action.payload.supplier
        state.accounts = action.payload.accounts
        
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExpense = action.payload.expense;
        state.currentPurchase = action.payload.purchases;
      
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload.expenses);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(s => s.id === action.payload.updatedExpense.id);
        if (index !== -1) {
          state.expenses[index] = action.payload.updatedExpense;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(s => s.id !== action.payload);
      })
      .addCase(fetchAllExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default expenseSlice.reducer;
