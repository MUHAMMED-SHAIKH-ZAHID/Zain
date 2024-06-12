import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { PurchaseQuotationAPI, PurchaseQuotationsAPI } from '../../api/url';

// Fetch all purchases
export const fetchAllPurchasequotations = createAsyncThunk(
  'purchases/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(PurchaseQuotationsAPI);
      console.log("purchase location ghjklkjhgfghjk",response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch single purchase by ID
export const fetchPurchasequotationById = createAsyncThunk(
  'purchases/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${PurchaseQuotationAPI}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a new purchase
export const  createPurchasequotation = createAsyncThunk(
  'purchaseQuotation/create',
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await axios.post(PurchaseQuotationsAPI, purchaseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Unexpected error occurred');
    }
  }
);


// Update a purchase
export const updatePurchasequotation = createAsyncThunk(
  'purchaseQuote/update',
  async ({ id, purchaseData }, thunkAPI) => {
    try {
      console.log("checking id when updating purchsade shaikh",id)
      const response = await axios.put(`${PurchaseQuotationAPI}/${id}`, purchaseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a purchase
export const deletePurchasequotation = createAsyncThunk(
  'purchases/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${PurchaseQuotationAPI}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Initial state for the purchases slice
const initialState = {
  purchase: [],
  loading: false,
  error: null,
  currentPurchase: null,
  suppliers:[],
  products:[],
  editpurchase:null,
  viewpurchase:null,
  convertpurchase:null,
};

// Slice definition
const purchaseQuotationSlice = createSlice({
  name: 'purchaseQuotation',
  initialState,
  reducers: {
    PurchaseQuotationEdit:(state,action) => {
     state.editpurchase = action.payload
    },
    PurchaseQuotationView:(state,action) => {
     state.viewpurchase = action.payload
    },
    convertPurchase:(state,action) => {
     state.convertpurchase = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPurchasequotations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPurchasequotations.fulfilled, (state, action) => {
        console.log(action.payload,"the purchases and the suppliers in purrchaseQuotation")
        state.purchase = action.payload.purchaseQuotations;
        state.suppliers = action.payload.suppliers;
        state.products = action.payload.products;
        state.loading = false;
      })
      .addCase(fetchAllPurchasequotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPurchasequotationById.fulfilled, (state, action) => {
        state.currentPurchase = action.payload;
      })
      .addCase(createPurchasequotation.fulfilled, (state, action) => {
        console.log(action.payload,"checking the purchase create")
        state.purchase.unshift(action.payload.purchaseQuotation);
      })
      .addCase(createPurchasequotation.rejected, (state, action) => {
        // Ensure you are setting some form of error state here
        state.error = action.error.message || 'Failed to create purchase';
      })
      .addCase(updatePurchasequotation.fulfilled, (state, action) => {
        const index = state.purchase.findIndex(p => p.id === action.payload.purchaseQuotation.id);
        if (index !== -1) {
          state.purchase[index] = action.payload.purchaseQuotation;
        }
      })
      .addCase(deletePurchasequotation.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter(p => p.id !== action.payload);
      });
  }
});

export const { convertPurchase, PurchaseQuotationView, PurchaseQuotationEdit } = purchaseQuotationSlice.actions;
export default purchaseQuotationSlice.reducer;
