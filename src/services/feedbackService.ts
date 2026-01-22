import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';
// const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';

export interface SubmitFeedbackPayload {
  rating: number;
  comment: string;
}

class FeedbackService {
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

  submitFeedback(payload: SubmitFeedbackPayload) {
    return this.api.post('/feedback', payload);
  }

  getAllFeedback(params?: { search?: string; page?: number; limit?: number; sortBy?: string }) {
    return this.api.get('/feedback', { params });
  }

  getUserFeedback(userId: string, params?: { search?: string; page?: number; limit?: number; sortBy?: string }) {
    return this.api.get(`/feedback/user/${userId}`, { params });
  }
}

export const feedbackService = new FeedbackService();