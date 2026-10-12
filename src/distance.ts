const MILES_PER_KILOMETER = 0.621371;
const KILOMETERS_PER_MILE = 1.609344;

function validateDistance(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('INVALID_DISTANCE');
  }
}

export function kilometersToMiles(kilometers: number): number {
  validateDistance(kilometers);
  return kilometers * MILES_PER_KILOMETER;
}

export function milesToKilometers(miles: number): number {
  validateDistance(miles);
  return miles * KILOMETERS_PER_MILE;
}
