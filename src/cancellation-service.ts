import type { Notifier } from './order-service';
import type { PaymentGateway } from './payment-gateway';

export interface CancellationOrder {
  id: string;
  amount: number;
  email: string;
}

export interface CancellationResult {
  orderId: string;
  amount: number;
  refundId: string;
}

export class OrderCancellationService {
  constructor(
    private readonly payments: PaymentGateway,
    private readonly notifier: Notifier,
  ) {}

  async cancelOrder(order: CancellationOrder): Promise<CancellationResult> {
    if (!Number.isFinite(order.amount) || order.amount <= 0) {
      throw new Error('INVALID_AMOUNT');
    }

    const refund = await this.payments.refund(order.id, order.amount);
    await this.notifier.send(
      order.email,
      `Замовлення ${order.id} скасовано. Повернення ${order.amount} грн, код ${refund.refundId}`,
    );

    return {
      orderId: order.id,
      amount: order.amount,
      refundId: refund.refundId,
    };
  }
}
