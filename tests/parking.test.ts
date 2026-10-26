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

describe('calcParkingFee: перша година', () => {
  it.each([16, 30, 60])('стягує 30 грн за %i хвилин', (minutes) => {
    expect(calcParkingFee(minutes)).toBe(30);
  });
});

describe('calcParkingFee: розпочаті додаткові години', () => {
  it.each([
    { minutes: 61, expected: 50 },
    { minutes: 120, expected: 50 },
    { minutes: 121, expected: 70 },
    { minutes: 180, expected: 70 },
  ])(
    'тривалість $minutes хвилин коштує $expected грн',
    ({ minutes, expected }) => {
      expect(calcParkingFee(minutes)).toBe(expected);
    },
  );
});
