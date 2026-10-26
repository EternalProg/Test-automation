import type { PaymentGateway, RefundReceipt } from '../../src/payment-gateway';

export interface RecordedRefund {
  orderId: string;
  amount: number;
}

export class StatefulPaymentGateway implements PaymentGateway {
  readonly refunds: RecordedRefund[] = [];

  async refund(orderId: string, amount: number): Promise<RefundReceipt> {
    this.refunds.push({ orderId, amount });
    return { refundId: `RF-${orderId}` };
  }
}
