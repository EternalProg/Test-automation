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
  const extraKg = Math.ceil(Math.max(0, weightKg - 5));
  return 50 + extraKg * 10;
}
