// ============ homeService.ts ============
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';
import {
  fetchLoggedInUserCountryRegion,
  fetchLoggedInUserRegion,
} from '../utils/timezoneUtils';

const FALLBACK_API_BASE_URL =
  'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';

const API_BASE_URL =
  (typeof ENV_API_BASE_URL === 'string' && ENV_API_BASE_URL.trim().length > 0)
    ? ENV_API_BASE_URL
    : FALLBACK_API_BASE_URL;

export interface Meeting {
  _id: string;
  title: string;
  localTime: string;
  service: {
    _id: string;
    title: string;
    name: string;
  };
  trainer: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  [key: string]: any;
}

export interface MeetingsResponse {
  success: boolean;
  count: number;
  meetings: Meeting[];
  userPlan: string;
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  timezone?: string;
  plan?: string;
  classCredits?: {
    yoga?: number;
    zumba?: number;
    specialty?: number;
  };
  totalClassCredits?: number;
  profileImage?: string;
  [key: string]: any;
}

export interface UserResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export interface WeeklyActivityDay {
  day: string;
  completed: boolean;
}

export interface WeeklyActivityResponse {
  totalDays: number;
  completedDays: number;
  progressPercent: number;
  days: WeeklyActivityDay[];
}

export interface ClassDetailsResponse {
  success: boolean;
  data: Meeting;
}

class HomeService {
  private api: AxiosInstance;
  private authTokenKey = '@auth_token';

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      async config => {
        const token = await AsyncStorage.getItem(this.authTokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );
  }

  private async getRegionCode(): Promise<string | undefined> {
    try {
      const { regionCode } = await fetchLoggedInUserCountryRegion();
      if (regionCode?.trim()) return regionCode.trim();
    } catch (error) {
      console.warn('Failed to map region code via countries:', error);
    }

    try {
      const { code } = await fetchLoggedInUserRegion();
      if (code?.trim()) return code.trim();
    } catch (error) {
      console.warn('Failed to load fallback region code from /me:', error);
    }

    return undefined;
  }

  /**
   * Fetch current user profile
   */
  async getUserProfile(): Promise<UserResponse> {
    try {
      const response = await this.api.get<UserResponse>('/me');
      console.log('api response', response);

      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to fetch user profile',
        );
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch user profile';
      throw new Error(errorMessage);
    }
  }

  /**
   * Fetch weekly activity
   */
  async getWeeklyActivity(): Promise<WeeklyActivityResponse> {
    try {
      const response = await this.api.get<WeeklyActivityResponse>(
        '/meetings/weekly-activity',
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch weekly activity';
      throw new Error(errorMessage);
    }
  }

  /**
   * Fetch today's meetings
   * @param search - Optional search query to filter meetings by title, service, or trainer
   */
  async getTodaysMeetings(search?: string): Promise<MeetingsResponse> {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      const regionCode = await this.getRegionCode();
      if (regionCode) params.region = regionCode;
      const response = await this.api.get<MeetingsResponse>('/meetings/today', {
        params,
      });

      if (!response.data.success) {
        throw new Error("Failed to fetch today's meetings");
      }
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch today's meetings";
      throw new Error(errorMessage);
    }
  }


/**
 * Fetch upcoming meetings with pagination
 * @param search - Optional search query to filter meetings by title, service, or trainer
 * @param skip - Number of items to skip (default: 0)
 * @param limit - Number of items to fetch (default: 10)
 */
async getUpcomingMeetings(search?: string, skip: number = 0, limit: number = 10): Promise<MeetingsResponse & { totalCount: number; hasMore: boolean }> {
  try {
    const params: any = { skip, limit };
    if (search) params.search = search;
    const regionCode = await this.getRegionCode();
    if (regionCode) params.region = regionCode;

    const response = await this.api.get<MeetingsResponse & { totalCount: number; hasMore: boolean }>(
      '/meetings/upcoming',
      { params },
    );

    if (!response.data.success) {
      throw new Error('Failed to fetch upcoming meetings');
    }

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch upcoming meetings';
    throw new Error(errorMessage);
  }
}



  /**
   * Fetch class/meeting details by ID
   * @param classId - The ID of the class to fetch
   */
  async getClassDetails(classId: string): Promise<ClassDetailsResponse> {
    try {
      if (!classId) {
        throw new Error('Class ID is required');
      }

      const response = await this.api.get<ClassDetailsResponse>(
        `/meetings/${classId}`,
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch class details');
      }
      console.log('class detail', classId);

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch class details';
      throw new Error(errorMessage);
    }
  }

  /**
   * Fetch user profile and all meetings
   * @param search - Optional search query to filter meetings
   */
  async getHomeData(search?: string): Promise<{
    user: UserResponse;
    today: MeetingsResponse;
    upcoming: MeetingsResponse;
  }> {
    try {
      const [userRes, todayRes, upcomingRes] = await Promise.all([
        this.getUserProfile(),
        this.getTodaysMeetings(search),
        this.getUpcomingMeetings(search),
      ]);

      return {
        user: userRes,
        today: todayRes,
        upcoming: upcomingRes,
      };
    } catch (error: any) {
      console.error('Error fetching home data:', error);
      throw error;
    }
  }

  /**
   * Fetch both today and upcoming meetings
   * @param search - Optional search query to filter meetings
   */
  async getAllMeetings(search?: string): Promise<{
    today: MeetingsResponse;
    upcoming: MeetingsResponse;
  }> {
    try {
      const [todayRes, upcomingRes] = await Promise.all([
        this.getTodaysMeetings(search),
        this.getUpcomingMeetings(search),
      ]);

      return {
        today: todayRes,
        upcoming: upcomingRes,
      };
    } catch (error: any) {
      console.error('Error fetching all meetings:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const homeService = new HomeService();

// Export functions for Redux thunks
export const getUserProfile = () => homeService.getUserProfile();

export const getTodaysMeetings = (search?: string) =>
  homeService.getTodaysMeetings(search);

export const getUpcomingMeetings = (search?: string) =>
  homeService.getUpcomingMeetings(search);

export const getClassDetails = (classId: string) =>
  homeService.getClassDetails(classId);

export const getAllMeetings = (search?: string) =>
  homeService.getAllMeetings(search);

export const getHomeData = (search?: string) =>
  homeService.getHomeData(search);

export const getWeeklyActivity = () =>
  homeService.getWeeklyActivity();
