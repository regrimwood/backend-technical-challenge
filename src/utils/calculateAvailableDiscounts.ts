import { DiscountType } from "./types/discountType";

export default function calculateAvailableDiscounts(
  priceQuantities: Map<number, number>,
  discounts: DiscountType
) {
  const validDiscounts = [];

  for (const discount of discounts) {
    const isValid = discount.items.every((item) => {
      const quantity = priceQuantities.get(item.priceId);
      if (!quantity) return false;
      return item.minQuantity ? quantity >= item.minQuantity : true;
    });
    if (isValid) validDiscounts.push(discount);
  }

  return validDiscounts;
}
