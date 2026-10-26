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

describe('calcDeliveryFee: безкоштовний поріг замовлення', () => {
  it.each([
    { orderTotal: 999, expected: 50 },
    { orderTotal: 1000, expected: 0 },
    { orderTotal: 1001, expected: 0 },
  ])(
    'замовлення на $orderTotal грн має доставку $expected грн',
    ({ orderTotal, expected }) => {
      expect(calcDeliveryFee(orderTotal, 5)).toBeCloseTo(expected, 2);
    },
  );
});

describe('calcDeliveryFee: межа базової ваги', () => {
  it.each([
    { weightKg: 4.99, expected: 50 },
    { weightKg: 5, expected: 50 },
    { weightKg: 5.01, expected: 60 },
  ])(
    'вага $weightKg кг тарифікується як $expected грн',
    ({ weightKg, expected }) => {
      expect(calcDeliveryFee(999, weightKg)).toBeCloseTo(expected, 2);
    },
  );
});

describe('calcDeliveryFee: кожен розпочатий кілограм', () => {
  it.each([
    { weightKg: 5.99, expected: 60 },
    { weightKg: 6, expected: 60 },
    { weightKg: 6.01, expected: 70 },
  ])('вага $weightKg кг має тариф $expected грн', ({ weightKg, expected }) => {
    expect(calcDeliveryFee(999, weightKg)).toBeCloseTo(expected, 2);
  });
});

describe('calcDeliveryFee: максимум звичайного тарифу', () => {
  it.each([
    { weightKg: 30, expected: 300 },
    { weightKg: 30.01, expected: 300 },
    { weightKg: 40, expected: 300 },
  ])(
    'обмежує тариф для ваги $weightKg кг до $expected грн',
    ({ weightKg, expected }) => {
      expect(calcDeliveryFee(999, weightKg)).toBeCloseTo(expected, 2);
    },
  );
});

describe('calcDeliveryFee: експрес-доставка', () => {
  it.each([
    { orderTotal: 999, weightKg: 2, expected: 100 },
    { orderTotal: 999, weightKg: 30.01, expected: 600 },
    { orderTotal: 1000, weightKg: 10, expected: 0 },
  ])(
    'замовлення $orderTotal грн, вага $weightKg кг → $expected грн',
    ({ orderTotal, weightKg, expected }) => {
      expect(calcDeliveryFee(orderTotal, weightKg, true)).toBeCloseTo(
        expected,
        2,
      );
    },
  );
});
