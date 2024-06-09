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
    encrypt: false,
    trustServerCertificate: true,
  },
  requestTimeout: 15000,
  connectionTimeout: 15000,
  pool: {
    max: 1,
    min: 1,
  },
};

export default async function migrate() {
  const pool = await mssql.connect(sqlConfig);

  try {
    const postgrator = new Postgrator({
      driver: "mssql",
      migrationPattern: __dirname + "/migrations/*",
      database: "master",
      execQuery: (query: string) => {
        return pool
          .request()
          .query(query)
          .then((result) => ({ rows: result?.recordset ?? result }));
      },
    });

    const result = await postgrator.migrate();

    if (result.length === 0) {
      console.log("No new migrations found.");
    }

    console.log("Migration done.");

    process.exitCode = 0;
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
  }

  await pool.close();
}
