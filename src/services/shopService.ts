import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

const FALLBACK_API_BASE_URL =
  'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';

const API_BASE_URL =
  typeof ENV_API_BASE_URL === 'string' && ENV_API_BASE_URL.trim().length > 0
    ? ENV_API_BASE_URL
    : FALLBACK_API_BASE_URL;

export type ProductSort = 'newest' | 'price-low' | 'price-high';

export interface ShopCategory {
  _id: string;
  title?: string;
  name?: string;
}

export interface ShopProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: { _id: string; title?: string; name?: string } | string;
  status?: string;
  createdAt?: string;
}

export interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartData {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  email?: string;
  phone?: string;
}

export interface ShopOrderItem {
  _id?: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShopOrder {
  _id: string;
  orderNumber: string;
  items: ShopOrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    zip?: string;
  };
  createdAt: string;
}

class ShopService {
  private api: AxiosInstance;
  private authTokenKey = '@auth_token';

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-client-source': 'app',
      },
    });

    this.api.interceptors.request.use(
      async config => {
        const token = await AsyncStorage.getItem(this.authTokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );
  }

  async getPublishedProducts(params?: {
    search?: string;
    categoryId?: string;
    sortBy?: ProductSort;
  }): Promise<ShopProduct[]> {
    const response = await this.api.get('/products/published', { params });
    return Array.isArray(response.data?.data) ? response.data.data : [];
  }

  async getProductById(productId: string): Promise<ShopProduct> {
    const response = await this.api.get(`/products/${productId}`);
    return response.data?.data ?? response.data;
  }

  async getActiveServices(): Promise<ShopCategory[]> {
    const response = await this.api.get('/services/active');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  }

  async getMyCart(): Promise<CartData> {
    const response = await this.api.get('/cart');
    return response.data?.data;
  }

  async addToCart(payload: { productId: string; quantity?: number }): Promise<CartData> {
    const response = await this.api.post('/cart', payload);
    return response.data?.data;
  }

  async updateCartItem(productId: string, quantity: number): Promise<CartData> {
    const response = await this.api.patch(`/cart/${productId}`, { quantity });
    return response.data?.data;
  }

  async removeCartItem(productId: string): Promise<CartData> {
    const response = await this.api.delete(`/cart/${productId}`);
    return response.data?.data;
  }

  async clearCart(): Promise<void> {
    await this.api.delete('/cart/clear');
  }

  async createCheckoutSession(payload: {
    shippingAddress: ShippingAddress;
    source?: 'app' | 'web';
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<{ checkoutUrl: string; sessionId: string; orderRef: string }> {
    const response = await this.api.post('/ecom-payments/create-checkout-session', payload);
    return response.data?.data;
  }

  async getMyOrders(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ShopOrder[]> {
    const response = await this.api.get('/orders/my', { params });
    return Array.isArray(response.data?.data) ? response.data.data : [];
  }
}

export const shopService = new ShopService();
