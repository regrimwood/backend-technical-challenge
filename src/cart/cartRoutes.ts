import { FastifyInstance } from "fastify";
import Ajv from "ajv";
import { Cart, CartType } from "../utils/types/CartType";
import { ErrorType } from "../utils/types/ErrorType";
import { getDiscountsByPriceIds } from "../discounts/discountsRepository";
import calculateAvailableDiscounts from "../utils/calculateAvailableDiscounts";
import { DiscountsType } from "../utils/types/DiscountType";
import getCartQuantities from "../utils/getCartQuantities";
import { calculateTotal, getPrice } from "../prices/pricesRepository";

const ajv = new Ajv();

const validateCart = ajv.compile(Cart);

export default async function cartRoutes(server: FastifyInstance) {
  // get the cart
  server.get<{ Reply: CartType }>("/", async (request, reply) => {
    const cart = request.session.get("cart");
    if (!cart) {
      return reply.status(200).send({ items: [], discountId: null, total: 0 });
    }
    reply.status(200).send(cart);
  });

  // edit the cart
  server.post<{ Body: CartType; Reply: CartType | ErrorType }>(
    "/",
    async (request, reply) => {
      const newCart = request.body;
      const isValid = validateCart(newCart);

      if (!isValid) {
        return reply.status(400).send({ message: "Invalid cart" });
      }

      try {
        if (newCart.discountId) {
          const discounts = await getDiscountsByPriceIds(
            newCart.items.map((item) => item.priceId),
            server
          );

          const validDiscounts = calculateAvailableDiscounts(
            getCartQuantities(newCart),
            discounts
          );

          if (
            !validDiscounts.find(
              (discount) => discount.id === newCart.discountId
            )
          ) {
            newCart.discountId = null;
          }
        }

        const total = await calculateTotal(newCart, server);

        newCart.total = total;

        request.session.set("cart", newCart);
        reply.status(200).send(newCart);
      } catch (err: any) {
        return reply
          .status(500)
          .send({ message: err?.message ?? "An error occurred" });
      }
    }
  );

  // get valid discounts
  server.get<{ Reply: DiscountsType | ErrorType }>(
    "/available-discounts",
    async (request, reply) => {
      const cart = request.session.get("cart");

      if (!cart) {
        return reply.status(200).send([]);
      }

      try {
        const priceQuantities = getCartQuantities(cart);

        const priceIds = Array.from(priceQuantities.keys());

        const discounts = await getDiscountsByPriceIds(priceIds, server);

        const validDiscounts = calculateAvailableDiscounts(
          priceQuantities,
          discounts
        );

        reply.status(200).send(validDiscounts);
      } catch (err: any) {
        return reply
          .status(500)
          .send({ message: err?.message ?? "An error occurred" });
      }
    }
  );
}
