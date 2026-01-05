import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signupService, verifyOtpService, SignupPayload } from '../services/authService';

export type AuthState = { loggedIn: boolean; phone?: string; onboardingCompleted?: boolean; status: 'idle'|'loading'|'failed' };

const initialState: AuthState = { loggedIn: false, status: 'idle' };

export const signup = createAsyncThunk('auth/signup', async (payload: SignupPayload) => {
  const res = await signupService(payload);
  return { ...res, phone: payload.phone };
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ phone, code }: { phone?: string; code?: string }) => {
  const res = await verifyOtpService({ phone, code });
  return { ...res };
});

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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (s) => {
        s.status = 'loading';
      })
      .addCase(signup.fulfilled, (s, a) => {
        s.status = 'idle';
        s.phone = a.payload.phone;
      })
      .addCase(signup.rejected, (s) => {
        s.status = 'failed';
      })
      .addCase(verifyOtp.pending, (s) => {
        s.status = 'loading';
      })
      .addCase(verifyOtp.fulfilled, (s, a) => {
        s.status = 'idle';
        if (a.payload.success) {
          s.loggedIn = true;
        }
      })
      .addCase(verifyOtp.rejected, (s) => {
        s.status = 'failed';
      });
  },
});

export const { setOnboardingCompleted, logout } = slice.actions;
export default slice.reducer;
