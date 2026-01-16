import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import { setupDB, teardownDB } from "./setup.js";

beforeAll(setupDB);
afterAll(teardownDB);

describe("User Registration", () => {
  it("successfully registers a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "utkarsh", password: "123456" });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("rejects duplicate registration", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "utkarsh", password: "123456" });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Username already exists");
  });

  it("rejects registration with missing username or password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "" });
    expect(res.statusCode).toBe(400);
  });

  it("rejects registration when both username and password are missing", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.statusCode).toBe(400);
  });

  it("handles server error during registration", async () => {
    const spy = jest.spyOn(User, "create").mockImplementationOnce(() => {
      throw new Error("DB error");
    });
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "failuser", password: "failpass" });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Register error:"),
      expect.any(Error)
    );
    spy.mockRestore();
    errorSpy.mockRestore();
  });

  it("handles duplicate user detection explicitly", async () => {
    const spy = jest.spyOn(User, "findOne").mockResolvedValueOnce({
      _id: "123",
      username: "utkarsh",
    });
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "utkarsh", password: "123456" });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Username already exists");
    spy.mockRestore();
  });
});

describe("User Login", () => {
  it("logs in a user and sets cookie", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "utkarsh", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("rejects login with invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "utkarsh", password: "wrong" });
    expect(res.statusCode).toBe(401);
  });

  it("rejects login for non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "nouser", password: "any" });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("rejects login when username or password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "" });
    expect(res.statusCode).toBe(400);
  });

  it("returns invalid credentials when password comparison fails", async () => {
    const spy = jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "utkarsh", password: "123456" });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
    spy.mockRestore();
  });

  it("handles missing JWT_SECRET gracefully", async () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "utkarsh", password: "123456" });
    expect(res.statusCode).toBe(500);
    process.env.JWT_SECRET = originalSecret;
  });
});

describe("Authentication & Token Handling", () => {
  it("rejects requests with invalid token", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Cookie", "token=invalid-token")
      .send({ name: "Test", price: 100 });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });

  it("logs out user and clears cookie", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.body.message).toBe("Logged out successfully");
  });
});
