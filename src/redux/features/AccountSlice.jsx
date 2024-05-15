import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { AccountAPI } from '../../api/url'; // Define this constant to point to your taxes API


export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(AccountAPI);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAccountById = createAsyncThunk(
    'accounts/fetchById',
    async (accountId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${AccountAPI}/${accountId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

export const createAccount = createAsyncThunk(
  'accounts/create',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await axios.post(AccountAPI, accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAccount = createAsyncThunk(
  'accounts/update',
  async ({ id, ...accountData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${AccountAPI}/${id}`, accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'accounts/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${AccountAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const accountSlice = createSlice({
    name: 'account',
    initialState: {
      accounts: [],
      loading: false,
      currentAccount:[],
      error: null
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAccounts.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAccounts.fulfilled, (state, action) => {
          state.accounts = action.payload.accounts;
          state.loading = false;
        })
        .addCase(fetchAccounts.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(createAccount.fulfilled, (state, action) => {
          state.accounts.unshift(action.payload.accounts);
        })
        .addCase(updateAccount.fulfilled, (state, action) => {
          const index = state.accounts.findIndex(acc => acc.id === action.payload.account.id);
          if (index !== -1) {
            state.accounts[index] = action.payload.account;
          }
        })
        .addCase(deleteAccount.fulfilled, (state, action) => {
          state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
        })
        .addCase(fetchAccountById.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchAccountById.fulfilled, (state, action) => {
            state.currentAccount = action.payload.accounts;
            state.loading = false;
          })
          .addCase(fetchAccountById.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
          })
    }
  });
  
  export default accountSlice.reducer;
  