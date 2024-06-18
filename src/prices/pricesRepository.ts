import { FastifyInstance } from "fastify";
import MSSql from "mssql";
import { PriceType } from "../utils/types/priceType";
import { CartType } from "../utils/types/cartType";

export const getPrice = async (priceId: number, server: FastifyInstance) => {
  try {
    const pool = await server.mssql.pool.connect();

    const query = `
      SELECT
          *
      FROM
          prices p
      WHERE
          p.id = @priceId;
    `;
    const res = await pool
      .request()
      .input("priceId", MSSql.Int, priceId)
      .query(query);

    return res.recordset[0] as PriceType;
  } catch (err: any) {
    return { error: err?.message ?? "An error occurred" };
  }
};

export const calculateTotal = async (
  cart: CartType,
  server: FastifyInstance
) => {
  let total = 0;

  for (const item of cart.items) {
    const price = await getPrice(item.priceId, server);
    if ("error" in price || !price) {
      throw new Error(price.error);
    }
    total += price.price * item.quantity;
  }

  return total;
};
