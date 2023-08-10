import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import noteReducer from './features/noteSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    note: noteReducer
  },
})