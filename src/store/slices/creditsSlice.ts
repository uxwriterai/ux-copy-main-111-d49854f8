import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';
import { getIpAddress } from '@/services/creditsService';
import type { RootState } from '../store';

interface CreditsState {
  credits: number;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: CreditsState = {
  credits: 0,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const initializeCredits = createAsyncThunk(
  'credits/initializeCredits',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const lastFetched = state.credits.lastFetched;
    const userId = state.auth.userId;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
      
      // If we have user-based credits, don't allow IP-based credits to overwrite them
      if (state.credits.credits > 0 && !userId) {
        console.log('[creditsSlice] Preventing IP credits from overwriting existing user credits');
        return false;
      }
      return true;
    }
  }
);

export const updateUserCredits = createAsyncThunk(
  'credits/updateUserCredits',
  async ({ userId, credits }: { userId: string | undefined; credits: number }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    
    // Check if we should proceed with the update
    if (!userId && state.credits.credits > 0) {
      console.log('[creditsSlice] Skipping credit update - preserving existing user credits');
      return state.credits.credits;
    }

    try {
      console.log('[creditsSlice] Updating credits:', { userId, credits });
      
      if (userId) {
        const { error } = await supabase
          .from('user_credits')
          .upsert({ user_id: userId, credits_remaining: credits });

        if (error) throw error;
        return credits;
      } else {
        // Only update IP-based credits if no userId exists
        console.log('[creditsSlice] Updating IP-based credits');
        const ipAddress = await getIpAddress();
        const { error } = await supabase
          .from('user_credits')
          .upsert({ ip_address: ipAddress, credits_remaining: credits, user_id: null });

        if (error) throw error;
        return credits;
      }
    } catch (error) {
      console.error('[creditsSlice] Error updating credits:', error);
      return rejectWithValue('Failed to update credits');
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCredits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeCredits.fulfilled, (state, action) => {
        // Only update credits if we don't already have user-based credits
        if (state.credits === 0 || action.payload > state.credits) {
          state.credits = action.payload;
        }
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(initializeCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserCredits.fulfilled, (state, action) => {
        state.credits = action.payload;
        state.lastFetched = Date.now();
      });
  },
});

export const { resetCredits } = creditsSlice.actions;

export const selectCredits = (state: RootState) => state.credits.credits;
export const selectCreditsLoading = (state: RootState) => state.credits.isLoading;
export const selectCreditsError = (state: RootState) => state.credits.error;
export const selectLastFetched = (state: RootState) => state.credits.lastFetched;

export default creditsSlice.reducer;