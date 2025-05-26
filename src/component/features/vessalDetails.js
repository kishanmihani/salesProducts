// src/features/object/editVessal.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],   // array you want to store
};

const editVessal = createSlice({
  name: 'editVessal',
  initialState,
  reducers: {
    setEditVessalArray: (state, action) => {
      state.data = action.payload;  // Store whole object
    },
    clearEditVessalArray: (state) => {
      state.data = {};  // Clear object
    },
  },
});

export const { setEditVessalArray, clearEditVessalArray } = editVessal.actions;
export default editVessal.reducer;
