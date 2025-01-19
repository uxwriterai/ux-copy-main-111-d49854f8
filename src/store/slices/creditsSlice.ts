import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreditsState {
  credits: number | null;
  userId: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  isAnonymous: boolean;
}

const initialState: CreditsState = {
  credits: null,
  userId: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  isAnonymous: true
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    setCredits: (state, action: PayloadAction<number | null>) => {
      state.credits = action.payload;
      state.lastFetched = Date.now();
    },
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
      state.isAnonymous = !action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetState: (state) => {
      return { ...initialState, lastFetched: Date.now() };
    }
  },
});

export const { setCredits, setUserId, setLoading, setError, resetState } = creditsSlice.actions;

// Selectors
export const selectCredits = (state: { credits: CreditsState }) => state.credits.credits;
export const selectUserId = (state: { credits: CreditsState }) => state.credits.userId;
export const selectIsLoading = (state: { credits: CreditsState }) => state.credits.isLoading;
export const selectError = (state: { credits: CreditsState }) => state.credits.error;
export const selectShouldFetchCredits = (state: { credits: CreditsState }) => {
  const { lastFetched, credits } = state.credits;
  if (!lastFetched || !credits) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

export default creditsSlice.reducer;