import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';

export interface DashboardStats {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  totalClasses: number;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  timezone?: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  subscription?: any;
}

class ProfileService {
  private api: AxiosInstance;
  private authTokenKey = '@auth_token';

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });

    this.api.interceptors.request.use(async config => {
      const token = await AsyncStorage.getItem(this.authTokenKey);
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  getProfile() {
    return this.api.get('/me');
  }

  updateProfile(payload: UpdateProfilePayload) {
    return this.api.put('/update-profile', payload);
  }

  getDashboardStats() {
    return this.api.get('/dashboardStats');
  }

  cancelSubscription(userId: string) {
    return this.api.post(`/subscription/${userId}/cancel`);
  }
}

export const profileService = new ProfileService();