import { FastifyInstance } from "fastify";
import { CartType } from "./cartType";
import { ErrorType } from "../errorType";
import { getDiscounts } from "./cartRepository";

export default async function cartRoutes(server: FastifyInstance) {
  server.get<{ Reply: CartType }>("/", async (request, reply) => {
    const cart = request.session.get("cart");
    if (!cart) {
      return reply.status(200).send([]);
    }
    reply.status(200).send(cart.items);
  });

  // edit the cart
  server.post<{ Body: CartType; Reply: CartType | ErrorType }>(
    "/",
    async (request, reply) => {
      const newCart = request.body;
      request.session.set("cart", { items: newCart });
      reply.status(200).send(newCart);
    }
  );

  server.get("/available-discounts", async (request, reply) => {
    const cart = request.session.get("cart");
    if (!cart) {
      return reply.status(200).send([]);
    }

    const discounts = await getDiscounts(cart.items, server);

    reply.status(200).send(discounts);
  });
}
