import { Static, Type } from "@sinclair/typebox";

export const Price = Type.Object({
  id: Type.Number(),
  price: Type.Number(),
  type: Type.String(),
  eventId: Type.Number(),
});

export type PriceType = Static<typeof Price>;
