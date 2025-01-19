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

// Async thunk for fetching credits based on authentication status
export const initializeCredits = createAsyncThunk(
  'credits/initializeCredits',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const lastFetched = state.credits.lastFetched;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // If credits were fetched recently, use cached value
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      console.log('[creditsSlice] Using cached credits, last fetched:', new Date(lastFetched).toISOString());
      return state.credits.credits;
    }

    try {
      console.log('[creditsSlice] Initializing credits');
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        console.log('[creditsSlice] Fetching user-based credits for:', userId);
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        console.log('[creditsSlice] User credits fetched:', data?.credits_remaining);
        return data?.credits_remaining ?? 6;
      } else {
        console.log('[creditsSlice] Fetching IP-based credits');
        const ipAddress = await getIpAddress();
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('ip_address', ipAddress)
          .is('user_id', null)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        console.log('[creditsSlice] IP-based credits fetched:', data?.credits_remaining);
        return data?.credits_remaining ?? 2;
      }
    } catch (error) {
      console.error('[creditsSlice] Error initializing credits:', error);
      return rejectWithValue('Failed to initialize credits');
    }
  }
);

// Async thunk for fetching credits
export const fetchUserCredits = createAsyncThunk(
  'credits/fetchUserCredits',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      console.log('Fetching credits for user:', userId);
      
      if (userId) {
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        
        console.log('Fetched user credits:', data);
        return data?.credits_remaining ?? 6; // Default credits for new users
      }
      
      return 2; // Default credits for anonymous users
    } catch (error) {
      console.error('Error fetching credits:', error);
      return rejectWithValue('Failed to fetch credits');
    }
  }
);

// Async thunk for updating credits
export const updateUserCredits = createAsyncThunk(
  'credits/updateUserCredits',
  async ({ userId, credits }: { userId: string | undefined; credits: number }, { rejectWithValue }) => {
    try {
      console.log('Updating credits:', { userId, credits });
      
      if (userId) {
        const { error } = await supabase
          .from('user_credits')
          .upsert({ user_id: userId, credits_remaining: credits });

        if (error) throw error;
      }
      
      return credits;
    } catch (error) {
      console.error('Error updating credits:', error);
      return rejectWithValue('Failed to update credits');
    }
  }
);

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    resetCredits: (state) => {
      state.credits = 0;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCredits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.credits = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(initializeCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserCredits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.credits = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchUserCredits.rejected, (state, action) => {
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

// Selectors
export const selectCredits = (state: RootState) => state.credits.credits;
export const selectCreditsLoading = (state: RootState) => state.credits.isLoading;
export const selectCreditsError = (state: RootState) => state.credits.error;
export const selectLastFetched = (state: RootState) => state.credits.lastFetched;

export default creditsSlice.reducer;