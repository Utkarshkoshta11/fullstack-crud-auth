import request from "supertest";
import app from "../src/app.js";
import { setupDB, teardownDB } from "./setup.js";

let cookie;
let productId;

beforeAll(async () => {
  await setupDB();

  await request(app)
    .post("/api/auth/register")
    .send({ username: "admin", password: "123456" });

  const login = await request(app)
    .post("/api/auth/login")
    .send({ username: "admin", password: "123456" });

  cookie = login.headers["set-cookie"];
});

afterAll(teardownDB);

describe("Products API", () => {
  it("creates product (auth protected)", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Cookie", cookie)
      .send({ name: "Laptop", price: 1000, category: "Tech" });

    expect(res.statusCode).toBe(201);
    productId = res.body._id;
  });

  it("gets all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.body.length).toBe(1);
  });

  it("gets product by id", async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.body.name).toBe("Laptop");
  });

  it("updates product", async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set("Cookie", cookie)
      .send({ price: 1200 });

    expect(res.body.price).toBe(1200);
  });

  it("deletes product", async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Cookie", cookie);

    expect(res.body.message).toBe("Product deleted");
  });

  it("blocks unauthenticated product creation", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "X", price: 1 });

    expect(res.statusCode).toBe(401);
  });
});
