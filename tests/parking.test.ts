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

describe('calcParkingFee: добове обмеження', () => {
  it.each([
    { minutes: 540, expected: 190 },
    { minutes: 600, expected: 200 },
    { minutes: 1440, expected: 200 },
  ])(
    'обмежує плату для $minutes хвилин до $expected грн',
    ({ minutes, expected }) => {
      expect(calcParkingFee(minutes)).toBe(expected);
    },
  );
});

describe('calcParkingFee: нічний тариф', () => {
  it.each([
    { minutes: 60, expected: 15 },
    { minutes: 121, expected: 35 },
    { minutes: 600, expected: 100 },
  ])(
    'зменшує тариф за $minutes хвилин до $expected грн',
    ({ minutes, expected }) => {
      expect(calcParkingFee(minutes, { night: true })).toBeCloseTo(expected, 2);
    },
  );
});

describe('calcParkingFee: вихідний тариф', () => {
  it.each([
    { options: { weekend: true }, expected: 160 },
    { options: { night: true, weekend: true }, expected: 80 },
  ])('застосовує вихідну знижку до $expected грн', ({ options, expected }) => {
    expect(calcParkingFee(600, options)).toBeCloseTo(expected, 2);
  });
});
