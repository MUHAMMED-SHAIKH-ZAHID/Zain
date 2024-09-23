import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/axios';
import { ExecutiveSalesAPI } from '../../../api/url';

// Fetch all sales
export const fetchAllSales = createAsyncThunk(
  'sales/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(ExecutiveSalesAPI);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch single sale by ID
export const fetchSaleById = createAsyncThunk(
  'sales/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${ExecutiveSalesAPI}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a new sale
export const createSale = createAsyncThunk(
  'sales/create',
  async (saleData, thunkAPI) => {
    try {
      const response = await axios.post(ExecutiveSalesAPI, saleData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a sale
export const updateSale = createAsyncThunk(
  'sales/update',
  async ({ id, saleData }, thunkAPI) => {
    try {
      const response = await axios.put(`${ExecutiveSalesAPI}/${id}`, saleData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a sale
export const deleteSale = createAsyncThunk(
  'sales/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${ExecutiveSalesAPI}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const salesPayment = createAsyncThunk(
  'purchases/paymentmethod',
  async ({ purchaseData,id }, thunkAPI) => {
    try {
      const response = await axios.post(`${ExecutiveSalesAPI}/${id}/payment`, purchaseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  sales: [],
  loading: false,
  error: null,
  currentSale: null,
   customers:[],
  products:[],
  editsales:null,
  editsalescolumn:null,
  editsalesindex:null,
  viewsalesdata:null,
  paymentModes:null,
  channels:null,
  saleorder:[],
  stocks:[],
};

// Slice definition
const executivesalesSlice = createSlice({
  name: 'executivesales',
  initialState,
  reducers: {
    editSalesId:(state,action) => {
        state.editsales = action.payload
       },
       editSaleColumn:(state,action) => {
        state.editsalescolumn = action.payload.data
        state.editsalesindex = action.payload.index
       },
       viewSalesData:(state,action) => {
       state.viewsalesdata = null
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload.sales;
        state. customers = action.payload.customers;
        state.products = action.payload.products;
        state.paymentModes = action.payload.accounts
        state.channels = action.payload.channels
        state.saleorder = action.payload.saleorder
        state.stocks= action.payload.stocks
      })
      .addCase(fetchAllSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSaleById.pending, (state, action) => {
        state.loading= true;
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.loading= false;
        state.viewsalesdata = action.payload.sale;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.sales.push(action.payload);
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        const index = state.sales.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.sales = state.sales.filter(s => s.id !== action.payload);
      });
  }
});

export const {viewSalesData ,editSalesId , editSaleColumn} = executivesalesSlice.actions
export default executivesalesSlice.reducer;
