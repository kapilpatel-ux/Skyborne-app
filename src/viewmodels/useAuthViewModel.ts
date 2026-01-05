import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { signup as signupThunk, verifyOtp as verifyOtpThunk } from '../store/authSlice';

export function useAuthViewModel() {
  const dispatch = useDispatch<any>();

  const signup = useCallback(async (payload: { name: string; phone: string }) => {
    const res = await dispatch(signupThunk(payload));
    return res.payload;
  }, [dispatch]);

  const verifyOtp = useCallback(async (payload: { phone?: string; code?: string }) => {
    const res = await dispatch(verifyOtpThunk(payload));
    return res.payload;
  }, [dispatch]);

  return { signup, verifyOtp };
}
