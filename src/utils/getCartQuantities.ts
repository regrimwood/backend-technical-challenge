import { CartType } from "./types/CartType";

export default function getCartQuantities(cart: CartType) {
  const priceQuantities = new Map<number, number>();

  cart.items.forEach((item) => {
    const existingQuantity = priceQuantities.get(item.priceId);
    if (existingQuantity) {
      priceQuantities.set(item.priceId, existingQuantity + item.quantity);
    } else {
      priceQuantities.set(item.priceId, item.quantity);
    }
  });

  return priceQuantities;
}
