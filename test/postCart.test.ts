const request = require("supertest");

const postData = {
  items: [
    {
      eventId: 1,
      priceId: 1,
      quantity: 1,
    },
  ],
};

const invalidData = {
  items: [
    {
      eventId: 1,
      priceId: 1,
    },
  ],
};

describe("POST cart", () => {
  it("should return the correct response for a valid cart", async () => {
    const response = await request("http://localhost:8080")
      .post("/cart")
      .send(postData);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(postData);
  });

  it("should return the error response for an invalid cart", async () => {
    const response = await request("http://localhost:8080")
      .post("/cart")
      .send(invalidData);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: "Invalid cart" });
  });
});
