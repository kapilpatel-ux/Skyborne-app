import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  fetchProfile,
  fetchDashboardStats,
  updateProfile,
  cancelSubscription,
} from '../store/profileSlice';
import { useCallback } from 'react';

export function useProfileViewModel() {
  const dispatch = useDispatch<any>();
  const state = useSelector((s: RootState) => s.profile);

  const loadProfile = useCallback(() => {
    dispatch(fetchProfile());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const updateProfileAction = useCallback(
    (payload: any) => dispatch(updateProfile(payload)).unwrap(),
    [dispatch],
  );

  const cancelSubscriptionAction = useCallback(
    (userId: string) => dispatch(cancelSubscription(userId)).unwrap(),
    [dispatch],
  );

  return {
    user: state.user,
    dashboardStats: state.dashboardStats,
    isLoading: state.status === 'loading',
    error: state.error,
    isCancellingSubscription: state.cancelSubscriptionStatus === 'loading',

    loadProfile,
    updateProfile: updateProfileAction,
    cancelSubscription: cancelSubscriptionAction,
  };
}