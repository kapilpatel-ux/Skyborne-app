// services/paymentService.ts

import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://nonmelting-enda-unilluminative.ngrok-free.dev/api/v1';
 const API_BASE_URL = process.env.REACT_APP_API_URL ||'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';


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
  orderId?: string;
  orderRef: string;
  paymentLink: string;
  sessionId?: string;        // ✅ Stripe only
  reference?: string;        // ✅ nGenius only
  amount: number;
  currency: string;
  status: string;
  gateway?: string;          // 'stripe' or 'ngenius'
}

export interface PaymentVerificationPayload {
  sessionId?: string;        // Stripe
  orderRef?: string;         // nGenius
  reference?: string;        // nGenius
  paymentIntentId?: string;  // Stripe alternative
  gateway?: string;          // Payment gateway type
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
   * 
   * nGenius Response:
   * {
   *   success: true,
   *   gateway: "ngenius",
   *   orderRef: "NG-1768724655173-92DV3",
   *   paymentLink: "https://paypage.sandbox.ngenius-payments.com/?code=...",
   *   reference: "185686fa-5937-4780-9397-431369f46e90",  // ✅ nGenius only
   *   message: "Payment order created successfully"
   * }
   * 
   * Stripe Response:
   * {
   *   success: true,
   *   gateway: "stripe",
   *   orderRef: "STR-1768724655173",
   *   paymentLink: "https://checkout.stripe.com/...",
   *   sessionId: "cs_test_...",  // ✅ Stripe only
   *   message: "Checkout session created"
   * }
   */
  async createPaymentOrder(payload: PaymentOrderPayload): Promise<PaymentOrderResponse> {
    try {
      console.log('🔄 Creating payment order:', payload);

      const response = await this.api.post('/payment/create-order', payload);

      console.log('✅ Payment order response:', {
        gateway: response.data?.gateway,
        orderRef: response.data?.orderRef,
        hasSessionId: !!response.data?.sessionId,
        hasReference: !!response.data?.reference,
      });

      if (response.data?.success && response.data?.orderRef) {
        // Store payment details for verification later
        await AsyncStorage.setItem('paymentOrderRef', response.data.orderRef);
        await AsyncStorage.setItem('paymentGateway', response.data.gateway || 'unknown');

        // Store gateway-specific identifiers
        if (response.data.gateway === 'ngenius') {
          // nGenius uses 'reference' as primary identifier
          if (response.data.reference) {
            await AsyncStorage.setItem('paymentReference', response.data.reference);
            console.log('📦 Stored nGenius reference:', response.data.reference);
          }
        } else if (response.data.gateway === 'stripe') {
          // Stripe uses 'sessionId' as primary identifier
          if (response.data.sessionId) {
            await AsyncStorage.setItem('paymentSessionId', response.data.sessionId);
            console.log('📦 Stored Stripe sessionId:', response.data.sessionId);
          }
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
   * Verify payment for mobile - works with both gateways
   * Automatically detects which gateway was used based on stored data
   * 
   * Payload logic:
   * - If nGenius: sends reference + orderRef
   * - If Stripe: sends sessionId + orderRef
   */
  async verifyMobilePayment(payload?: PaymentVerificationPayload): Promise<PaymentVerificationResponse> {
    try {
      // If no payload provided, construct it from AsyncStorage
      if (!payload) {
        const [orderRef, gateway, reference, sessionId] = await Promise.all([
          AsyncStorage.getItem('paymentOrderRef'),
          AsyncStorage.getItem('paymentGateway'),
          AsyncStorage.getItem('paymentReference'),
          AsyncStorage.getItem('paymentSessionId'),
        ]);

        // Determine which fields to include based on gateway
        if (gateway === 'ngenius') {
          payload = {
            orderRef: orderRef || undefined,
            reference: reference || undefined,
            gateway: 'ngenius',
          };
          console.log('📋 Verifying nGenius payment:', { orderRef, reference });
        } else if (gateway === 'stripe') {
          payload = {
            orderRef: orderRef || undefined,
            sessionId: sessionId || undefined,
            gateway: 'stripe',
          };
          console.log('📋 Verifying Stripe payment:', { orderRef, sessionId });
        } else {
          // Fallback: try both
          payload = {
            orderRef: orderRef || undefined,
            reference: reference || undefined,
            sessionId: sessionId || undefined,
          };
          console.log('📋 Verifying payment (auto-detect):', payload);
        }
      }

      console.log('🔄 Verifying mobile payment:', payload);

      const response = await this.api.post('/payment/verify-mobile', payload);

      console.log('✅ Payment verification response:', {
        success: response.data?.success,
        status: response.data?.status,
        gateway: response.data?.gateway,
      });

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
   * Clear payment cache after verification
   */
  async clearPaymentCache(): Promise<void> {
    try {
      console.log('🧹 Clearing payment cache...');

      await AsyncStorage.removeItem('paymentOrderRef');
      await AsyncStorage.removeItem('paymentSessionId');  // Stripe
      await AsyncStorage.removeItem('paymentReference');  // nGenius
      await AsyncStorage.removeItem('paymentGateway');

      console.log('✅ Payment cache cleared');
    } catch (error) {
      console.error('❌ Error clearing payment cache:', error);
    }
  }

  /**
   * Get all stored payment details
   */
  async getStoredPaymentDetails(): Promise<{
    orderRef?: string;
    sessionId?: string;    // Stripe
    reference?: string;    // nGenius
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

  /**
   * Get payment gateway type
   */
  async getPaymentGateway(): Promise<'stripe' | 'ngenius' | 'unknown'> {
    try {
      const gateway = await AsyncStorage.getItem('paymentGateway');
      return (gateway as 'stripe' | 'ngenius') || 'unknown';
    } catch (error) {
      console.error('❌ Error getting payment gateway:', error);
      return 'unknown';
    }
  }

  /**
   * Get primary payment identifier based on gateway
   * Returns either reference (nGenius) or sessionId (Stripe)
   */
  async getPrimaryPaymentIdentifier(): Promise<string | null> {
    try {
      const [gateway, reference, sessionId] = await Promise.all([
        AsyncStorage.getItem('paymentGateway'),
        AsyncStorage.getItem('paymentReference'),
        AsyncStorage.getItem('paymentSessionId'),
      ]);

      if (gateway === 'ngenius' && reference) {
        return reference;
      } else if (gateway === 'stripe' && sessionId) {
        return sessionId;
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting primary payment identifier:', error);
      return null;
    }
  }
}

export const paymentService = new PaymentService();

// Export individual functions for convenience
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

export const getPaymentGateway = () =>
  paymentService.getPaymentGateway();

export const getPrimaryPaymentIdentifier = () =>
  paymentService.getPrimaryPaymentIdentifier();