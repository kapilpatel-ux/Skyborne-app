// ============ pastSessionsService.ts ============
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
  duration: number;
  recordingUrl?: string;
  status: 'completed' | 'failed' | 'pending';
  attendance?: {
    totalDuration: number;
    status: string;
  };
  rating?: number;
  [key: string]: any;
}

export interface PastSessionsResponse {
  success: boolean;
  count: number;
  totalCount: number;
  hasMore: boolean;
  meetings: Meeting[];
  userPlan: string;
}

class PastSessionsService {
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

  private async getRegionParam(): Promise<string | undefined> {
    try {
      const { regionName, regionCode } = await fetchLoggedInUserCountryRegion();
      if (regionName?.trim()) return regionName.trim();
      if (regionCode?.trim()) return regionCode.trim();
    } catch (error) {
      console.warn('Failed to map region via countries:', error);
    }

    try {
      const { region, code } = await fetchLoggedInUserRegion();
      if (region?.trim()) return region.trim();
      if (code?.trim()) return code.trim();
    } catch (error) {
      console.warn('Failed to load fallback region from /me:', error);
    }

    return undefined;
  }

  /**
   * Fetch past/completed sessions with pagination
   * @param skip - Number of items to skip (default: 0)
   * @param limit - Number of items to fetch (default: 10)
   * @param search - Optional search query to filter sessions
   */
  async getPastSessions(
    skip: number = 0,
    limit: number = 10,
    search?: string,
  ): Promise<PastSessionsResponse> {
    try {
      const params: any = { skip, limit };
      if (search) params.search = search;
      const regionParam = await this.getRegionParam();
      if (regionParam) params.region = regionParam;

      const response = await this.api.get<PastSessionsResponse>(
        '/meetings/past',
        { params },
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch past sessions');
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch past sessions';
      throw new Error(errorMessage);
    }
  }

  /**
   * Fetch a single past session's details
   * @param sessionId - The ID of the session
   */
  async getPastSessionDetails(sessionId: string): Promise<{ success: boolean; data: Meeting }> {
    try {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const response = await this.api.get(
        `/meetings/past/${sessionId}`,
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch session details');
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch session details';
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const pastSessionsService = new PastSessionsService();

// Export functions
export const getPastSessions = (
  skip: number = 0,
  limit: number = 10,
  search?: string,
) => pastSessionsService.getPastSessions(skip, limit, search);

export const getPastSessionDetails = (sessionId: string) =>
  pastSessionsService.getPastSessionDetails(sessionId);
