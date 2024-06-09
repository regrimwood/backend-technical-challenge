import fastify, { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import mssql from "fastify-mssql";

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>();

async function dbConnect(server: FastifyInstance) {
  server.register(mssql, {
    server: "localhost",
    port: 1433,
    user: "root",
    password: "root",
    database: "iticket",
  });

  console.log("Connected to database");
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
