import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../api/axios";  // Assuming axios is configured similarly to your auth slice
import { ExecutiveCustomerAPI } from '../../../api/url';


// Thunks
export const fetchAllCustomers = createAsyncThunk(
  'customers/fetchAlle',
  async () => {
    const response = await axios.get(`${ExecutiveCustomerAPI}`);
    return response.data;
  }
);

export const fetchCustomer = createAsyncThunk(
  'customers/fetchCustomere',
  async (id) => {
    const response = await axios.get(`${ExecutiveCustomerAPI}/${id}`);
    return response.data;
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createe',
  async (customerData, thunkAPI) => {
    try {
      const response = await axios.post(ExecutiveCustomerAPI, customerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomere',
  async ({ id, customerData }) => {
    const response = await axios.put(`${ExecutiveCustomerAPI}/${id}`, customerData);
    return response.data;
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomere',
  async (id) => {
    await axios.delete(`${ExecutiveCustomerAPI}/${id}`);
    return id;
  }
);

export const fetchCustomerSalesDetails = createAsyncThunk(
  'customers/fetchSalesDetailse',
  async (customerId) => {
    const response = await axios.get(`${ExecutiveCustomerAPI}/${customerId}/sales`);
    return response.data;
  }
);

// Slice
const customerExecutiveSlice = createSlice({
  name: 'customerexecutive',
  initialState: {
    customers: [],
    currentCustomer: null,
    currentSale:null,
    salesDetails: null,
    loading: false,
    error: null,
    storedata:'',
    routes: [],
    salesExecutives : [],
    channels:[],
  },
  reducers: {
    storeData:(state,action) => {
    state.storedata = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.channels = action.payload.channels
        state.routes = action.payload.routes;
        // state.salesExecutives = action.payload.salesExecutives;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCustomer.pending, (state, action) => {
    state.loading = true
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.currentCustomer = action.payload.customer;
        state.currentSale = action.payload.sale;
        state.loading = false
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload.customer);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.customer.id);
        if (index !== -1) {
          state.customers[index] = action.payload.customer;
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(c => c.id !== action.payload);
      })
      .addCase(fetchCustomerSalesDetails.fulfilled, (state, action) => {
        state.salesDetails = action.payload;
      });
  }
});

export default customerExecutiveSlice.reducer;
