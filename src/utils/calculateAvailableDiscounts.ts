import { DiscountType, DiscountWithItemsType } from "./types/discountType";

export default function calculateAvailableDiscounts(
  priceQuantities: Map<number, number>,
  discounts: DiscountType
) {
  const groupedDiscounts: DiscountWithItemsType = [];

  for (const discount of discounts) {
    const existingDiscount = groupedDiscounts.find(
      (d) => d.discountId === discount.discount_id
    );

    if (existingDiscount) {
      existingDiscount.items.push({
        priceId: discount.price_id,
        minQuantity: discount.min_quantity,
        maxQuantity: discount.max_quantity,
      });
    } else {
      groupedDiscounts.push({
        discountId: discount.discount_id,
        name: discount.name,
        percentDiscount: discount.percentDiscount,
        fixedPrice: discount.fixedPrice,
        items: [
          {
            priceId: discount.price_id,
            minQuantity: discount.min_quantity,
            maxQuantity: discount.max_quantity,
          },
        ],
      });
    }
  }

  const validDiscounts = [];

  for (const discount of groupedDiscounts) {
    const isValid = discount.items.every((item) => {
      const quantity = priceQuantities.get(item.priceId);
      if (!quantity) return false;
      return item.minQuantity ? quantity >= item.minQuantity : true;
    });
    if (isValid) validDiscounts.push(discount);
  }

  return validDiscounts;
}
