import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { 
  signupService, 
  sendOtpService,
  verifyOtpService,
  loginService,
  setAuthToken,
  removeAuthToken 
} from '../services/authService';

export interface SignupPayload {
  tempUserId: string;
  email?: string;
  phone?: string;
  country: string;
  countryCode: string;
  timezone: string;
  inspiration?: number;
  firstGoal?: number;
  fitnessLevel?: number | null | undefined;
  habits?: {
    waterIntake?: number | null;
    sleepQuality?: number | null;
    exerciseFrequency?: number | null;
  };
  pricingPlan?: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  timezone?: string;
  [key: string]: any;
}

export type AuthState = { 
  loggedIn: boolean;
  user?: User;
  phone?: string;
  email?: string;
  tempUserId?: string;
  onboardingCompleted?: boolean; 
  status: 'idle' | 'loading' | 'failed';
  error?: string;
  accessToken?: string;
  refreshToken?: string;
};

const initialState: AuthState = { 
  loggedIn: false, 
  status: 'idle',
  user: undefined,
  tempUserId: undefined,
  accessToken: undefined,
  refreshToken: undefined,
};

/**
 * Signup thunk - Complete profile with all onboarding data
 */
export const signup = createAsyncThunk(
  'auth/signup',
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      const res = await signupService(payload);

      if (!res.success) {
        return rejectWithValue(res.message || 'Signup failed');
      }

      const { user, accessToken, refreshToken } = res.data;

      // Store tokens
      if (accessToken) {
        await setAuthToken(accessToken);
      }

      return {
        success: true,
        message: res.message,
        data: {
          user,
          accessToken,
          refreshToken,
        },
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

/**
 * Send OTP thunk
 */
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (
    payload: { email?: string; phone?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await sendOtpService(payload);

      if (!res.success) {
        return rejectWithValue(res.message || 'Failed to send OTP');
      }

      return {
        success: true,
        message: res.message,
        data: res.data,
      };
    } catch (error: any) {
      console.error('SendOtp error:', error);
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

/**
 * Verify OTP thunk - Gets tempUserId for final signup
 */
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (
    { phone, email, otp }: { phone?: string; email?: string; otp?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await verifyOtpService({ phone, email, otp });

      if (!res.success) {
        return rejectWithValue(res.message || 'OTP verification failed');
      }

      const { tempUserId, token, refreshToken } = res.data;

      // Store token if provided
      if (token) {
        await setAuthToken(token);
      }

      return {
        success: true,
        message: res.message,
        data: {
          tempUserId,
          token,
          refreshToken,
          ...res.data,
        },
      };
    } catch (error: any) {
      console.error('VerifyOtp error:', error);
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginService(payload);

      if (!res.success) {
        return rejectWithValue(res.message || 'Login failed');
      }

      const { user, accessToken, refreshToken } = res.data;

      // Store tokens
      if (accessToken) {
        await setAuthToken(accessToken);
      }

      return {
        success: true,
        message: res.message,
        data: {
          user,
          accessToken,
          refreshToken,
        },
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOnboardingCompleted(state, action) {
      state.onboardingCompleted = !!action.payload;
    },
    logout(state) {
      state.loggedIn = false;
      state.user = undefined;
      state.phone = undefined;
      state.email = undefined;
      state.tempUserId = undefined;
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.onboardingCompleted = false;
      removeAuthToken();
    },
    clearError(state) {
      state.error = undefined;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.loggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============ SIGNUP CASES ============
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedIn = true;
        state.user = action.payload.data?.user;
        state.accessToken = action.payload.data?.accessToken;
        state.refreshToken = action.payload.data?.refreshToken;
        state.email = action.payload.data?.user?.email;
        state.phone = action.payload.data?.user?.phone;
        state.onboardingCompleted = action.payload.data?.user?.onboardingCompleted;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.loggedIn = false;
      })

       // ============ LOGIN CASES ============
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedIn = true;
        state.user = action.payload.data?.user;
        state.accessToken = action.payload.data?.accessToken;
        state.refreshToken = action.payload.data?.refreshToken;
        state.email = action.payload.data?.user?.email;
        state.phone = action.payload.data?.user?.phone;
        state.onboardingCompleted = action.payload.data?.user?.onboardingCompleted;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.loggedIn = false;
      })

      // ============ SEND OTP CASES ============
      .addCase(sendOtp.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // ============ VERIFY OTP CASES ============
      .addCase(verifyOtp.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload.success) {
          state.tempUserId = action.payload.data?.tempUserId;
          state.accessToken = action.payload.data?.token;
          state.refreshToken = action.payload.data?.refreshToken;
          // Don't set loggedIn yet - wait for final signup
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setOnboardingCompleted, logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;