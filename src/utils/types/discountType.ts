import { Static, Type } from "@sinclair/typebox";

export const Discount = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  percentDiscount: Type.Optional(Type.Number()),
  fixedPrice: Type.Optional(Type.Number()),
  items: Type.Array(
    Type.Object({
      priceId: Type.Number(),
      minQuantity: Type.Optional(Type.Number()),
      maxQuantity: Type.Optional(Type.Number()),
    })
  ),
});

export type DiscountType = Static<typeof Discount>;

export const DiscountsType = Type.Array(Discount);

export type DiscountsType = Static<typeof DiscountsType>;
