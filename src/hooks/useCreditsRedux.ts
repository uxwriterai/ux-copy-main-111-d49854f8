import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectCredits,
  selectCreditsLoading,
  selectCreditsError,
  selectLastFetched,
  fetchUserCredits,
  updateUserCredits,
  resetCredits,
} from '@/store/slices/creditsSlice';
import { selectUserId } from '@/store/slices/authSlice';
import { toast } from 'sonner';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useCreditsRedux = () => {
  const dispatch = useAppDispatch();
  const credits = useAppSelector(selectCredits);
  const isLoading = useAppSelector(selectCreditsLoading);
  const error = useAppSelector(selectCreditsError);
  const lastFetched = useAppSelector(selectLastFetched);
  const userId = useAppSelector(selectUserId);

  useEffect(() => {
    const shouldFetch = !lastFetched || Date.now() - lastFetched > CACHE_DURATION;
    
    if (shouldFetch && !isLoading) {
      console.log('Fetching credits for user:', userId);
      dispatch(fetchUserCredits(userId));
    }
  }, [dispatch, userId, lastFetched, isLoading]);

  const useCredit = async () => {
    if (credits <= 0) {
      toast.error('No credits remaining');
      return false;
    }

    try {
      await dispatch(updateUserCredits({ userId, credits: credits - 1 })).unwrap();
      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      toast.error('Failed to use credit');
      return false;
    }
  };

  const resetUserCredits = () => {
    dispatch(resetCredits());
  };

  return {
    credits,
    isLoading,
    error,
    useCredit,
    resetCredits: resetUserCredits,
  };
};