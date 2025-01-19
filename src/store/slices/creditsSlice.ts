import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';
import { getIpAddress } from '@/services/creditsService';
import type { RootState } from '../store';

interface CreditsState {
  credits: number;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  userId: string | null;
  fetchInProgress: boolean;
}

const initialState: CreditsState = {
  credits: 0,
  isLoading: false,
  error: null,
  lastFetched: null,
  userId: null,
  fetchInProgress: false,
};

export const initializeCredits = createAsyncThunk(
  'credits/initializeCredits',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const lastFetched = state.credits.lastFetched;
    const userId = state.auth.userId;
    const fetchInProgress = state.credits.fetchInProgress;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Skip if fetch is already in progress
    if (fetchInProgress) {
      console.log('[creditsSlice] Fetch already in progress, skipping');
      return rejectWithValue('Fetch already in progress');
    }

    // Use cached credits if available and not expired
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      console.log('[creditsSlice] Using cached credits from:', new Date(lastFetched).toISOString());
      return { credits: state.credits.credits, userId };
    }

    try {
      // If user is authenticated, ONLY fetch user-based credits
      if (userId) {
        console.log('[creditsSlice] User is authenticated, fetching user-based credits');
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        console.log('[creditsSlice] User credits fetched:', data?.credits_remaining);
        return { credits: data?.credits_remaining ?? 6, userId };
      }

      // Only fetch IP-based credits for anonymous users
      console.log('[creditsSlice] Anonymous user, fetching IP-based credits');
      const ipAddress = await getIpAddress();
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('ip_address', ipAddress)
        .is('user_id', null)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      console.log('[creditsSlice] IP-based credits fetched:', data?.credits_remaining);
      return { credits: data?.credits_remaining ?? 2, userId: null };
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
    const fetchInProgress = state.credits.fetchInProgress;

    // Skip if fetch is already in progress
    if (fetchInProgress) {
      console.log('[creditsSlice] Update already in progress, skipping');
      return rejectWithValue('Update already in progress');
    }

    if (!userId) {
      console.log('[creditsSlice] No userId provided, skipping update');
      return { credits, userId: null };
    }

    try {
      console.log('[creditsSlice] Updating user credits:', { userId, credits });
      
      // First check if record exists
      const { data: existingRecord } = await supabase
        .from('user_credits')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('user_credits')
          .update({ credits_remaining: credits })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_credits')
          .insert([{
            user_id: userId,
            credits_remaining: credits
          }]);

        if (error) throw error;
      }

      return { credits, userId };
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
      state.userId = null;
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
        // Only update if:
        // 1. No existing userId (new state) OR
        // 2. Same userId (updating existing user) OR
        // 3. No userId in payload (anonymous user)
        if (!state.userId || state.userId === action.payload.userId || !action.payload.userId) {
          state.isLoading = false;
          state.credits = action.payload.credits;
          state.userId = action.payload.userId;
          state.lastFetched = Date.now();
        } else {
          console.log('[creditsSlice] Skipping update - different userId');
        }
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
        // Only update if same userId or no previous userId
        if (!state.userId || state.userId === action.payload.userId) {
          state.credits = action.payload.credits;
          state.userId = action.payload.userId;
          state.lastFetched = Date.now();
        } else {
          console.log('[creditsSlice] Skipping update - different userId');
        }
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
export const selectFetchInProgress = (state: RootState) => state.credits.fetchInProgress;

export default creditsSlice.reducer;