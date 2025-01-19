import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import creditsReducer, { initializeCredits } from './slices/creditsSlice';
import authReducer from './slices/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['credits', 'auth'] // Only persist these reducers
};

const rootReducer = combineReducers({
  credits: creditsReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store, {}, () => {
  const state = store.getState();
  if (state.auth.userId) {
    console.log("[store] User ID found after rehydration. Fetching user-based credits...");
    store.dispatch(initializeCredits());
  } else {
    console.log("[store] No user ID found after rehydration. Fetching IP-based credits...");
    store.dispatch(initializeCredits());
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;