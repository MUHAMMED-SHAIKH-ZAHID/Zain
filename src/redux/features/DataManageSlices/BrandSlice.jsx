import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../api/axios";
import { BrandAPI } from '../../../api/url';



export const fetchBrands = createAsyncThunk(
  'brands/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BrandAPI}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createBrand = createAsyncThunk(
  'brands/create',
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BrandAPI}`, brandData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/update',
  async ({ id, ...brandData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BrandAPI}/${id}`, brandData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BrandAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    loading: false,
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
        console.log(action.payload,"checking in the slice to pupadte",state.brands)
        const index = state.brands.findIndex(b => b.id === action.payload.id);
        console.log(action.payload,"checking in the slice to pupadte",state.brands)
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter(b => b.id !== action.payload);
      });
  }
});

export default brandSlice.reducer;
