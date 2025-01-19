export interface UserCredits {
  credits_remaining: number;
  user_id?: string | null;
  ip_address?: string;
}

export interface CreditsContextType {
  credits: number;
  useCredit: () => Promise<boolean>;
  resetCredits: () => Promise<void>;
  isLoading: boolean;
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
  fetchCredits: () => Promise<void>;
}