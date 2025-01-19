import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';
import { getIpAddress } from '@/services/creditsService';
import type { RootState } from '../store';

interface CreditsState {
  credits: number;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchInProgress: boolean;
}

const initialState: CreditsState = {
  credits: 0,
  isLoading: false,
  error: null,
  lastFetched: null,
  fetchInProgress: false,
};

export const initializeCredits = createAsyncThunk(
  'credits/initializeCredits',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const lastFetched = state.credits.lastFetched;
    const userId = state.auth.userId;
    const isFetching = state.credits.fetchInProgress;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Prevent concurrent fetches
    if (isFetching) {
      console.log('[creditsSlice] Fetch already in progress, skipping');
      return state.credits.credits;
    }

    // Use cached credits if available and not expired
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      console.log('[creditsSlice] Using cached credits from:', new Date(lastFetched).toISOString());
      return state.credits.credits;
    }

    try {
      // If user is authenticated, ONLY fetch user-based credits
      if (userId) {
        console.log('[creditsSlice] User is authenticated, fetching ONLY user-based credits for:', userId);
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;
        
        // If no user credits found, initialize with default
        if (!data) {
          console.log('[creditsSlice] No user credits found, initializing with default');
          const { error: updateError } = await supabase
            .from('user_credits')
            .insert([{ user_id: userId, credits_remaining: 6 }]);
            
          if (updateError) throw updateError;
          return 6;
        }
        
        console.log('[creditsSlice] User credits fetched:', data.credits_remaining);
        return data.credits_remaining;
      }

      // Only fetch IP-based credits for anonymous users
      console.log('[creditsSlice] Anonymous user, fetching IP-based credits');
      const ipAddress = await getIpAddress();
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('ip_address', ipAddress)
        .is('user_id', null)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      // If no IP credits found, initialize with default
      if (!data) {
        console.log('[creditsSlice] No IP credits found, initializing with default');
        const { error: updateError } = await supabase
          .from('user_credits')
          .insert([{ ip_address: ipAddress, credits_remaining: 2, user_id: null }]);
          
        if (updateError) throw updateError;
        return 2;
      }

      console.log('[creditsSlice] IP-based credits fetched:', data.credits_remaining);
      return data.credits_remaining;
    } catch (error) {
      console.error('[creditsSlice] Error initializing credits:', error);
      return rejectWithValue('Failed to initialize credits');
    }
  }
);

export const updateUserCredits = createAsyncThunk(
  'credits/updateUserCredits',
  async ({ userId, credits }: { userId: string | undefined; credits: number }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const isFetching = state.credits.fetchInProgress;

    if (isFetching) {
      console.log('[creditsSlice] Update already in progress, skipping');
      return state.credits.credits;
    }

    if (!userId) {
      console.log('[creditsSlice] No userId provided, skipping update');
      return credits;
    }

    try {
      console.log('[creditsSlice] Updating credits:', { userId, credits });
      const { error } = await supabase
        .from('user_credits')
        .upsert({ user_id: userId, credits_remaining: credits });

      if (error) throw error;
      return credits;
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
      state.fetchInProgress = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCredits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.fetchInProgress = true;
      })
      .addCase(initializeCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.credits = action.payload;
        state.lastFetched = Date.now();
        state.fetchInProgress = false;
      })
      .addCase(initializeCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.fetchInProgress = false;
      })
      .addCase(updateUserCredits.pending, (state) => {
        state.fetchInProgress = true;
      })
      .addCase(updateUserCredits.fulfilled, (state, action) => {
        state.credits = action.payload;
        state.lastFetched = Date.now();
        state.fetchInProgress = false;
      })
      .addCase(updateUserCredits.rejected, (state) => {
        state.fetchInProgress = false;
      });
  },
});

export const { resetCredits } = creditsSlice.actions;

export const selectCredits = (state: RootState) => state.credits.credits;
export const selectCreditsLoading = (state: RootState) => state.credits.isLoading;
export const selectCreditsError = (state: RootState) => state.credits.error;
export const selectLastFetched = (state: RootState) => state.credits.lastFetched;

export default creditsSlice.reducer;