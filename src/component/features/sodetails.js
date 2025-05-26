// src/features/object/sodetails.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},   // Object you want to store
};

const sodetails = createSlice({
  name: 'object',
  initialState,
  reducers: {
    setObject: (state, action) => {
      state.data = action.payload;  // Store whole object
    },
    clearObject: (state) => {
      state.data = {};  // Clear object
    },
  },
});

export const { setObject, clearObject } = sodetails.actions;
export default sodetails.reducer;
