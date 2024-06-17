const request = require("supertest");

describe("server", () => {
  it("should return the correct response from the test route", async () => {
    const response = await request("http://localhost:8080").get("/ping");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ message: "pong" });
  });
});
