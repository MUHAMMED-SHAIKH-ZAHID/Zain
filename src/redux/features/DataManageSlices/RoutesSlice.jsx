// src/redux/features/RoutesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Ensure axios is installed and setup
import { RoutesAPI } from '../../../api/url';


export const fetchRoutes = createAsyncThunk('routes/fetchAll', async () => {
  const response = await axios.get(RoutesAPI);
  return response.data;
});

export const createRoute = createAsyncThunk('routes/create', async (route) => {
  const response = await axios.post(RoutesAPI, route);
  return response.data;
});

export const updateRoute = createAsyncThunk('routes/update', async ({ id, route }) => {
  const response = await axios.put(`${RoutesAPI}/${id}`, route);
  return response.data;
});

export const deleteRoute = createAsyncThunk('routes/delete', async (id) => {
  await axios.delete(`${RoutesAPI}/${id}`);
  return id;
});

const routesSlice = createSlice({
  name: 'routes',
  initialState: {
    routes: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.routes = action.payload;
      })
      .addCase(createRoute.fulfilled, (state, action) => {
        state.routes.push(action.payload);
      })
      .addCase(updateRoute.fulfilled, (state, action) => {
        const index = state.routes.findIndex(route => route.id === action.payload.id);
        state.routes[index] = action.payload;
      })
      .addCase(deleteRoute.fulfilled, (state, action) => {
        state.routes = state.routes.filter(route => route.id !== action.payload);
      });
  }
});

export default routesSlice.reducer;
