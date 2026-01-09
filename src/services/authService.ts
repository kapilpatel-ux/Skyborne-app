import axios from 'axios';

// Configure your base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type SignupPayload = { name: string; phone: string; email?: string };

export async function signupService(payload: SignupPayload) {
  try {
    const response = await apiClient.post('/signup', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Signup failed' };
  }
}

export async function sendOtpService(payload: { email?: string; phone?: string }) {
  try {
    console.log("api calling", payload);
    
    const response = await apiClient.post('/send-otp', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to send OTP' };
  }
}

export async function verifyOtpService({ 
  phone, 
  email, 
  code 
}: { 
  phone?: string; 
  email?: string; 
  code?: string 
}) {
  try {
    const response = await apiClient.post('/verify-otp', {
      phone,
      email,
      otp: code,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'OTP verification failed' };
  }
}

// Add token management
export function setAuthToken(token: string) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function removeAuthToken() {
  delete apiClient.defaults.headers.common['Authorization'];
}