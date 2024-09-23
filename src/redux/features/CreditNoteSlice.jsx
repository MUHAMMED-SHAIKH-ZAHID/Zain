import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './../../api/axios';
import { CreditNoteAPI } from './../../api/url';

// Async thunk for fetching all credit notes
export const fetchCreditNotes = createAsyncThunk(
  'creditNotes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${CreditNoteAPI}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for creating a new credit note
export const createCreditNote = createAsyncThunk(
  'creditNotes/create',
  async (creditNoteData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${CreditNoteAPI}`, creditNoteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating a credit note
export const updateCreditNote = createAsyncThunk(
  'creditNotes/update',
  async ({ id, ...creditNoteData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${CreditNoteAPI}/${id}`, creditNoteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a credit note
export const deleteCreditNote = createAsyncThunk(
  'creditNotes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${CreditNoteAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const creditNoteSlice = createSlice({
  name: 'creditNotes',
  initialState: {
    creditNotes: [],
    loading: false,
    products:[],
    error: null,
    customers:[]
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreditNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCreditNotes.fulfilled, (state, action) => {
        state.creditNotes = action.payload.creditNotes;
        state.customers = action.payload.customers;
        state.products = action.payload.products;
        state.loading = false;
      })
      .addCase(fetchCreditNotes.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createCreditNote.fulfilled, (state, action) => {
        state.creditNotes.unshift(action.payload.creditNotes);
      })
      .addCase(updateCreditNote.fulfilled, (state, action) => {
        const index = state.creditNotes.findIndex(c => c.id === action.payload.creditNotes.id);
        if (index !== -1) {
          state.creditNotes[index] = action.payload.creditNotes;
        }
      })
      .addCase(deleteCreditNote.fulfilled, (state, action) => {
        state.creditNotes = state.creditNotes.filter(c => c.id !== action.payload);
      });
  }
});

export default creditNoteSlice.reducer;
