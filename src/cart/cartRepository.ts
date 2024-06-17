import { FastifyInstance } from "fastify";
import MSSql from "mssql";
import { DiscountType } from "../utils/types/discountType";

export const getDiscounts = async (
  priceIds: number[],
  server: FastifyInstance
) => {
  try {
    const discounts: DiscountType = [];

    for (const priceId of priceIds) {
      const pool = await server.mssql.pool.connect();
      const query = `
        SELECT di.*, d.* 
        FROM discount_items di 
        JOIN discounts d ON di.discount_id = d.id
        WHERE di.price_id = @priceId
      `;

      const res = await pool
        .request()
        .input("priceId", MSSql.Int, priceId)
        .query(query);

      discounts.push(...res.recordset);
    }

    return discounts;
  } catch (err: any) {
    return { error: err?.message ?? "An error occurred" };
  }
};
