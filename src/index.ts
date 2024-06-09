import "dotenv/config";
import fastify, { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import mssql from "fastify-mssql";
import migrate from "./db/migrate.js";

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>();

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

async function apiRoutes(server: FastifyInstance) {
  server.get("/ping", async (request, reply) => {
    return "pong\n";
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
