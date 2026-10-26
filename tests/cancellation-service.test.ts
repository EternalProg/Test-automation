import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderCancellationService } from '../src/cancellation-service';
import type { Notifier } from '../src/order-service';
import { StatefulPaymentGateway } from './fakes/stateful-payment-gateway';

describe('OrderCancellationService — скасування замовлення', () => {
  let payments: StatefulPaymentGateway;
  let notifier: Notifier;
  let service: OrderCancellationService;

  const order = { id: 'ORD-7', amount: 125.5, email: 'client@example.com' };

  beforeEach(() => {
    payments = new StatefulPaymentGateway();
    notifier = { send: vi.fn().mockResolvedValue(undefined) };
    service = new OrderCancellationService(payments, notifier);
  });

  it('повертає кошти та зберігає результат скасування', async () => {
    const result = await service.cancelOrder(order);

    expect(result).toEqual({
      orderId: 'ORD-7',
      amount: 125.5,
      refundId: 'RF-ORD-7',
    });
    expect(payments.refunds).toEqual([{ orderId: 'ORD-7', amount: 125.5 }]);
  });

  it('надсилає лист після успішного повернення коштів', async () => {
    await service.cancelOrder(order);

    expect(notifier.send).toHaveBeenCalledWith(
      'client@example.com',
      expect.stringContaining('RF-ORD-7'),
    );
  });

  it('не надсилає листа, якщо платіжний шлюз відхиляє повернення', async () => {
    const failedPayments = {
      refund: vi.fn().mockRejectedValue(new Error('REFUND_FAILED')),
    };
    const failingService = new OrderCancellationService(
      failedPayments,
      notifier,
    );

    await expect(failingService.cancelOrder(order)).rejects.toThrow(
      'REFUND_FAILED',
    );

    expect(notifier.send).not.toHaveBeenCalled();
  });

  it('передає помилку пошти після успішного повернення', async () => {
    notifier.send = vi.fn().mockRejectedValue(new Error('MAIL_UNAVAILABLE'));
    service = new OrderCancellationService(payments, notifier);

    await expect(service.cancelOrder(order)).rejects.toThrow(
      'MAIL_UNAVAILABLE',
    );

    expect(payments.refunds).toEqual([{ orderId: 'ORD-7', amount: 125.5 }]);
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'відхиляє суму повернення %s до звернення до шлюзу',
    async (amount) => {
      const invalidOrder = { ...order, amount };

      await expect(service.cancelOrder(invalidOrder)).rejects.toThrow(
        'INVALID_AMOUNT',
      );

      expect(payments.refunds).toHaveLength(0);
    },
  );
});
