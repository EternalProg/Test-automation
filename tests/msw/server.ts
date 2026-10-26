import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const RATE_URL = 'https://api.example.com/rate';
export const PAYMENT_URL = 'https://payments.example.com/refund';

export const handlers = [
  http.get(RATE_URL, () => HttpResponse.json({ rate: 41.25 })),
  http.post(PAYMENT_URL, () =>
    HttpResponse.json({ status: 'succeeded', refundId: 'RF-DEFAULT' }),
  ),
];

export const server = setupServer(...handlers);
