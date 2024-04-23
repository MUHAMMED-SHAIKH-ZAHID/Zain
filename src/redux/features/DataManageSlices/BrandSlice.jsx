// src/redux/features/BrandsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Ensure axios is setup correctly
import { BrandsAPI } from '../../../api/url';


export const fetchBrands = createAsyncThunk('brands/fetchAll', async () => {
  const response = await axios.get(BrandsAPI);
  return response.data;
});

export const createBrand = createAsyncThunk('brands/create', async (brand) => {
  const response = await axios.post(BrandsAPI, brand);
  return response.data;
});

export const updateBrand = createAsyncThunk('brands/update', async ({ id, brand }) => {
  const response = await axios.put(`${BrandsAPI}/${id}`, brand);
  return response.data;
});

export const deleteBrand = createAsyncThunk('brands/delete', async (id) => {
  await axios.delete(`${BrandsAPI}/${id}`);
  return id;
});

const brandsSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.push(action.payload);
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        const index = state.brands.findIndex(brand => brand.id === action.payload.id);
        state.brands[index] = action.payload;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter(brand => brand.id !== action.payload);
      });
  }
});

export default brandsSlice.reducer;
