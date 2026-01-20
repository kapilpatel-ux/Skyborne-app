import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   'https://nonmelting-enda-unilluminative.ngrok-free.dev/api/v1';
 const API_BASE_URL = process.env.REACT_APP_API_URL ||'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';


export interface IRegionEntry {
  region: string;
  localTime: string;
  timezone: string;
  mode: 'live' | 'replay';
}

export interface Meeting {
  _id: string;
  title: string;
  localTime: string;
  regions: IRegionEntry[];
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
  duration: number;
  status: 'pending' | 'completed' | 'failed';
  [key: string]: any;
}

export interface MeetingsResponse {
  success: boolean;
  count: number;
  meetings: Meeting[];
  userPlan: string;
}

class WeeklyScheduleService {
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
   * Fetch weekly meetings for all 7 days
   * Backend filters by user plan and region
   */
  async getWeeklyMeetings(): Promise<MeetingsResponse> {
    try {
      const response = await this.api.get<MeetingsResponse>(
        '/meetings/weekly',
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch weekly meetings');
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch weekly meetings';
      throw new Error(errorMessage);
    }
  }

  /**
   * Fetch meetings for a specific day
   */
  async getMeetingsByDay(dayIndex: number): Promise<MeetingsResponse> {
    try {
      const response = await this.api.get<MeetingsResponse>(
        `/meetings/by-day/${dayIndex}`,
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch day meetings');
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch day meetings';
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const weeklyScheduleService = new WeeklyScheduleService();

// Export functions for Redux thunks
export const getWeeklyMeetings = () =>
  weeklyScheduleService.getWeeklyMeetings();

export const getMeetingsByDay = (dayIndex: number) =>
  weeklyScheduleService.getMeetingsByDay(dayIndex);