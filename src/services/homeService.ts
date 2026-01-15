// ============ homeService.ts ============
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

//const API_BASE_URL =
  // process.env.REACT_APP_API_URL ||
  // 'https://nonmelting-enda-unilluminative.ngrok-free.dev/api/v1';

   const API_BASE_URL = process.env.REACT_APP_API_URL ||'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';


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
  [key: string]: any;
}

export interface UserResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export interface WeeklyActivityDay {
  day: string;       // M, T, W...
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
        '/meetings/weekly-activity'
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
   */
  async getTodaysMeetings(search: string = ''): Promise<MeetingsResponse> {
    try {
      const params = search ? { search } : {};
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
   * Fetch upcoming meetings
   */
  async getUpcomingMeetings(search: string = ''): Promise<MeetingsResponse> {
    try {
      const params = search ? { search } : {};
      const response = await this.api.get<MeetingsResponse>(
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
   */
  async getClassDetails(classId: string): Promise<ClassDetailsResponse> {
    try {
      if (!classId) {
        throw new Error('Class ID is required');
      }

      const response = await this.api.get<ClassDetailsResponse>(
        `/meetings/${classId}`
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch class details',
        );
      }
      console.log("class detail", classId);
      

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
   */
  async getHomeData(search: string = ''): Promise<{
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
   */
  async getAllMeetings(search: string = ''): Promise<{
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

export const getTodaysMeetings = (search: string = '') =>
  homeService.getTodaysMeetings(search);

export const getUpcomingMeetings = (search: string = '') =>
  homeService.getUpcomingMeetings(search);

export const getClassDetails = (classId: string) =>
  homeService.getClassDetails(classId);

export const getAllMeetings = (search: string = '') =>
  homeService.getAllMeetings(search);

export const getHomeData = (search: string = '') =>
  homeService.getHomeData(search);

export const getWeeklyActivity = () =>
  homeService.getWeeklyActivity();