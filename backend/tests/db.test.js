import { connectDB } from "../src/config/db.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

describe("Database Connection", () => {
  it("connects to MongoDB successfully", async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const originalMongoUri = process.env.MONGO_URI;
    process.env.MONGO_URI = mongoUri;

    let logMessage = "";
    const originalLog = console.log;
    console.log = (msg) => {
      logMessage = msg;
    };

    await connectDB();

    expect(logMessage).toBe("MongoDB connected");
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected

    console.log = originalLog;
    await mongoose.connection.close();
    await mongoServer.stop();
    process.env.MONGO_URI = originalMongoUri;
  });
  it("handles DB connection failure", async () => {
    process.env.MONGO_URI = "invalid-uri";

    await expect(connectDB()).rejects.toBeDefined();
  });
});
