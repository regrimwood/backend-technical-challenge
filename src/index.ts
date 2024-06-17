import "dotenv/config";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Fastify from "fastify";
import secureSession from "@fastify/secure-session";
import dbConnect from "./db";
import cartRoutes from "./cart/cartRoutes";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { CartType } from "./utils/types/cartType";

const __dirname = dirname(fileURLToPath(import.meta.url));

declare module "@fastify/secure-session" {
  interface SessionData {
    cart: {
      items: CartType;
    };
  }
}

const server = Fastify().withTypeProvider<TypeBoxTypeProvider>();

dbConnect(server);

server.register(secureSession, {
  sessionName: "session",
  cookieName: "session-cookie",
  key: fs.readFileSync(__dirname + "/session-secret-key"),
  cookie: {
    path: "/",
  },
});

server.addHook("preHandler", async (request, reply) => {
  const cart = request.session.get("cart");

  if (!cart) {
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
