import { FastifyInstance } from "fastify";
import MSSql from "mssql";
import { PriceType } from "../utils/types/PriceType";
import { CartType } from "../utils/types/CartType";
import { getDiscountById } from "../discounts/discountsRepository";
import getCartQuantities from "../utils/getCartQuantities";

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

// so far, this only handles one discount per cart
export const calculateTotal = async (
  cart: CartType,
  server: FastifyInstance
) => {
  let total = 0;
  let discount = null;
  let fixedPriceToAdd = 0;

  if (cart.discountId) {
    try {
      discount = await getDiscountById(cart.discountId, server);
    } catch (err: any) {
      throw new Error(err?.message ?? "An error occurred");
    }
  }

  // get the quantities of each price type in the cart
  const priceQuantities = getCartQuantities(cart);

  for (const key of priceQuantities.keys()) {
    try {
      const price = await getPrice(key, server);
      const quantity = priceQuantities.get(key);
      if (!quantity) continue;

      if (discount) {
        const discountItem = discount.items.find(
          (discountItem) => discountItem.priceId === price.id
        );

        if (discountItem) {
          if (discount.percentDiscount) {
            if (
              !discountItem.minQuantity ||
              quantity >= discountItem.minQuantity
            ) {
              // find how many tickets are applicable for the discount
              // then apply discount to those tickets and add to total
              // then add the remaining tickets without discount to total
              const noOfApplicableTickets =
                discountItem.maxQuantity ?? quantity;
              const discountedPrice =
                price.price * (1 - discount.percentDiscount / 100);
              total += discountedPrice * noOfApplicableTickets;
              total += price.price * (quantity - noOfApplicableTickets);
            }
          } else if (discount.fixedPrice) {
            if (
              !discountItem.minQuantity ||
              quantity >= discountItem.minQuantity
            ) {
              // find how many tickets are applicable for the discount
              // don't add these tickets to the total
              const noOfApplicableTickets =
                discountItem.maxQuantity ?? quantity;
              total += price.price * (quantity - noOfApplicableTickets);
              // store the fixed price to add it to the total later if not already stored
              if (fixedPriceToAdd === 0) {
                fixedPriceToAdd = discount.fixedPrice;
              }
            }
          }
        }
      } else {
        total += price.price * quantity;
      }
    } catch (err: any) {
      throw new Error(err?.message ?? "An error occurred");
    }
  }

  total += fixedPriceToAdd;
  return total;
};
