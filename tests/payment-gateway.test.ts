import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { HttpPaymentGateway } from '../src/payment-gateway';
import { PAYMENT_URL, server } from './msw/server';

const gateway = new HttpPaymentGateway('https://payments.example.com');

describe('HttpPaymentGateway — перехоплення HTTP через MSW', () => {
  it('надсилає POST із даними замовлення та повертає підтвердження', async () => {
    let capturedMethod: string | undefined;
    let capturedBody: unknown;
    server.use(
      http.post(PAYMENT_URL, async ({ request }) => {
        capturedMethod = request.method;
        capturedBody = await request.json();
        return HttpResponse.json({
          status: 'succeeded',
          refundId: 'RF-900',
        });
      }),
    );

    await expect(gateway.refund('ORD-900', 240.5)).resolves.toEqual({
      refundId: 'RF-900',
    });
    expect(capturedMethod).toBe('POST');
    expect(capturedBody).toEqual({ orderId: 'ORD-900', amount: 240.5 });
  });

  it('відхиляє відповідь шлюзу зі статусом 503', async () => {
    server.use(
      http.post(PAYMENT_URL, () => new HttpResponse(null, { status: 503 })),
    );

    await expect(gateway.refund('ORD-901', 100)).rejects.toThrow(
      'REFUND_FAILED',
    );
  });

  it('відхиляє відповідь з відсутнім або некоректним кодом повернення', async () => {
    server.use(
      http.post(PAYMENT_URL, () =>
        HttpResponse.json({ status: 'succeeded', refundId: 42 }),
      ),
    );

    await expect(gateway.refund('ORD-902', 100)).rejects.toThrow(
      'INVALID_REFUND_RESPONSE',
    );
  });

  it('передає мережеву помилку платіжного шлюзу', async () => {
    server.use(http.post(PAYMENT_URL, () => HttpResponse.error()));

    await expect(gateway.refund('ORD-903', 100)).rejects.toThrow();
  });
});
