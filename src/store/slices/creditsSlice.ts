import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreditsState {
  credits: number | null;
  userId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CreditsState = {
  credits: null,
  userId: null,
  isLoading: false,
  error: null,
};

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    setCredits: (state, action: PayloadAction<number | null>) => {
      state.credits = action.payload;
    },
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredits, setUserId, setLoading, setError } = creditsSlice.actions;
export default creditsSlice.reducer;