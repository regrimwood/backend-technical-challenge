import "dotenv/config";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fastify, { FastifyInstance } from "fastify";
import secureSession from "@fastify/secure-session";
import mssql from "fastify-mssql";
import migrate from "./db/migrate.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

declare module "@fastify/secure-session" {
  interface SessionData {
    data: string;
  }
}

const server = fastify();

async function dbConnect(server: FastifyInstance) {
  migrate();

  try {
    server.register(mssql, {
      server: "localhost",
      port: 1433,
      user: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
      database: "master",
    });

    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}

server.register(dbConnect);

server.register(secureSession, {
  sessionName: "session",
  cookieName: "session-cookie",
  key: fs.readFileSync(__dirname + "/secret-key"),
  cookie: {
    path: "/",
  },
});

server.addHook("preHandler", async (request, reply) => {
  const data = request.session.get("data");
  if (!data) {
    request.session.set("data", "hello");
  }
});

async function apiRoutes(server: FastifyInstance) {
  server.get("/ping", async (request, reply) => {
    return request.session.get("data");
  });
}

server.register(apiRoutes, { prefix: "/api" });

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
