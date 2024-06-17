import { FastifyInstance } from "fastify";
import { CartType } from "./cart-types";

export default async function cartRoutes(server: FastifyInstance) {
  server.get<{ Reply: CartType }>("/", async (request, reply) => {
    const cart = request.session.get("cart");
    if (!cart) {
      return reply.status(200).send([]);
    }
    reply.status(200).send(cart.items);
  });
}
