import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { StockAPI } from '../../api/url'; // Define this constant to point to your stock API
import { editPurchaseColumn } from './PurchaseSlice';

export const fetchStocks = createAsyncThunk(
  'stocks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(StockAPI);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchStockById = createAsyncThunk(
  'stocks/fetchById',
  async (stockId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${StockAPI}/${stockId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createStock = createAsyncThunk(
  'stocks/create',
  async (stockData, { rejectWithValue }) => {
    try {
      const response = await axios.post(StockAPI, stockData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateStock = createAsyncThunk(
  'stocks/update',
  async ({ id, ...stockData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${StockAPI}/${id}`, stockData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteStock = createAsyncThunk(
  'stocks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${StockAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    stocks: [],
    loading: false,
    currentStock: [],
    error: null,
    bills:[],
    editstockindex:'',
    editstockcolumn:'',
    products:'',
  },
  reducers:{
    editStockColumn:(state,action) => {
      state.editstockcolumn = action.payload.data
      state.editstockindex = action.payload.index
     },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.stocks = action.payload.stocks;
        state.bills = action.payload.bills;
        state.products = action.payload.products;
        state.loading = false;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createStock.fulfilled, (state, action) => {
        state.stocks.unshift(action.payload.stock);
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.stocks.findIndex(stock => stock.id === action.payload.stock.id);
        if (index !== -1) {
          state.stocks[index] = action.payload.stock;
        }
      })
      .addCase(deleteStock.fulfilled, (state, action) => {
        state.stocks = state.stocks.filter(stock => stock.id !== action.payload);
      })
      .addCase(fetchStockById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockById.fulfilled, (state, action) => {
        state.currentStock = action.payload.stock;
        state.loading = false;
      })
      .addCase(fetchStockById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});
export const {editStockColumn} =stockSlice.actions
export default stockSlice.reducer;
