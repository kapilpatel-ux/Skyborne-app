// ============ homeSlice.ts ============
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserProfile as getUserProfileService,
  getTodaysMeetings as getTodaysMeetingsService,
  getUpcomingMeetings as getUpcomingMeetingsService,
  getHomeData as getHomeDataService,
  getWeeklyActivity as getWeeklyActivityService,
  Meeting,
  UserProfile,
  WeeklyActivityResponse,
} from '../services/homeService';

export interface HomeState {
  user: UserProfile | null;
  todayMeetings: Meeting[];
  upcomingMeetings: Meeting[];
  weeklyActivity: WeeklyActivityResponse | null;
  userPlan: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  searchQuery: string;
  lastFetch: number | null;
}

const initialState: HomeState = {
  user: null,
  todayMeetings: [],
  upcomingMeetings: [],
  weeklyActivity: null,

  userPlan: null,
  status: 'idle',
  error: null,
  searchQuery: '',
  lastFetch: null,
};

/**
 * Fetch user profile thunk
 */
export const fetchUserProfile = createAsyncThunk(
  'home/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfileService();
      console.log('user response', response);

      return response.user;
    } catch (error: any) {
      console.error('Fetch user profile error:', error);
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  },
);

export const fetchWeeklyActivity = createAsyncThunk(
  'home/fetchWeeklyActivity',
  async (_, { rejectWithValue }) => {
    try {
      return await getWeeklyActivityService();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Fetch today's meetings thunk
 */
export const fetchTodaysMeetings = createAsyncThunk(
  'home/fetchTodaysMeetings',
  async (search: string = '', { rejectWithValue }) => {
    try {
      const response = await getTodaysMeetingsService(search);
      return response;
    } catch (error: any) {
      console.error('Fetch today meetings error:', error);
      return rejectWithValue(
        error.message || "Failed to fetch today's meetings",
      );
    }
  },
);

/**
 * Fetch upcoming meetings thunk
 */
export const fetchUpcomingMeetings = createAsyncThunk(
  'home/fetchUpcomingMeetings',
  async (search: string = '', { rejectWithValue }) => {
    try {
      const response = await getUpcomingMeetingsService(search);
      return response;
    } catch (error: any) {
      console.error('Fetch upcoming meetings error:', error);
      return rejectWithValue(
        error.message || 'Failed to fetch upcoming meetings',
      );
    }
  },
);

/**
 * Fetch home data (user + all meetings)
 */
export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
  async (search: string = '', { rejectWithValue }) => {
    try {
      const response = await getHomeDataService(search);
      return response;
    } catch (error: any) {
      console.error('Fetch home data error:', error);
      return rejectWithValue(error.message || 'Failed to fetch home data');
    }
  },
);

/**
 * Fetch both meetings concurrently
 */
export const fetchAllMeetings = createAsyncThunk(
  'home/fetchAllMeetings',
  async (search: string = '', { rejectWithValue }) => {
    try {
      const response = await getHomeDataService(search);
      return response;
    } catch (error: any) {
      console.error('Fetch all meetings error:', error);
      return rejectWithValue(error.message || 'Failed to fetch meetings');
    }
  },
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    resetHome(state) {
      state.user = null;
      state.todayMeetings = [];
      state.upcomingMeetings = [];
      state.userPlan = null;
    },
  },
  extraReducers: builder => {
    builder
      // ============ FETCH USER PROFILE ============
      .addCase(fetchUserProfile.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'idle';
        console.log('slice payload', action.payload);

        state.user = action.payload;
      })
      .addCase(fetchWeeklyActivity.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchWeeklyActivity.fulfilled, (state, action) => {
        state.status = 'idle';
        state.weeklyActivity = action.payload;
      })
      .addCase(fetchWeeklyActivity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // ============ FETCH TODAY'S MEETINGS ============
      .addCase(fetchTodaysMeetings.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodaysMeetings.fulfilled, (state, action) => {
        state.status = 'idle';
        state.todayMeetings = action.payload.meetings;
        state.userPlan = action.payload.userPlan;
        state.lastFetch = Date.now();
      })
      .addCase(fetchTodaysMeetings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // ============ FETCH UPCOMING MEETINGS ============
      .addCase(fetchUpcomingMeetings.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUpcomingMeetings.fulfilled, (state, action) => {
        state.status = 'idle';
        state.upcomingMeetings = action.payload.meetings;
        state.userPlan = action.payload.userPlan;
        state.lastFetch = Date.now();
      })
      .addCase(fetchUpcomingMeetings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // ============ FETCH HOME DATA (USER + MEETINGS) ============
      .addCase(fetchHomeData.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.user.user;
        state.todayMeetings = action.payload.today.meetings;
        state.upcomingMeetings = action.payload.upcoming.meetings;
        state.userPlan = action.payload.today.userPlan;
        state.lastFetch = Date.now();
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // ============ FETCH ALL MEETINGS ============
      .addCase(fetchAllMeetings.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllMeetings.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.user.user;
        state.todayMeetings = action.payload.today.meetings;
        state.upcomingMeetings = action.payload.upcoming.meetings;
        state.userPlan = action.payload.today.userPlan;
        state.lastFetch = Date.now();
      })
      .addCase(fetchAllMeetings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, clearError, resetHome } = homeSlice.actions;
export default homeSlice.reducer;
