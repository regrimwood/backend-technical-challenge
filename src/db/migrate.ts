import { dirname } from "path";
import { fileURLToPath } from "url";
import mssql from "mssql";
import Postgrator from "postgrator";

const __dirname = dirname(fileURLToPath(import.meta.url));

const sqlConfig = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  database: "master",
  server: "localhost",
  options: {
    trustServerCertificate: true, // for dev
  },
};

export default async function migrate() {
  const pool = await mssql.connect(sqlConfig);

  try {
    const postgrator = new Postgrator({
      driver: "mssql",
      migrationPattern: __dirname + "/migrations/*",
      database: "master",
      schemaTable: "schemaversion",
      currentSchema: "public",
      execQuery: (query: string) => {
        return pool
          .request()
          .query(query)
          .then((result) => ({ rows: result.recordset }));
      },
    });

    const result = await postgrator.migrate();

    if (result.length === 0) {
      console.log("No migrations found.");
    }

    console.log("Migration done.");

    process.exitCode = 0;
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
  }

  await pool.close();
}
