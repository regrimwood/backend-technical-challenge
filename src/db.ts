import { FastifyInstance } from "fastify";
import migrate from "../db/migrate";
import mssql from "fastify-mssql";

export default async function dbConnect(server: FastifyInstance) {
  migrate();

  try {
    server.register(mssql, {
      server: "localhost",
      port: 1433,
      user: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
      database: "master",
      options: {
        trustServerCertificate: true,
      },
    });

    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}
