import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  signup as signupThunk, 
  sendOtp as sendOtpThunk,
  verifyOtp as verifyOtpThunk 
} from '../store/authSlice';
import { RootState } from '../store';

export function useAuthViewModel() {
  const dispatch = useDispatch<any>();
  const authState = useSelector((state: RootState) => state.auth);

  const signup = useCallback(
    async (payload: { name: string; phone: string; email?: string }) => {
      try {
        const result = await dispatch(signupThunk(payload));
        // Check if it was fulfilled or rejected
        if (result.meta.requestStatus === 'fulfilled') {
          return result.payload;
        } else {
          return { 
            success: false, 
            message: result.payload || 'Signup failed' 
          };
        }
      } catch (error: any) {
        console.error('Signup error:', error);
        return { 
          success: false, 
          message: error.message || 'Signup failed' 
        };
      }
    }, 
    [dispatch]
  );

  const sendOtp = useCallback(
    async (payload: { email?: string; phone?: string }) => {
      try {
        const result = await dispatch(sendOtpThunk(payload));
        console.log('sendOtp result:', result);
        
        if (result.meta.requestStatus === 'fulfilled') {
          return result.payload;
        } else {
          return { 
            success: false, 
            message: result.payload || 'Failed to send OTP' 
          };
        }
      } catch (error: any) {
        console.error('SendOtp error:', error);
        return { 
          success: false, 
          message: error.message || 'Failed to send OTP' 
        };
      }
    },
    [dispatch]
  );

  const verifyOtp = useCallback(
    async (payload: { phone?: string; email?: string; code?: string }) => {
      try {
        const result = await dispatch(verifyOtpThunk(payload));
        console.log('verifyOtp result:', result);
        
        if (result.meta.requestStatus === 'fulfilled') {
          return result.payload;
        } else {
          return { 
            success: false, 
            message: result.payload || 'OTP verification failed' 
          };
        }
      } catch (error: any) {
        console.error('VerifyOtp error:', error);
        return { 
          success: false, 
          message: error.message || 'OTP verification failed' 
        };
      }
    }, 
    [dispatch]
  );

  return { 
    signup, 
    sendOtp,
    verifyOtp,
    authState 
  };
}