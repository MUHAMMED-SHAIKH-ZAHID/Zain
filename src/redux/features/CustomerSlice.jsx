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
    console.log(customerData,"values to crewate cuistop,er")
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
        console.log(action.payload,"payload ghjklllllllllllllllllllllllll")
        state.customers = action.payload.customers;
        state.channels = action.payload.channels
        // state.routes = action.payload.routes;
        // state.salesExecutives = action.payload.salesExecutives;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        console.log("tis the fetch custome4r singlve suc customer in the slice",action.payload)
        state.currentCustomer = action.payload.customer;
        state.currentSale = action.payload.sales
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload.customer);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        console.log(action.payload,"tis the fullfilled state ")
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

export default customerSlice.reducer;
