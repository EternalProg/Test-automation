import { describe, expect, it } from 'vitest';
import { calcParkingFee } from '../src/parking';

describe('calcParkingFee: перевірка тривалості', () => {
  it.each([-1, -60, 10.5])('відхиляє тривалість %s', (minutes) => {
    expect(() => calcParkingFee(minutes)).toThrow('INVALID_DURATION');
  });
});

describe('calcParkingFee: безкоштовний час', () => {
  it.each([0, 1, 15])('не стягує плату за %i хвилин', (minutes) => {
    expect(calcParkingFee(minutes)).toBe(0);
  });
});
