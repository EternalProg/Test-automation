import { describe, expect, it } from 'vitest';
import { celsiusToFahrenheit } from '../src/temperature';

describe('celsiusToFahrenheit', () => {
  it('перетворює нуль градусів на 32 градуси за Фаренгейтом', () => {
    const celsius = 0;

    const result = celsiusToFahrenheit(celsius);

    expect(result).toBe(32);
  });

  it('перетворює 100 градусів на 212 градусів за Фаренгейтом', () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it('зберігає особливе значення мінус 40 градусів', () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  it('відхиляє нечислову температуру', () => {
    expect(() => celsiusToFahrenheit(Number.NaN)).toThrow(
      'INVALID_TEMPERATURE',
    );
  });
});
