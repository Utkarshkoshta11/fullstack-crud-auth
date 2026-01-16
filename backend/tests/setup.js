import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Set environment variables for tests
process.env.JWT_SECRET = "test-secret-key";

let mongo;

export const setupDB = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
};

export const teardownDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};
