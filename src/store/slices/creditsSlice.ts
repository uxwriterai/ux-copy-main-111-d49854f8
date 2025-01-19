import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { supabase } from '@/integrations/supabase/client';

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

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Async thunk for fetching user credits
export const fetchUserCredits = createAsyncThunk(
  'credits/fetchUserCredits',
  async (userId: string | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const lastFetched = state.credits.lastFetched;
      
      // Skip fetch if data is fresh
      if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
        console.log('Using cached credits data');
        return state.credits.credits;
      }

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

// Async thunk for updating user credits
export const updateUserCredits = createAsyncThunk(
  'credits/updateUserCredits',
  async ({ userId, credits }: { userId: string | undefined; credits: number }, { rejectWithValue }) => {
    try {
      console.log('Updating credits:', { userId, credits });
      
      if (userId) {
        const { error } = await supabase
          .from('user_credits')
          .upsert({ 
            user_id: userId, 
            credits_remaining: credits 
          });

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
      state.credits = 2; // Reset to anonymous user credits
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
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