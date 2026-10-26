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

  if (orderTotal >= 1000) return 0;
  return weightKg > 5 ? 60 : 50;
}
