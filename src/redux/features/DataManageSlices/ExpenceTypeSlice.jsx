import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../api/axios";
import { ExpenseTypeAPI } from '../../../api/url';

// Fetch all expense types
export const fetchExpenseTypes = createAsyncThunk(
  'expenseTypes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ExpenseTypeAPI}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new expense type
export const createExpenseType = createAsyncThunk(
  'expenseTypes/create',
  async (expenseTypeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ExpenseTypeAPI}`, expenseTypeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update an existing expense type
export const updateExpenseType = createAsyncThunk(
  'expenseTypes/update',
  async ({ id, ...expenseTypeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${ExpenseTypeAPI}/${id}`, expenseTypeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete an expense type
export const deleteExpenseType = createAsyncThunk(
  'expenseTypes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${ExpenseTypeAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const expenseTypeSlice = createSlice({
  name: 'expenseTypes',
  initialState: {
    expenseTypes: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenseTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseTypes.fulfilled, (state, action) => {
        state.expenseTypes = action.payload.expenseTypes;
        state.loading = false;
      })
      .addCase(fetchExpenseTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createExpenseType.fulfilled, (state, action) => {
        state.expenseTypes.unshift(action.payload.expenseType);
      })
      .addCase(updateExpenseType.fulfilled, (state, action) => {
        const index = state.expenseTypes.findIndex(e => e.id === action.payload.updatedexpenseType.id);
        if (index !== -1) {
          state.expenseTypes[index] = action.payload.updatedexpenseType;
        }
      })
      .addCase(deleteExpenseType.fulfilled, (state, action) => {
        state.expenseTypes = state.expenseTypes.filter(e => e.id !== action.payload);
      });
  }
});

export default expenseTypeSlice.reducer;
