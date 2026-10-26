const FREE_DELIVERY_FROM = 1000;
const BASE_WEIGHT_LIMIT = 5;
const BASE_DELIVERY_FEE = 50;
const ADDITIONAL_KG_FEE = 10;

function calcWeightFee(weightKg: number): number {
  const extraKg = Math.ceil(Math.max(0, weightKg - BASE_WEIGHT_LIMIT));
  return BASE_DELIVERY_FEE + extraKg * ADDITIONAL_KG_FEE;
}

export function calcDeliveryFee(
  orderTotal: number,
  weightKg: number,
  _isExpress = false,
): number {
  if (
    !Number.isFinite(orderTotal) ||
    orderTotal < 0 ||
    !Number.isFinite(weightKg) ||
    weightKg < 0
  ) {
    throw new Error('INVALID_DELIVERY_INPUT');
  }

  if (orderTotal >= FREE_DELIVERY_FROM) return 0;
  return calcWeightFee(weightKg);
}
