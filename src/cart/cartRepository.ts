import { FastifyInstance } from "fastify";
import MSSql from "mssql";
import { DiscountType } from "../utils/types/discountType";

export const getDiscountsByPriceIds = async (
  priceIds: number[],
  server: FastifyInstance
) => {
  try {
    const discounts: DiscountType = [];

    for (const priceId of priceIds) {
      const pool = await server.mssql.pool.connect();
      const query = `
        SELECT
            d.id,
            d.name,
            d.percentDiscount,
            d.fixedPrice,
            (
                SELECT
                    di.price_id AS priceId,
                    di.min_quantity AS minQuantity,
                    di.max_quantity AS maxQuantity
                FROM
                    discount_items di
                WHERE
                    di.discount_id = d.id
                    AND di.price_id = @priceId
                FOR JSON PATH
            ) AS items
        FROM
            discounts d
        WHERE
            EXISTS (
                SELECT 1
                FROM discount_items di
                WHERE di.discount_id = d.id
                AND di.price_id = @priceId
            )
        GROUP BY
            d.id,
            d.name,
            d.percentDiscount,
            d.fixedPrice;
      `;

      const res = await pool
        .request()
        .input("priceId", MSSql.Int, priceId)
        .query(query);

      for (const record of res.recordset) {
        if (!discounts.find((d) => d.id === record.id)) {
          discounts.push({
            id: record.id,
            name: record.name,
            percentDiscount: record.percentDiscount,
            fixedPrice: record.fixedPrice,
            items: JSON.parse(record.items),
          });
        }
      }
    }

    return discounts;
  } catch (err: any) {
    return { error: err?.message ?? "An error occurred" };
  }
};
