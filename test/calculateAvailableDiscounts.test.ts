import calculateAvailableDiscounts from "../src/utils/calculateAvailableDiscounts";
import { DiscountType } from "../src/utils/types/discountType";

describe("calculateAvailableDiscounts", () => {
  it("should return valid discounts", () => {
    const priceQuantities = new Map<number, number>([
      [1, 5],
      [2, 5],
      [3, 15],
    ]);

    const discounts: DiscountType = [
      {
        id: 1,
        name: "Discount 1",
        percentDiscount: 10,
        fixedPrice: undefined,
        items: [
          {
            priceId: 1,
            minQuantity: 5,
            maxQuantity: 10,
          },
        ],
      },
      {
        id: 2,
        name: "Discount 2",
        percentDiscount: 20,
        fixedPrice: undefined,
        items: [
          {
            priceId: 2,
            minQuantity: 10,
            maxQuantity: 15,
          },
        ],
      },
      {
        id: 3,
        name: "Discount 3",
        percentDiscount: 20,
        fixedPrice: undefined,
        items: [
          {
            priceId: 2,
            minQuantity: 10,
            maxQuantity: 15,
          },
          {
            priceId: 3,
            minQuantity: 10,
            maxQuantity: undefined,
          },
        ],
      },
      {
        id: 4,
        name: "Discount 4",
        percentDiscount: 20,
        fixedPrice: undefined,
        items: [
          {
            priceId: 2,
            minQuantity: 5,
            maxQuantity: 15,
          },
          {
            priceId: 3,
            minQuantity: 5,
            maxQuantity: undefined,
          },
        ],
      },
    ];

    const expectedDiscounts: DiscountType = [
      {
        id: 1,
        name: "Discount 1",
        percentDiscount: 10,
        fixedPrice: undefined,
        items: [
          {
            priceId: 1,
            minQuantity: 5,
            maxQuantity: 10,
          },
        ],
      },
      {
        id: 4,
        name: "Discount 4",
        percentDiscount: 20,
        fixedPrice: undefined,
        items: [
          {
            priceId: 2,
            minQuantity: 5,
            maxQuantity: 15,
          },
          {
            priceId: 3,
            minQuantity: 5,
            maxQuantity: undefined,
          },
        ],
      },
    ];

    const result = calculateAvailableDiscounts(priceQuantities, discounts);

    expect(result).toEqual(expectedDiscounts);
  });
});
