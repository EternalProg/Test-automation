import { describe, expect, it } from 'vitest';
import { kilometersToMiles, milesToKilometers } from '../src/distance';

describe('перетворення кілометрів і миль', () => {
  it('перетворює один кілометр у 0.621371 милі', () => {
    expect(kilometersToMiles(1)).toBeCloseTo(0.621371, 6);
  });

  it('перетворює одну милю в 1.609344 кілометра', () => {
    expect(milesToKilometers(1)).toBeCloseTo(1.609344, 10);
  });

  it('перетворює нульову відстань у нуль в обох напрямках', () => {
    expect(kilometersToMiles(0)).toBe(0);
    expect(milesToKilometers(0)).toBe(0);
  });

  it('працює з дробовими додатними значеннями', () => {
    expect(kilometersToMiles(5.5)).toBeCloseTo(3.4175405, 6);
    expect(milesToKilometers(3.1)).toBeCloseTo(4.9889664, 6);
  });

  it('відхиляє від’ємні кілометри та милі', () => {
    expect(() => kilometersToMiles(-1)).toThrow('INVALID_DISTANCE');
    expect(() => milesToKilometers(-1)).toThrow('INVALID_DISTANCE');
  });

  it('відхиляє нескінченність і NaN як некоректні відстані', () => {
    expect(() => kilometersToMiles(Number.POSITIVE_INFINITY)).toThrow(
      'INVALID_DISTANCE',
    );
    expect(() => milesToKilometers(Number.NaN)).toThrow('INVALID_DISTANCE');
  });
});
