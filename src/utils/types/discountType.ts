import { Static, Type } from "@sinclair/typebox";

export const DiscountType = Type.Array(
  Type.Object({
    discount_id: Type.Number(),
    price_id: Type.Number(),
    min_quantity: Type.Number(),
    max_quantity: Type.Number(),
    name: Type.String(),
    percentDiscount: Type.Optional(Type.Number()),
    fixedPrice: Type.Optional(Type.Number()),
  })
);

export type DiscountType = Static<typeof DiscountType>;

export const DiscountWithItemsType = Type.Array(
  Type.Object({
    discountId: Type.Number(),
    name: Type.String(),
    percentDiscount: Type.Optional(Type.Number()),
    fixedPrice: Type.Optional(Type.Number()),
    items: Type.Array(
      Type.Object({
        priceId: Type.Number(),
        minQuantity: Type.Number(),
        maxQuantity: Type.Number(),
      })
    ),
  })
);

export type DiscountWithItemsType = Static<typeof DiscountWithItemsType>;
