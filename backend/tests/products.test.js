import { jest } from "@jest/globals";
import request from "supertest";
import Product from "../src/models/Product.js";
import mongoose from "mongoose";
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
  it("handles server error during updating product", async () => {
    const spy = jest
      .spyOn(Product, "findByIdAndUpdate")
      .mockImplementationOnce(() => {
        throw new Error("DB error");
      });
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/products/${fakeId}`)
      .set("Cookie", cookie)
      .send({ price: 999 });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Update product error:"),
      expect.any(Error)
    );

    spy.mockRestore();
    errorSpy.mockRestore();
  });
  it("handles server error during fetching product by id", async () => {
    const spy = jest.spyOn(Product, "findById").mockImplementationOnce(() => {
      throw new Error("DB error");
    });
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/products/${fakeId}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Get product error:"),
      expect.any(Error)
    );

    spy.mockRestore();
    errorSpy.mockRestore();
  });
  it("handles server error during fetching all products", async () => {
    const spy = jest.spyOn(Product, "find").mockImplementationOnce(() => {
      throw new Error("DB error");
    });
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Fetch products error:"),
      expect.any(Error)
    );

    spy.mockRestore();
    errorSpy.mockRestore();
  });
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
  it("rejects invalid product id", async () => {
    const res = await request(app).get("/api/products/invalid-id");
    expect(res.statusCode).toBe(400);
  });
  it("returns 404 for non-existing product", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/products/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
  it("fails to update non-existing product", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/products/${fakeId}`)
      .set("Cookie", cookie)
      .send({ price: 999 });

    expect(res.statusCode).toBe(404);
  });

  it("rejects product creation with missing fields", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Cookie", cookie)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it("handles server error during product creation", async () => {
    const spy = jest.spyOn(Product, "create").mockImplementationOnce(() => {
      throw new Error("DB error");
    });
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(app)
      .post("/api/products")
      .set("Cookie", cookie)
      .send({ name: "fail", price: 100 });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Create product error:"),
      expect.any(Error)
    );

    spy.mockRestore();
    errorSpy.mockRestore();
  });

  it("fails update with invalid product ID format", async () => {
    const res = await request(app)
      .put("/api/products/invalid-id")
      .set("Cookie", cookie)
      .send({ price: 999 });

    expect(res.statusCode).toBe(400);
  });

  it("fails delete with invalid product ID format", async () => {
    const res = await request(app)
      .delete("/api/products/invalid-id")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(400);
  });
});
