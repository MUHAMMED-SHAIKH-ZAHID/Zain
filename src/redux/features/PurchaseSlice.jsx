import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { PurchasesAPI } from '../../api/url';

// Fetch all purchases
export const fetchAllPurchases = createAsyncThunk(
  'purchases/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(PurchasesAPI);
      console.log("slice in")
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
      console.log(purchaseData,"the purchase data to send to backend")
      const response = await axios.post(PurchasesAPI, purchaseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a purchase
export const updatePurchase = createAsyncThunk(
  'purchases/update',
  async ({ id, purchaseData }, thunkAPI) => {
    try {
      console.log("checking id when updating purchsade",id)
      const response = await axios.put(`${PurchasesAPI}/${id}`, purchaseData);
      console.log("update resppontse in the purchase",response.data)
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
  paymentModes:null,
};

// Slice definition
const purchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    editPurchaseId:(state,action) => {
     state.editpurchase = action.payload
    },
    editPurchaseColumn:(state,action) => {
     state.editpurchasecolumn = action.payload.data
     state.editpurchaseindex = action.payload.index
    },
    viewPurchaseData:(state,action) => {
      console.log(action.payload,"viewpurchase Data")
     state.viewpurchasedata = action.payload
    }
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPurchases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        console.log(action.payload,"the purchases and the suppliers")
        state.purchases = action.payload.purchases;
        state.suppliers = action.payload.suppliers;
        state.products = action.payload.products;
        state.paymentModes = action.payload.paymentModes;
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
        state.purchases.push(action.payload);
      })
      .addCase(purchasePayment.fulfilled, (state, action) => {
        state.purchases.push(action.payload);
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        console.log(action.payload,"in the buildre case of update purchase 0",state.purchases)
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

export const {viewPurchaseData, editPurchaseId ,editPurchaseColumn} = purchaseSlice.actions;
export default purchaseSlice.reducer;
