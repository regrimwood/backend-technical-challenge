import { DiscountsType } from "./types/DiscountType";

export default function calculateAvailableDiscounts(
  priceQuantities: Map<number, number>,
  discounts: DiscountsType
) {
  const validDiscounts = [];

  for (const discount of discounts) {
    // each discountItem acts as a condition for the cart to fulfill
    const isValid = discount.items.every((item) => {
      const quantity = priceQuantities.get(item.priceId);
      if (!quantity) return false;
      return item.minQuantity ? quantity >= item.minQuantity : true;
    });
    if (isValid) validDiscounts.push(discount);
  }

  return validDiscounts;
}
