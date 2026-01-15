// services/paymentService.ts

import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';
// const API_BASE_URL = process.env.REACT_APP_API_URL ||'https://semiobliviously-inborn-deetta.ngrok-free.dev/api/v1';
export interface PaymentOrderPayload {
  amount: number;
  currency: string;
  userId: string;
  plan: string;
  email?: string;
  phone?: string;
  source?: 'app' | 'web';
}

export interface PaymentOrderResponse {
  success: boolean;
  message: string;
    orderId: string;
    orderRef: string;
    paymentLink: string;
    sessionId?: string;  // ✅ NEW: For Stripe
    reference?: string;  // ✅ NEW: For nGenius
    amount: number;
    currency: string;
    status: string;
    gateway?: string;    // ✅ NEW: Payment gateway used
}

export interface PaymentVerificationPayload {
  sessionId?: string;  // Stripe
  orderRef?: string;   // nGenius
  reference?: string;  // nGenius
  paymentIntentId?: string; // Alternative Stripe field
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELLED';
  orderRef: string;
  amount: number;
  currency: string;
  plan: string;
  gateway?: string;
}

class PaymentService {
  private api: AxiosInstance;
  private authTokenKey = '@auth_token';

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(this.authTokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Create payment order - works with both Stripe and nGenius
   */
  async createPaymentOrder(payload: PaymentOrderPayload): Promise<PaymentOrderResponse> {
    try {
      console.log('🔄 Creating payment order:', payload);
      
      const response = await this.api.post('/payment/create-order', payload);

      console.log("response", response);
      
      if (response.data?.success && response.data?.orderRef) {
        // ✅ Store payment details for verification later
        await AsyncStorage.setItem('paymentOrderRef', response.data.orderRef);
        
        // Store gateway-specific details
        if (response.data.data.sessionId) {
          await AsyncStorage.setItem('paymentSessionId', response.data.sessionId);
        }
        if (response.data.data.reference) {
          await AsyncStorage.setItem('paymentReference', response.data.reference);
        }
        if (response.data.gateway) {
          await AsyncStorage.setItem('paymentGateway', response.data.gateway);
        }

        console.log('✅ Payment order created:', {
          orderRef: response.data.orderRef,
          gateway: response.data.gateway,
        });
      }
      return response.data;
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Payment order creation failed';
      console.error('❌ Payment order creation error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * ✅ NEW: Verify payment for mobile - works with both gateways
   * Automatically detects which gateway was used based on stored data
   */
  async verifyMobilePayment(payload?: PaymentVerificationPayload): Promise<PaymentVerificationResponse> {
    try {
      // If no payload provided, construct it from AsyncStorage
      if (!payload) {
        const sessionId = await AsyncStorage.getItem('paymentSessionId');
        const orderRef = await AsyncStorage.getItem('paymentOrderRef');
        const reference = await AsyncStorage.getItem('paymentReference');

        payload = {
          ...(sessionId && { sessionId }),
          ...(orderRef && { orderRef }),
          ...(reference && { reference }),
        };
      }

      console.log('🔄 Verifying mobile payment:', payload);

      const response = await this.api.post('/payment/verify-mobile', payload);

      console.log('✅ Payment verification response:', response.data);

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Payment verification failed';
      console.error('❌ Payment verification error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Verify payment by order reference (legacy method)
   */
  async verifyPayment(orderRef: string): Promise<any> {
    try {
      console.log('🔄 Verifying payment by orderRef:', orderRef);

      const response = await this.api.get(`/payment/status/${orderRef}`);
      
      console.log('✅ Payment status response:', response.data);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        'Payment verification failed';
      console.error('❌ Payment verification error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get payment status by order ID
   */
  async getPaymentStatus(orderId: string): Promise<any> {
    try {
      console.log('🔄 Fetching payment status:', orderId);

      const response = await this.api.get(`/payment/status/${orderId}`);
      
      console.log('✅ Payment status:', response.data);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        'Failed to fetch payment status';
      console.error('❌ Payment status error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * ✅ NEW: Clear payment cache after verification
   */
  async clearPaymentCache(): Promise<void> {
    try {
      console.log('🧹 Clearing payment cache...');
      
      await AsyncStorage.removeItem('paymentOrderRef');
      await AsyncStorage.removeItem('paymentSessionId');
      await AsyncStorage.removeItem('paymentReference');
      await AsyncStorage.removeItem('paymentGateway');

      console.log('✅ Payment cache cleared');
    } catch (error) {
      console.error('❌ Error clearing payment cache:', error);
    }
  }

  /**
   * ✅ NEW: Get all stored payment details
   */
  async getStoredPaymentDetails(): Promise<{
    orderRef?: string;
    sessionId?: string;
    reference?: string;
    gateway?: string;
  }> {
    try {
      const [orderRef, sessionId, reference, gateway] = await Promise.all([
        AsyncStorage.getItem('paymentOrderRef'),
        AsyncStorage.getItem('paymentSessionId'),
        AsyncStorage.getItem('paymentReference'),
        AsyncStorage.getItem('paymentGateway'),
      ]);

      return {
        ...(orderRef && { orderRef }),
        ...(sessionId && { sessionId }),
        ...(reference && { reference }),
        ...(gateway && { gateway }),
      };
    } catch (error) {
      console.error('❌ Error getting stored payment details:', error);
      return {};
    }
  }
}

export const paymentService = new PaymentService();

// ✅ Export individual functions for convenience
export const createPaymentOrder = (payload: PaymentOrderPayload) =>
  paymentService.createPaymentOrder(payload);

export const verifyMobilePayment = (payload?: PaymentVerificationPayload) =>
  paymentService.verifyMobilePayment(payload);

export const verifyPayment = (orderRef: string) =>
  paymentService.verifyPayment(orderRef);

export const getPaymentStatus = (orderId: string) =>
  paymentService.getPaymentStatus(orderId);

export const clearPaymentCache = () =>
  paymentService.clearPaymentCache();

export const getStoredPaymentDetails = () =>
  paymentService.getStoredPaymentDetails();