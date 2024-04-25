import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/axios'; // Adjust the path to your axios setup
import { ProductAPI } from '../../../api/url';



// Async thunks for fetching related data
export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await axios.get(`${ProductAPI}`);
  return response.data;
});

export const fetchBrands = createAsyncThunk('products/fetchBrands', async () => {
  const response = await axios.get(`${ProductAPI}`);
  return response.data;
});

// Product CRUD operations
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const response = await axios.get(`${ProductAPI}`);
  return response.data;
});

export const addProduct = createAsyncThunk('products/add', async (product) => {
  const response = await axios.post(`${ProductAPI}`, product);
  return response.data;
});

export const updateProduct = createAsyncThunk('products/update', async (product) => {
  const response = await axios.put(`${ProductAPI}/${product.id}`, product);
  return response.data;
});

export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await axios.delete(`${ProductAPI}/${id}`);
  return id;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    categories: [],
    brands: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      });
  }
});

export default productSlice.reducer;
