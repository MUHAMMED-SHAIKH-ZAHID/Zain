// src/features/heading/headingSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const headingSlice = createSlice({
  name: 'heading',
  initialState: {
    value: '',
  },
  reducers: {
    setHeading: (state, action) => {
      state.value = action.payload;
    },
    clearHeading: (state) => {
      state.value = '';
    },
  },
});

export const { setHeading, clearHeading } = headingSlice.actions;

export default headingSlice.reducer;
