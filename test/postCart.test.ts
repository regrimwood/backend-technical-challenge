const request = require("supertest");

describe("POST cart", () => {
  it("should return the correct response for a valid cart", async () => {
    const postData = {
      items: [
        {
          eventId: 1,
          priceId: 1,
          quantity: 1,
        },
      ],
      discountId: null,
      total: 25,
    };

    const response = await request("http://localhost:8080")
      .post("/cart")
      .send(postData);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(postData);
  });

  it("should return the error response for an invalid cart", async () => {
    const invalidData = {
      items: [
        {
          eventId: 1,
          priceId: 1,
        },
      ],
      discountId: null,
      total: 100,
    };

    const response = await request("http://localhost:8080")
      .post("/cart")
      .send(invalidData);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: "Invalid cart" });
  });

  it("should remove the discountId if the discount is not valid", async () => {
    const postData = {
      items: [
        {
          eventId: 1,
          priceId: 1,
          quantity: 1,
        },
      ],
      discountId: 1,
      total: 100,
    };

    const response = await request("http://localhost:8080")
      .post("/cart")
      .send(postData);

    expect(response.status).toEqual(200);
    expect(response.body.discountId).toBeNull();
  });

  it("should return correct total for a cart with percent discount", async () => {
    const postData = {
      items: [
        {
          eventId: 1,
          priceId: 1,
          quantity: 5,
        },
      ],
      discountId: 1,
      total: 0,
    };

    const response = await request("http://localhost:8080")
      .post("/cart")
      .send(postData);

    expect(response.status).toEqual(200);
    expect(response.body.total).toEqual(112.5);
  });

  it("should return correct total for a cart with fixed price discount", async () => {
    const postData = {
      items: [
        {
          eventId: 1,
          priceId: 1,
          quantity: 5,
        },
        {
          eventId: 1,
          priceId: 2,
          quantity: 3,
        },
      ],
      discountId: 2,
      total: 0,
    };

    const response = await request("http://localhost:8080")
      .post("/cart")
      .send(postData);

    expect(response.status).toEqual(200);
    expect(response.body.total).toEqual(145);
  });
});
