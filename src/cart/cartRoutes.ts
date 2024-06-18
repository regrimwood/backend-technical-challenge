import { FastifyInstance } from "fastify";
import Ajv from "ajv";
import { Cart, CartType } from "../utils/types/cartType";
import { ErrorType } from "../utils/types/errorType";
import { getDiscountsByPriceIds } from "./cartRepository";
import calculateAvailableDiscounts from "../utils/calculateAvailableDiscounts";
import { DiscountType } from "../utils/types/discountType";
import getCartQuantities from "../utils/getCartQuantities";

const ajv = new Ajv();

const validateCart = ajv.compile(Cart);

export default async function cartRoutes(server: FastifyInstance) {
  // get the cart
  server.get<{ Reply: CartType }>("/", async (request, reply) => {
    const cart = request.session.get("cart");
    if (!cart) {
      return reply.status(200).send({ items: [], discountId: null });
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

      if (newCart.discountId) {
        const discounts = await getDiscountsByPriceIds(
          newCart.items.map((item) => item.priceId),
          server
        );

        if ("error" in discounts || !discounts) {
          return reply.status(500).send({ message: discounts.error });
        }

        const validDiscounts = calculateAvailableDiscounts(
          getCartQuantities(newCart),
          discounts
        );

        if (
          !validDiscounts.find((discount) => discount.id === newCart.discountId)
        ) {
          newCart.discountId = null;
        }
      }

      request.session.set("cart", newCart);
      reply.status(200).send(newCart);
    }
  );

  // get valid discounts
  server.get<{ Reply: DiscountType | ErrorType }>(
    "/available-discounts",
    async (request, reply) => {
      const cart = request.session.get("cart");

      if (!cart) {
        return reply.status(200).send([]);
      }

      const priceQuantities = getCartQuantities(cart);

      const priceIds = Array.from(priceQuantities.keys());

      const discounts = await getDiscountsByPriceIds(priceIds, server);

      if ("error" in discounts || !discounts) {
        return reply.status(500).send({ message: discounts.error });
      }

      const validDiscounts = calculateAvailableDiscounts(
        priceQuantities,
        discounts
      );

      reply.status(200).send(validDiscounts);
    }
  );
}
