export interface PayPalPaymentRequest {
  nft_id: string;
  paypal_order_id: string;
  amount: number;
  currency: string;
  payer_details: any;
}

export interface UPIQRRequest {
  nft_id: string;
  amount: number;
  currency: string;
  email: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transaction_id: string;
  amount: number;
  currency: string;
  payment_method: 'paypal' | 'upi';
  created_at: string;
  updated_at: string;
  nft_id: string;
  user_id: string;
}

export interface PaymentHistoryResponse {
  transactions: PaymentStatusResponse[];
}

export interface UPIQRResponse {
  transaction_id: string;
  qr_image_url: string;
  upi_id: string;
  expires_at: string;
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const paymentApi = {
  /**
   * Process PayPal payment
   */
  async processPayPal(
    paymentData: PayPalPaymentRequest,
    token: string
  ): Promise<{ success: boolean; transaction_id: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/payment/paypal/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'PayPal payment processing failed');
    }

    return response.json();
  },

  /**
   * Generate UPI QR code
   */
  async generateUPIQR(
    qrData: UPIQRRequest,
    token: string
  ): Promise<UPIQRResponse> {
    const response = await fetch(`${API_BASE_URL}/payment/upi/generate-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(qrData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate UPI QR code');
    }

    return response.json();
  },

  /**
   * Check payment status
   */
  async getPaymentStatus(
    transactionId: string,
    token: string
  ): Promise<PaymentStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/payment/status/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment status: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get user payment history
   */
  async getPaymentHistory(token: string): Promise<PaymentHistoryResponse> {
    const response = await fetch(`${API_BASE_URL}/payment/history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment history: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Cancel payment
   */
  async cancelPayment(
    transactionId: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/payment/cancel/${transactionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to cancel payment');
    }

    return response.json();
  },

  /**
   * Verify UPI payment manually (if needed)
   */
  async verifyUPIPayment(
    transactionId: string,
    utrNumber: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/payment/upi/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        utr_number: utrNumber,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'UPI payment verification failed');
    }

    return response.json();
  },

  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<{
    paypal: { enabled: boolean; currencies: string[] };
    upi: { enabled: boolean; currencies: string[] };
  }> {
    const response = await fetch(`${API_BASE_URL}/payment/methods`);

    if (!response.ok) {
      throw new Error(`Failed to fetch payment methods: ${response.statusText}`);
    }

    return response.json();
  },
};
