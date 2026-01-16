import User from "../src/models/User.js";
import { setupDB, teardownDB } from "./setup.js";
import bcrypt from "bcryptjs";

beforeAll(setupDB);
afterAll(teardownDB);

describe("User model", () => {
  it("hashes password before saving", async () => {
    const user = await User.create({
      username: "hash-test",
      password: "plain-password",
    });

    expect(user.password).not.toBe("plain-password");
    expect(await bcrypt.compare("plain-password", user.password)).toBe(true);
  });

  it("does not re-hash password if unchanged", async () => {
    const user = await User.findOne({ username: "hash-test" });
    const originalHash = user.password;

    user.username = "hash-test-2";
    await user.save();

    expect(user.password).toBe(originalHash);
  });
});
