import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { SupplierAPI, SupplierDetailsAPI, SupplierPurchaseDetailsAPI, SuppliersAPI } from '../../api/url';

export const fetchAllSuppliers = createAsyncThunk(
  'suppliers/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(SupplierAPI);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchSupplierById = createAsyncThunk(
  'suppliers/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${SupplierAPI}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/create',
  async (supplierData, thunkAPI) => {
    try {
      const response = await axios.post(SuppliersAPI, supplierData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/update',
  async ({ id, supplierData }, thunkAPI) => {
    try {
      const response = await axios.put(`${SuppliersAPI}/${id}`, supplierData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${SuppliersAPI}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchSupplierDetails = createAsyncThunk(
  'suppliers/details',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${SupplierDetailsAPI}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchPurchaseDetails = createAsyncThunk(
  'suppliers/purchaseDetails',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${SupplierPurchaseDetailsAPI}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createSupplierReport = createAsyncThunk(
  'suppliersreport/create',
  async ({supplierData, Id },thunkAPI) => {
    try {
      const response = await axios.post(`${SuppliersAPI}/${Id}/return`,supplierData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  suppliers: [],
  loading: false,
  error: null,
  locations:[],
  currentsupplier:[],
  currentpurchase:[],
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload.suppliers;
        // state.locations = action.payload.locations;
      })
      .addCase(fetchSupplierById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentsupplier = action.payload.supplier;
        state.currentpurchase = action.payload.purchases;
      })
      .addCase(createSupplierReport.fulfilled, (state, action) => {
        state.loading = false;
  
      })
      .addCase(fetchAllSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(fetchSupplierById.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const index = state.suppliers.findIndex(s => s.id === action.payload.id);
      //   if (index !== -1) {
      //     state.suppliers[index] = action.payload;
      //   }
      // })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.suppliers.unshift(action.payload.supplier);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.supplier.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload.supplier;
        }
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
      });
  }
});

export default supplierSlice.reducer;
