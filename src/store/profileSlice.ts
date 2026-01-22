import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { profileService } from '../services/profileService';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await profileService.getProfile();
      return res.data.user;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'profile/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await profileService.getDashboardStats();
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'profile/fetchPaymentHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await profileService.getPaymentHistory(userId);
      return res.payments || [];
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchPaymentStats = createAsyncThunk(
  'profile/fetchPaymentStats',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await profileService.getPaymentStats(userId);
      return res.stats;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await profileService.updateProfile(payload);
      return res.data.user;
    } catch (e: any) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'profile/cancelSubscription',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await profileService.cancelSubscription(userId);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    dashboardStats: null,
    paymentHistory: [],
    paymentStats: null,
    status: 'idle',
    error: null,
    cancelSubscriptionStatus: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.pending, s => { s.status = 'loading'; })
      .addCase(fetchProfile.fulfilled, (s: any, a) => {
        s.status = 'idle';
        s.user = a.payload;
      })
      .addCase(fetchDashboardStats.fulfilled, (s, a) => {
        s.dashboardStats = a.payload;
      })
      .addCase(fetchPaymentHistory.fulfilled, (s: any, a) => {
        s.paymentHistory = a.payload;
      })
      .addCase(fetchPaymentStats.fulfilled, (s: any, a) => {
        s.paymentStats = a.payload;
      })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.user = a.payload;
      })
      .addCase(cancelSubscription.pending, (s) => {
        s.cancelSubscriptionStatus = 'loading';
      })
      .addCase(cancelSubscription.fulfilled, (s, a) => {
        s.cancelSubscriptionStatus = 'idle';
        s.user = { ...(s.user ?? {}), ...(a.payload?.subscription ?? {}) };
      })
      .addCase(cancelSubscription.rejected, (s, a) => {
        s.cancelSubscriptionStatus = 'error';
        s.error = a.payload as any;
      });
  },
});

export default profileSlice.reducer;