// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from  "../../api/axios";
import { toast } from 'react-toastify';
import { LoginAPI } from "../../api/url";
import { Navigate } from "react-router-dom";

export const loginAuth = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(LoginAPI, credentials);
      console.log("object",response.data.token);
      toast.success("Login Successful");
      return response.data;
    } catch (error) {
      toast.error("Login failed: " + error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      toast.info("Logged out successfully");
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.token = localStorage.setItem("token",action.payload.token)
        
        state.isAuthenticated = true;
     
      })
      .addCase(loginAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
