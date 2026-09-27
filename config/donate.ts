export const donateConfig = {
  currency: "USD",
  presets: [3, 5, 10, 25],
  defaultAmount: 5,
  /** bachs minimum for USD is 1.00 */
  minAmount: 1,
  maxAmount: 1000,
} as const;
