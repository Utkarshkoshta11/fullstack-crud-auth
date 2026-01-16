import request from "supertest";
import app from "../src/app.js";
import { setupDB, teardownDB } from "./setup.js";

beforeAll(setupDB);
afterAll(teardownDB);

describe("Auth API", () => {
  it("registers a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "utkarsh", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User registered");
  });

  it("logs in a user and sets cookie", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "utkarsh", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("rejects invalid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "utkarsh", password: "wrong" });

    expect(res.statusCode).toBe(401);
  });

  it("rejects invalid token", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Cookie", "token=invalid-token")
      .send({ name: "Test", price: 100 });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });
});
