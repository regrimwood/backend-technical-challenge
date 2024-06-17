import { Static, Type } from "@sinclair/typebox";

export const Cart = Type.Array(
  Type.Object({
    eventId: Type.Number(),
    priceId: Type.Number(),
    quantity: Type.Number(),
  })
);

export type CartType = Static<typeof Cart>;
