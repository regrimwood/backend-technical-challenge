import { FastifyInstance } from "fastify";
import MSSql from "mssql";
import { DiscountsType, DiscountType } from "../utils/types/DiscountType";

export const getDiscountsByPriceIds = async (
  priceIds: number[],
  server: FastifyInstance
) => {
  try {
    const discounts: DiscountsType = [];

    for (const priceId of priceIds) {
      const pool = await server.mssql.pool.connect();
      const query = `
        SELECT
            d.id,
            d.name,
            d.percent_discount AS percentDiscount,
            d.fixed_price AS fixedPrice,
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
            d.percent_discount,
            d.fixed_price;
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
    throw new Error(err?.message ?? "An error occurred");
  }
};

export const getDiscountById = async (
  discountId: number,
  server: FastifyInstance
) => {
  try {
    const pool = await server.mssql.pool.connect();

    const query = `
        SELECT
            d.id,
            d.name,
            d.percent_discount AS percentDiscount,
            d.fixed_price AS fixedPrice,
            (
                SELECT
                    di.price_id AS priceId,
                    di.min_quantity AS minQuantity,
                    di.max_quantity AS maxQuantity
                FROM
                    discount_items di
                WHERE
                    di.discount_id = d.id
                FOR JSON PATH
            ) AS items
        FROM
            discounts d
        WHERE
            d.id = @discountId
        GROUP BY
            d.id,
            d.name,
            d.percent_discount,
            d.fixed_price;
        `;
    const res = await pool
      .request()
      .input("discountId", MSSql.Int, discountId)
      .query(query);

    const discount = res.recordset[0];
    const discountItems = JSON.parse(discount.items);

    return { ...discount, items: discountItems } as DiscountType;
  } catch (err: any) {
    throw new Error(err?.message ?? "An error occurred");
  }
};
