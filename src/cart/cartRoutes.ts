import { FastifyInstance } from "fastify";
import addFormats from "ajv-formats";
import Ajv from "ajv";
import { Cart, CartType } from "../utils/types/cartType";
import { ErrorType } from "../utils/types/errorType";
import { getDiscountsByPriceIds } from "./cartRepository";
import calculateAvailableDiscounts from "../utils/calculateAvailableDiscounts";

const ajv = addFormats(new Ajv({}), [
  "date-time",
  "time",
  "date",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri",
  "uri-reference",
  "uuid",
  "uri-template",
  "json-pointer",
  "relative-json-pointer",
  "regex",
]);

const validateCart = ajv.compile(Cart);

export default async function cartRoutes(server: FastifyInstance) {
  // get the cart
  server.get<{ Reply: CartType }>("/", async (request, reply) => {
    const cart = request.session.get("cart");
    if (!cart) {
      return reply.status(200).send([]);
    }
    reply.status(200).send(cart.items);
  });

  // edit the cart
  server.post<{ Body: CartType; Reply: CartType | ErrorType | boolean }>(
    "/",
    async (request, reply) => {
      const newCart = request.body;
      const isValid = validateCart(newCart);

      if (!isValid) {
        return reply.status(400).send({ message: "Invalid cart" });
      }

      request.session.set("cart", { items: newCart });
      reply.status(200).send(newCart);
    }
  );

  // get valid discounts
  server.get("/available-discounts", async (request, reply) => {
    const cart = request.session.get("cart");

    if (!cart) {
      return reply.status(200).send([]);
    }

    const priceQuantities = new Map<number, number>();

    cart.items.forEach((item) => {
      const existingQuantity = priceQuantities.get(item.priceId);
      if (existingQuantity) {
        priceQuantities.set(item.priceId, existingQuantity + item.quantity);
      } else {
        priceQuantities.set(item.priceId, item.quantity);
      }
    });

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
  });
}
