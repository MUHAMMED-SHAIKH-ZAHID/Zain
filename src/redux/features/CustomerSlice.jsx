import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../api/axios";  // Assuming axios is configured similarly to your auth slice
import { CustomerAPI } from '../../api/url';


// Thunks
export const fetchAllCustomers = createAsyncThunk(
  'customers/fetchAll',
  async () => {
    const response = await axios.get(`${CustomerAPI}`);
    console.log("fetchallcustomer from the customer slice",response.data)
    return response.data;
  }
);

export const fetchCustomer = createAsyncThunk(
  'customers/fetchCustomer',
  async (id) => {
    const response = await axios.get(`${CustomerAPI}/${id}`);
    return response.data;
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData) => {
    const response = await axios.post(`${CustomerAPI}`, customerData);
    return response.data;
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }) => {
    const response = await axios.put(`${CustomerAPI}/${id}`, customerData);
    return response.data;
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id) => {
    await axios.delete(`${CustomerAPI}/${id}`);
    return id;
  }
);

export const fetchCustomerSalesDetails = createAsyncThunk(
  'customers/fetchSalesDetails',
  async (customerId) => {
    const response = await axios.get(`${CustomerAPI}/${customerId}/sales`);
    return response.data;
  }
);

// Slice
const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    currentCustomer: null,
    salesDetails: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.currentCustomer = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
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

export default customerSlice.reducer;
