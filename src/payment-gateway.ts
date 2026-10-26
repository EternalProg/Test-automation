export interface RefundReceipt {
  refundId: string;
}

export interface PaymentGateway {
  refund(orderId: string, amount: number): Promise<RefundReceipt>;
}

export class HttpPaymentGateway implements PaymentGateway {
  constructor(private readonly baseUrl: string) {}

  async refund(orderId: string, amount: number): Promise<RefundReceipt> {
    const response = await fetch(new URL('/refund', this.baseUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, amount }),
    });

    if (!response.ok) throw new Error('REFUND_FAILED');

    const data: unknown = await response.json();
    if (
      typeof data !== 'object' ||
      data === null ||
      !('status' in data) ||
      data.status !== 'succeeded' ||
      !('refundId' in data) ||
      typeof data.refundId !== 'string' ||
      data.refundId.length === 0
    ) {
      throw new Error('INVALID_REFUND_RESPONSE');
    }

    return { refundId: data.refundId };
  }
}
