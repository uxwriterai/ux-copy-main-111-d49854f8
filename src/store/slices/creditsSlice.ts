import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreditsState {
  credits: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CreditsState = {
  credits: null,
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredits, setLoading, setError } = creditsSlice.actions;
export default creditsSlice.reducer;