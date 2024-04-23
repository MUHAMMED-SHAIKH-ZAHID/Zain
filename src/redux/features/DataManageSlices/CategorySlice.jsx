import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from  "../../../api/axios";
import { CategoryAPI } from '../../../api/url';



// Async thunk for fetching all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async () => {
    const response = await axios.get(`${CategoryAPI}`);
    return response.data;
  }
);

// Async thunk for creating a new category
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData) => {
    const response = await axios.post(`${CategoryAPI}`, categoryData);
    return response.data;
  }
);

// Async thunk for updating a category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, ...categoryData }) => {
    const response = await axios.put(`${CategoryAPI}/${id}`, categoryData);
    return response.data;
  }
);

// Async thunk for deleting a category
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id) => {
    await axios.delete(`${CategoryAPI}/${id}`);
    return id;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
      });
  }
});

export default categorySlice.reducer;
