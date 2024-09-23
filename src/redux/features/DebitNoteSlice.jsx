import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './../../api/axios';
import { DebitNoteAPI } from './../../api/url';

// Async thunk for fetching all debit notes
export const fetchDebitNotes = createAsyncThunk(
  'debitNotes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${DebitNoteAPI}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for creating a new debit note
export const createDebitNote = createAsyncThunk(
  'debitNotes/create',
  async (debitNoteData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${DebitNoteAPI}`, debitNoteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating a debit note
export const updateDebitNote = createAsyncThunk(
  'debitNotes/update',
  async ({ id, ...debitNoteData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${DebitNoteAPI}/${id}`, debitNoteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a debit note
export const deleteDebitNote = createAsyncThunk(
  'debitNotes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${DebitNoteAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const debitNoteSlice = createSlice({
  name: 'debitNotes',
  initialState: {
    debitNotes: [],
    suppliers:[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDebitNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDebitNotes.fulfilled, (state, action) => {
        state.debitNotes = action.payload.debitNotes;
        state.suppliers = action.payload.suppliers
        state.loading = false;
      })
      .addCase(fetchDebitNotes.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createDebitNote.fulfilled, (state, action) => {
        state.debitNotes.unshift(action.payload.debitNotes);
      })
      .addCase(updateDebitNote.fulfilled, (state, action) => {
        const index = state.debitNotes.findIndex(d => d.id == action.payload.debitNotes.id);
        if (index !== -1) {
          state.debitNotes[index] = action.payload.debitNotes;
        }
      })
      .addCase(deleteDebitNote.fulfilled, (state, action) => {
        state.debitNotes = state.debitNotes.filter(d => d.id !== action.payload);
      });
  }
});

export default debitNoteSlice.reducer;
