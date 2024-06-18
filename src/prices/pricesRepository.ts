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
    throw new Error(err?.message ?? "An error occurred");
  }
};

export const calculateTotal = async (
  cart: CartType,
  server: FastifyInstance
) => {
  let total = 0;

  for (const item of cart.items) {
    try {
      const price = await getPrice(item.priceId, server);
      total += price.price * item.quantity;
    } catch (err: any) {
      throw new Error(err?.message ?? "An error occurred");
    }
  }

  return total;
};
