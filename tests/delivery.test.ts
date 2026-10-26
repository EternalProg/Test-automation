import { describe, expect, it } from 'vitest';
import { calcDeliveryFee } from '../src/delivery';

describe('calcDeliveryFee: перевірка вхідних даних', () => {
  it.each([
    { orderTotal: -1, weightKg: 1 },
    { orderTotal: 100, weightKg: -0.1 },
    { orderTotal: Number.NaN, weightKg: 1 },
    { orderTotal: 100, weightKg: Number.POSITIVE_INFINITY },
  ])(
    'відхиляє суму $orderTotal грн і вагу $weightKg кг',
    ({ orderTotal, weightKg }) => {
      expect(() => calcDeliveryFee(orderTotal, weightKg)).toThrow(
        'INVALID_DELIVERY_INPUT',
      );
    },
  );
});
