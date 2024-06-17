import { Static, Type } from "@sinclair/typebox";

export const Discount = Type.Array(
  Type.Object({
    id: Type.Number(),
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

export type DiscountType = Static<typeof Discount>;
