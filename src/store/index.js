import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import noteReducer from './features/noteSlice';
import logger from 'redux-logger'

export const store = configureStore({
  reducer: {
    user: userReducer,
    note: noteReducer
  },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})