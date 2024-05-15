import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { SalesAPI } from '../../api/url';

// Fetch all sales
export const fetchAllSales = createAsyncThunk(
  'sales/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(SalesAPI);
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
      const response = await axios.get(`${SalesAPI}/${id}`);
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
      const response = await axios.post(SalesAPI, saleData);
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
      console.log(saleData,"data to backend")
      const response = await axios.put(`${SalesAPI}/${id}`, saleData);
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
      await axios.delete(`${SalesAPI}/${id}`);
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
      const response = await axios.post(`${SalesAPI}/${id}/payment`, purchaseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Initial state for the sales slice
const initialState = {
  sales: [],
  loading: false,
  error: null,
  currentSale: null,
  customer:[],
  products:[],
  editsales:null,
  editsalescolumn:null,
  editsalesindex:null,
  viewsalesdata:null,
  paymentModes:null,
};

// Slice definition
const salesSlice = createSlice({
  name: 'sales',
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
        console.log(action.payload,"viewpurchase Data")
       state.viewsalesdata = null
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSales.fulfilled, (state, action) => {
        console.log(action.payload,"shaikh zahid is dsebuhiyn yhe sale slicet fetch")
        state.sales = action.payload.sales;
        state.customer = action.payload.customers;
        state.products = action.payload.products;
        state.paymentModes = action.payload.paymentModes
        state.loading = false;
      })
      .addCase(fetchAllSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        console.log(action.payload,"the sinle sales")
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

export const {viewSalesData ,editSalesId , editSaleColumn} = salesSlice.actions
export default salesSlice.reducer;
