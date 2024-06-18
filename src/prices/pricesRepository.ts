import { FastifyInstance } from "fastify";
import MSSql from "mssql";
import { PriceType } from "../utils/types/PriceType";
import { CartType } from "../utils/types/CartType";
import { getDiscountById } from "../discounts/discountsRepository";

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
  let discount = null;

  if (cart.discountId) {
    try {
      discount = await getDiscountById(cart.discountId, server);
    } catch (err: any) {
      throw new Error(err?.message ?? "An error occurred");
    }
  }

  let fixedPriceToAdd = 0;

  for (const item of cart.items) {
    try {
      const price = await getPrice(item.priceId, server);

      if (discount) {
        const discountItem = discount.items.find(
          (discountItem) => discountItem.priceId === price.id
        );

        if (discountItem) {
          if (discount.percentDiscount) {
            if (
              !discountItem.minQuantity ||
              item.quantity >= discountItem.minQuantity
            ) {
              const noOfApplicableTickets =
                discountItem.maxQuantity ?? item.quantity;
              const discountedPrice =
                price.price * (1 - discount.percentDiscount / 100);
              total += discountedPrice * noOfApplicableTickets;
              total += price.price * (item.quantity - noOfApplicableTickets);
            }
          } else if (discount.fixedPrice) {
            if (
              !discountItem.minQuantity ||
              item.quantity >= discountItem.minQuantity
            ) {
              const noOfApplicableTickets =
                discountItem.maxQuantity ?? item.quantity;
              total += price.price * (item.quantity - noOfApplicableTickets);
              if (fixedPriceToAdd === 0) {
                fixedPriceToAdd = discount.fixedPrice;
              }
            }
          }
        }
      } else {
        total += price.price * item.quantity;
      }
    } catch (err: any) {
      throw new Error(err?.message ?? "An error occurred");
    }
  }

  total += fixedPriceToAdd;
  return total;
};
