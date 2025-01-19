import { configureStore } from '@reduxjs/toolkit';
import creditsReducer from './slices/creditsSlice';

export const store = configureStore({
  reducer: {
    credits: creditsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;