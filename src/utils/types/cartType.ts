import { Static, Type } from "@sinclair/typebox";

export const Cart = Type.Object({
  items: Type.Array(
    Type.Object({
      eventId: Type.Number(),
      priceId: Type.Number(),
      quantity: Type.Number(),
    })
  ),
  discountId: Type.Union([Type.Number(), Type.Null()]),
});

export type CartType = Static<typeof Cart>;
