import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  fetchProfile,
  fetchDashboardStats,
  updateProfile,
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

  return {
    user: state.user,
    dashboardStats: state.dashboardStats,
    isLoading: state.status === 'loading',
    error: state.error,

    loadProfile,
    updateProfile: updateProfileAction, 
  };

}
