// 2. Payment Redux Slice (store/paymentSlice.ts)
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createPaymentOrder, verifyPayment } from '../services/paymentService';

export interface PaymentState {
  orderId?: string;
  orderRef?: string;
  amount?: number;
  status: 'idle' | 'loading' | 'success' | 'failed';
  error?: string;
  paymentLink?: string;
}

const initialState: PaymentState = {
  status: 'idle',
};

export const initiatePayment = createAsyncThunk(
  'payment/initiatePayment',
  async (
    payload: {
      amount: number;
      currency: string;
      userId: string;
      plan: string;
      email?: string;
      phone?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await createPaymentOrder(payload);
      console.log("response api ",response);

      if (!response.success) {
        return rejectWithValue(response.message || 'Payment initiation failed');
      }
      if (response?.orderRef) {
        return {
          orderRef: response.orderRef,
          paymentLink: response.paymentLink,
        };
      }else{

         return {
          paymentLink: response?.paymentLink,
        };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Payment initiation failed');
    }
  },
);

export const checkPaymentStatus = createAsyncThunk(
  'payment/checkStatus',
  async (orderRef: string, { rejectWithValue }) => {
    try {
      const response = await verifyPayment(orderRef);

      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to verify payment');
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Payment verification failed');
    }
  },
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentState(state) {
      state.orderId = undefined;
      state.orderRef = undefined;
      state.paymentLink = undefined;
      state.status = 'idle';
      state.error = undefined;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initiatePayment.pending, state => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.status = 'success';
       
        state.orderRef = action?.payload?.orderRef ?? '';
        state.paymentLink = action?.payload?.paymentLink;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(checkPaymentStatus.pending, state => {
        state.status = 'loading';
      })
      .addCase(checkPaymentStatus.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
