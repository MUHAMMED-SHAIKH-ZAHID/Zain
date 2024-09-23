import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { PurchasesAPI } from '../../api/url';

// Fetch all purchases
export const fetchAllPurchases = createAsyncThunk(
  'purchases/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(PurchasesAPI);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch single purchase by ID
export const fetchPurchaseById = createAsyncThunk(
  'purchases/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${PurchasesAPI}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a new purchase
export const createPurchase = createAsyncThunk(
  'purchases/create',
  async (purchaseData, thunkAPI) => {
    try {
      const response = await axios.post(PurchasesAPI, purchaseData);
      return response.data;
    } catch (error) {
      console.error("Error response", error.response); // Log the error response
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a purchase
export const updatePurchase = createAsyncThunk(
  'purchases/update',
  async ({ id, purchaseData }, thunkAPI) => {
    try {
      const response = await axios.put(`${PurchasesAPI}/${id}`, purchaseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a purchase
export const deletePurchase = createAsyncThunk(
  'purchases/delete ',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${PurchasesAPI}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// make purchase payment
export const purchasePayment = createAsyncThunk(
  'purchases/paymentmethod',
  async ({ purchaseData,id }, thunkAPI) => {
    try {
      const response = await axios.post(`${PurchasesAPI}/${id}/payment`, purchaseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// Initial state for the purchases slice
const initialState = {
  purchases: [],
  loading: false,
  error: null,
  currentPurchase: null,
  suppliers:[],
  products:[],
  editpurchase:null,
  editpurchasecolumn:null,
  editpurchaseindex:null,
  viewpurchasedata:null,
  printpurchasedata:null,
  paymentModes:null,
  purchaseOrders:null,
};

// Slice definition
const purchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    editPurchaseId:(state,action) => {
     state.editpurchase = action.payload
    },
    viewPurchaseData:(state,action) => {
     state.viewpurchasedata = action.payload
    },
    printPurchaseData:(state,action) => {
     state.printpurchasedata = action.payload
    },
    editPurchaseColumn:(state,action) => {
     state.editpurchasecolumn = action.payload.data
     state.editpurchaseindex = action.payload.index
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPurchases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.purchases = action.payload.purchases;
        state.suppliers = action.payload.suppliers;
        state.products = action.payload.products;
        state.paymentModes = action.payload.paymentModes;
        state.purchaseOrders = action.payload.purchaseOrders
        state.loading = false;
      })
      .addCase(fetchAllPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.currentPurchase = action.payload;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.purchases.unshift(action.payload.purchase);
      })
      .addCase(purchasePayment.fulfilled, (state, action) => {
        state.purchases.unshift(action.payload);
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        const index = state.purchases?.findIndex(p => p.id === action.payload.purchase.id);
        if (index !== -1) {
          state.purchases[index] = action.payload.purchase;
        }
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter(p => p.id !== action.payload);
      });
      
  }
});

export const {viewPurchaseData, editPurchaseId ,editPurchaseColumn , printPurchaseData } = purchaseSlice.actions;
export default purchaseSlice.reducer;
