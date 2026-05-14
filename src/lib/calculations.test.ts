import { describe, expect, it } from 'vitest';
import { calculateBudgetTotals } from './calculations';

describe('calculateBudgetTotals', () => {
  it('calculates subtotal, discount, tax and total', () => {
    expect(
      calculateBudgetTotals(
        [
          { description: 'Tinta premium', quantity: 2, unitPrice: 120.5 },
          { description: 'Mão de obra', quantity: 10, unitPrice: 35 },
        ],
        0.1,
        0.05,
      ),
    ).toEqual({
      subtotal: 591,
      discount: 59.1,
      tax: 26.6,
      total: 558.5,
    });
  });
});
