// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import objectReducer from './component/features/sodetails';
import vessalSetailsReducer from './component/features/vessalDetails'
 const store = configureStore({
  reducer: {
    object: objectReducer,
    editVessal:vessalSetailsReducer
  },
});
export default store