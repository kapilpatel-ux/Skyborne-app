import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { 
  signupService, 
  sendOtpService,
  verifyOtpService, 
  SignupPayload,
  setAuthToken,
  removeAuthToken 
} from '../services/authService';

export type AuthState = { 
  loggedIn: boolean; 
  phone?: string;
  email?: string;
  tempUserId?: string;
  onboardingCompleted?: boolean; 
  status: 'idle' | 'loading' | 'failed';
  error?: string;
  token?: string;
};

const initialState: AuthState = { 
  loggedIn: false, 
  status: 'idle' 
};

// Signup thunk
export const signup = createAsyncThunk(
  '/signup', 
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      const res = await signupService(payload);
      return { 
        ...res, 
        phone: payload.phone,
        email: payload.email 
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

// Send OTP thunk
export const sendOtp = createAsyncThunk(
  '/sendOtp',
  async (payload: { email?: string; phone?: string }, { rejectWithValue }) => {
    try {
      const res = await sendOtpService(payload);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

// Verify OTP thunk
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp', 
  async (
    { phone, email, code }: { phone?: string; email?: string; code?: string }, 
    { rejectWithValue }
  ) => {
    try {
      const res = await verifyOtpService({ phone, email, code });
      
      // Store token if provided
      if (res.data?.token) {
        setAuthToken(res.data.token);
      }
      
      return res;
    } catch (error: any) {
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOnboardingCompleted(state, action) {
      state.onboardingCompleted = !!action.payload;
    },
    logout(state) {
      state.loggedIn = false;
      state.phone = undefined;
      state.email = undefined;
      state.tempUserId = undefined;
      state.token = undefined;
      removeAuthToken();
    },
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signup.pending, (s) => {
        s.status = 'loading';
        s.error = undefined;
      })
      .addCase(signup.fulfilled, (s, a) => {
        s.status = 'idle';
        s.phone = a.payload.phone;
        s.email = a.payload.email;
      })
      .addCase(signup.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload as string;
      })
      
      // Send OTP cases
      .addCase(sendOtp.pending, (s) => {
        s.status = 'loading';
        s.error = undefined;
      })
      .addCase(sendOtp.fulfilled, (s) => {
        s.status = 'idle';
      })
      .addCase(sendOtp.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload as string;
      })
      
      // Verify OTP cases
      .addCase(verifyOtp.pending, (s) => {
        s.status = 'loading';
        s.error = undefined;
      })
      .addCase(verifyOtp.fulfilled, (s, a) => {
        s.status = 'idle';
        if (a.payload.success) {
          s.loggedIn = true;
          s.tempUserId = a.payload.data?.tempUserId;
          s.token = a.payload.data?.token;
        }
      })
      .addCase(verifyOtp.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload as string;
      });
  },
});

export const { setOnboardingCompleted, logout, clearError } = slice.actions;
export default slice.reducer;