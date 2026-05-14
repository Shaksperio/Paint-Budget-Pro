export type BudgetLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type BudgetTotals = {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
};

const roundCurrency = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateBudgetTotals(
  items: BudgetLineItem[],
  discountRate = 0,
  taxRate = 0,
): BudgetTotals {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discount = subtotal * discountRate;
  const taxableBase = subtotal - discount;
  const tax = taxableBase * taxRate;

  return {
    subtotal: roundCurrency(subtotal),
    discount: roundCurrency(discount),
    tax: roundCurrency(tax),
    total: roundCurrency(taxableBase + tax),
  };
}
