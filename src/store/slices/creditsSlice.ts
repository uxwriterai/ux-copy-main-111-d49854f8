import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';
import { getIpAddress } from '@/services/creditsService';
import type { RootState } from '../store';

interface CreditsState {
  credits: number;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  rehydrationComplete: boolean;
}

const initialState: CreditsState = {
  credits: 0,
  isLoading: false,
  error: null,
  lastFetched: null,
  rehydrationComplete: false,
};

export const initializeCredits = createAsyncThunk(
  'credits/initializeCredits',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const lastFetched = state.credits.lastFetched;
    const userId = state.auth.userId;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Skip if rehydration is not complete
    if (!state.credits.rehydrationComplete) {
      console.log('[creditsSlice] Skipping fetch - rehydration not complete');
      return rejectWithValue('Rehydration not complete');
    }

    // Use cached credits if available and not expired
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      console.log('[creditsSlice] Using cached credits from:', new Date(lastFetched).toISOString());
      return state.credits.credits;
    }

    try {
      // If user is authenticated, fetch user-based credits
      if (userId) {
        console.log('[creditsSlice] User is authenticated, fetching user-based credits');
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        console.log('[creditsSlice] User credits fetched:', data?.credits_remaining);
        return data?.credits_remaining ?? 6;
      }

      // Only fetch IP-based credits for anonymous users
      console.log('[creditsSlice] Anonymous user, fetching IP-based credits');
      const ipAddress = await getIpAddress();
      console.log('[creditsSlice] Fetching IP-based credits for:', ipAddress);
      
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('ip_address', ipAddress)
        .is('user_id', null)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      console.log('[creditsSlice] IP-based credits fetched:', data?.credits_remaining);
      return data?.credits_remaining ?? 2;
    } catch (error) {
      console.error('[creditsSlice] Error initializing credits:', error);
      return rejectWithValue('Failed to initialize credits');
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const userId = state.auth.userId;
      
      // Skip if rehydration is not complete
      if (!state.credits.rehydrationComplete) {
        console.log('[creditsSlice] Skipping fetch - rehydration not complete');
        return false;
      }
      
      // If we have user-based credits, don't allow IP-based credits to overwrite them
      if (state.credits.credits > 0 && !userId) {
        console.log('[creditsSlice] Preventing IP credits from overwriting existing user credits');
        return false;
      }
      return true;
    }
  }
);

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    resetCredits: (state) => {
      console.log('[creditsSlice] Resetting credits state');
      state.credits = 0;
      state.lastFetched = null;
      state.error = null;
      state.isLoading = false;
    },
    setRehydrationComplete: (state) => {
      console.log('[creditsSlice] Setting rehydration complete');
      state.rehydrationComplete = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCredits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeCredits.fulfilled, (state, action) => {
        state.credits = action.payload;
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(initializeCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCredits, setRehydrationComplete } = creditsSlice.actions;

export const selectCredits = (state: RootState) => state.credits.credits;
export const selectCreditsLoading = (state: RootState) => state.credits.isLoading;
export const selectCreditsError = (state: RootState) => state.credits.error;
export const selectLastFetched = (state: RootState) => state.credits.lastFetched;
export const selectRehydrationComplete = (state: RootState) => state.credits.rehydrationComplete;

export default creditsSlice.reducer;