import calculateAvailableDiscounts from "../src/utils/calculateAvailableDiscounts";

describe("calculateAvailableDiscounts", () => {
  it("should return valid discounts", () => {
    const priceQuantities = new Map<number, number>([
      [1, 5],
      [2, 10],
      [3, 15],
    ]);

    const discounts = [
      {
        discount_id: 1,
        name: "Discount 1",
        percentDiscount: 10,
        fixedPrice: undefined,
        price_id: 1,
        min_quantity: 5,
        max_quantity: 10,
      },
      {
        discount_id: 2,
        name: "Discount 2",
        percentDiscount: 20,
        fixedPrice: undefined,
        price_id: 2,
        min_quantity: 10,
        max_quantity: 15,
      },
    ];

    const expectedDiscounts = [
      {
        discountId: 1,
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
        discountId: 2,
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
    ];

    const result = calculateAvailableDiscounts(priceQuantities, discounts);

    expect(result).toEqual(expectedDiscounts);
  });
});
