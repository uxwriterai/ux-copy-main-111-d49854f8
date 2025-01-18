export interface UserCredits {
  credits_remaining: number;
  user_id?: string | null;
  ip_address?: string;
}

export interface CreditsContextType {
  credits: number;
  setCredits: (credits: number) => void;
  useCredit: () => Promise<boolean>;
  resetCredits: () => Promise<void>;
  isLoading: boolean;
}