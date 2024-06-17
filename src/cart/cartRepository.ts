import { FastifyInstance } from "fastify";
import { CartType } from "./cartType";
import MSSql from "mssql";

export const getDiscounts = async (cart: CartType, server: FastifyInstance) => {
  try {
    const discounts = [];

    for (const item of cart) {
      const pool = await server.mssql.pool.connect();
      const query = "SELECT * FROM discount_items WHERE price_id = @priceId";

      const res = await pool
        .request()
        .input("priceId", MSSql.Int, item.priceId)
        .query(query);

      discounts.push(res.recordset);
    }

    return discounts;
  } catch (err: any) {
    return { error: err?.message ?? "An error occurred" };
  }
};
