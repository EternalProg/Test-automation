import { describe, it, expect } from 'vitest';
import { applyLoyaltyPoints } from '../src/order';

describe('applyLoyaltyPoints', () => {
  it('списує бали один до одного, коли їх менше за ліміт 30 %', () => {
    expect(applyLoyaltyPoints(1000, 100)).toBeCloseTo(900, 2);
  });

  it('не змінює суму, коли балів нуль', () => {
    expect(applyLoyaltyPoints(1000, 0)).toBeCloseTo(1000, 2);
  });

  it.each([
    { points: 299, expected: 701 },
    { points: 300, expected: 700 },
    { points: 301, expected: 700 },
  ])(
    'межа капу 30 % при сумі 1000: $points балів → до сплати $expected',
    ({ points, expected }) => {
      expect(applyLoyaltyPoints(1000, points)).toBeCloseTo(expected, 2);
    },
  );

  it('обмежує списання лімітом, коли балів значно більше за кап', () => {
    expect(applyLoyaltyPoints(500, 1000)).toBeCloseTo(350, 2);
  });

  it('повертає нуль для нульової суми без балів', () => {
    expect(applyLoyaltyPoints(0, 0)).toBe(0);
  });

  it('повертає нуль для нульової суми навіть за наявності балів', () => {
    expect(applyLoyaltyPoints(0, 200)).toBe(0);
  });

  it('зберігає копійки дробової суми після списання в межах ліміту', () => {
    // 100.55 − 10 = 90.55
    expect(applyLoyaltyPoints(100.55, 10)).toBeCloseTo(90.55, 2);
  });

  it.each([-1, -100, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'відхиляє некоректну кількість балів %s',
    (points) => {
      expect(() => applyLoyaltyPoints(1000, points)).toThrow('INVALID_POINTS');
    },
  );

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    'відхиляє некоректну суму %s',
    (total) => {
      expect(() => applyLoyaltyPoints(total, 10)).toThrow('INVALID_TOTAL');
    },
  );
});
