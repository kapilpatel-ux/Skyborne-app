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

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    dashboardStats: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.pending, s => { s.status = 'loading'; })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.status = 'idle';
        s.user = a.payload;
      })
      .addCase(fetchDashboardStats.fulfilled, (s, a) => {
        s.dashboardStats = a.payload;
      })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.user = a.payload;
      });
  },
});

export default profileSlice.reducer;
