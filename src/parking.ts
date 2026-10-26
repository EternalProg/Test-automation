export interface ParkingOptions {
  night?: boolean;
  weekend?: boolean;
}

const FREE_MINUTES = 15;
const FIRST_HOUR_FEE = 30;
const EXTRA_HOUR_FEE = 20;

function calcBaseFee(minutes: number): number {
  if (minutes <= FREE_MINUTES) return 0;
  if (minutes <= 60) return FIRST_HOUR_FEE;

  const extraHours = Math.ceil((minutes - 60) / 60);
  return FIRST_HOUR_FEE + extraHours * EXTRA_HOUR_FEE;
}

export function calcParkingFee(
  minutes: number,
  _options: ParkingOptions = {},
): number {
  if (!Number.isInteger(minutes) || minutes < 0) {
    throw new Error('INVALID_DURATION');
  }

  return calcBaseFee(minutes);
}
