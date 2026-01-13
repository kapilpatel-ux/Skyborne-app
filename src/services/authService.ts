import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import { SignupPayload } from '../viewmodels/useAuthViewModel';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';



export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
      country: string;
      timezone: string;
      [key: string]: any;
    };
    accessToken: string;
    refreshToken: string;
    tempUserId?: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      country?: string;
      timezone?: string;
      [key: string]: any;
    };
    accessToken: string;
    refreshToken: string;
  };
}

class AuthService {
  private api: AxiosInstance;
  private authTokenKey = '@auth_token';
  private refreshTokenKey = '@refresh_token';

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(this.authTokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Signup - Register user with complete onboarding data
   */
  async signupService(payload: SignupPayload): Promise<SignupResponse> {
    try {
      console.log(
  'API payload typeof:',
  typeof payload,
  payload
);

      const response = await this.api.post('/signup', payload);
      
      if (response.data?.success && response.data?.data?.accessToken) {
        // Store tokens in AsyncStorage
        await this.setAuthToken(response.data.data.accessToken);
        if (response.data.data.refreshToken) {
          await this.setRefreshToken(response.data.data.refreshToken);
        }
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Signup failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Login - Authenticate user with email and password
   */
  async loginService(payload: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      console.log('Login payload:', payload);

      const response = await this.api.post('/login', payload);
      
      if (response.data?.success && response.data?.data?.accessToken) {
        // Store tokens in AsyncStorage
        await this.setAuthToken(response.data.data.accessToken);
        if (response.data.data.refreshToken) {
          await this.setRefreshToken(response.data.data.refreshToken);
        }
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Login failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Send OTP to phone or email
   */
  async sendOtpService(payload: {
    email?: string;
    phone?: string;
  }): Promise<any> {
    try {
      const response = await this.api.post('/send-otp', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to send OTP';
      throw new Error(errorMessage);
    }
  }

  /**
   * Verify OTP and get temp user ID
   */
  async verifyOtpService(payload: {
    phone?: string;
    email?: string;
    code?: string;
  }): Promise<any> {
    try {
      const response = await this.api.post('/verify-otp', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'OTP verification failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Store auth token in AsyncStorage
   */
  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.authTokenKey, token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  }

  /**
   * Store refresh token in AsyncStorage
   */
  async setRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.refreshTokenKey, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  /**
   * Get auth token from AsyncStorage
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.authTokenKey);
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  }

  /**
   * Remove auth token from AsyncStorage
   */
  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.authTokenKey);
      await AsyncStorage.removeItem(this.refreshTokenKey);
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export functions for backward compatibility with Redux thunks
export const signupService = (payload: SignupPayload) =>
  authService.signupService(payload);

export const loginService = (payload: { email: string; password: string }) =>
  authService.loginService(payload);

export const sendOtpService = (payload: { email?: string; phone?: string }) =>
  authService.sendOtpService(payload);

export const verifyOtpService = (payload: {
  phone?: string;
  email?: string;
  otp?: string;
}) => authService.verifyOtpService(payload);

export const setAuthToken = (token: string) => authService.setAuthToken(token);
export const removeAuthToken = () => authService.removeAuthToken();