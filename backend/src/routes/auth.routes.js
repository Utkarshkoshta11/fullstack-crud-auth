import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  await User.create(req.body);
  res.json({ message: "User registered" });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ message: "Logged in" });
});

export default router;
