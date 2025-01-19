import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import creditsReducer from './slices/creditsSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['credits'] // Only persist credits state
};

const persistedReducer = persistReducer(persistConfig, creditsReducer);

export const store = configureStore({
  reducer: {
    credits: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;