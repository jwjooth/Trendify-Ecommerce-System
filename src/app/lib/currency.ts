export const formatCurrency = (
  amount: number,
  currency: string = "USD",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateTax = (
  subtotal: number,
  taxRate: number = 0.08,
): number => {
  return subtotal * taxRate;
};

export const calculateShipping = (subtotal: number): number => {
  if (subtotal >= 100) return 0;
  return 9.99;
};

export const calculateTotal = (
  subtotal: number,
  tax: number,
  shipping: number,
): number => {
  return subtotal + tax + shipping;
};
