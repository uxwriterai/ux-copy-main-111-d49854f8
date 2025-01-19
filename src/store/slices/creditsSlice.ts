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

export const updateUserCredits = createAsyncThunk(
  'credits/updateUserCredits',
  async ({ userId, credits }: { userId: string | null; credits: number }, { rejectWithValue }) => {
    try {
      if (userId) {
        const { error } = await supabase
          .from('user_credits')
          .upsert({
            user_id: userId,
            credits_remaining: credits
          });

        if (error) throw error;
        return credits;
      }

      const ipAddress = await getIpAddress();
      const { error } = await supabase
        .from('user_credits')
        .upsert({
          ip_address: ipAddress,
          credits_remaining: credits
        });

      if (error) throw error;
      return credits;
    } catch (error) {
      console.error('[creditsSlice] Error updating credits:', error);
      return rejectWithValue('Failed to update credits');
    }
  }
);

export const initializeCredits = createAsyncThunk(
  'credits/initializeCredits',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const lastFetched = state.credits.lastFetched;
    const userId = state.auth.userId;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    if (!state.credits.rehydrationComplete) {
      console.log('[creditsSlice] Skipping fetch - rehydration not complete');
      return rejectWithValue('Rehydration not complete');
    }

    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      console.log('[creditsSlice] Using cached credits from:', new Date(lastFetched).toISOString());
      return state.credits.credits;
    }

    try {
      if (userId) {
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        return data?.credits_remaining ?? 6;
      }

      const ipAddress = await getIpAddress();
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('ip_address', ipAddress)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.credits_remaining ?? 2;
    } catch (error) {
      console.error('[creditsSlice] Error initializing credits:', error);
      return rejectWithValue('Failed to initialize credits');
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      return state.credits.rehydrationComplete;
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
      })
      .addCase(updateUserCredits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserCredits.fulfilled, (state, action) => {
        state.credits = action.payload;
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(updateUserCredits.rejected, (state, action) => {
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
