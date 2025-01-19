import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string | null>) => {
      console.log('[authSlice] Setting user:', action.payload);
      state.userId = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      console.log('[authSlice] Clearing user');
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const selectUserId = (state: RootState) => state.auth.userId;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;