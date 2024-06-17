import "dotenv/config";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fastify from "fastify";
import secureSession from "@fastify/secure-session";
import dbConnect from "./db";
import cartRoutes from "./cart/cart-routes";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { CartType } from "./cart/cart-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

declare module "@fastify/secure-session" {
  interface SessionData {
    cart: {
      items: CartType;
    };
  }
}

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

server.register(dbConnect);

server.register(secureSession, {
  sessionName: "session",
  cookieName: "session-cookie",
  key: fs.readFileSync(__dirname + "/session-secret-key"),
  cookie: {
    path: "/",
  },
});

server.addHook("preHandler", async (request, reply) => {
  const data = request.session.get("data");
  if (!data) {
    request.session.set("cart", { items: [] });
  }
});

// test
server.get("/ping", async (request, reply) => {
  return { message: "pong" };
});

server.register(cartRoutes, { prefix: "/cart" });

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
