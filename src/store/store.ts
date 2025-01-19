import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import creditsReducer, { initializeCredits } from './slices/creditsSlice';
import authReducer from './slices/authSlice';

// Add rehydration state tracking
let rehydrationComplete = false;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['credits', 'auth']
};

const rootReducer = combineReducers({
  credits: creditsReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middleware to prevent IP-based fetches when user is authenticated
const creditsFetchMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.type === 'credits/initializeCredits/pending') {
    const state = store.getState();
    const userId = state.auth.userId;

    // Block IP-based fetches if userId exists or rehydration is incomplete
    if (!rehydrationComplete) {
      console.log("[store] Blocking fetch - rehydration incomplete");
      return;
    }

    if (userId && action.meta?.arg?.type === 'ip') {
      console.log("[store] Blocking IP-based fetch - user is authenticated");
      return;
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(creditsFetchMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store, {}, () => {
  rehydrationComplete = true;
  const state = store.getState();
  const userId = state.auth.userId;

  if (userId) {
    console.log("[store] User ID found after rehydration:", userId);
    console.log("[store] Fetching user-based credits...");
    store.dispatch(initializeCredits({ type: 'user', userId }));
  } else {
    console.log("[store] No user ID found after rehydration");
    console.log("[store] Fetching IP-based credits...");
    store.dispatch(initializeCredits({ type: 'ip' }));
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;