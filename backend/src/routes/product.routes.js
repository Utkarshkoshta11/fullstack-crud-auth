import express from "express";
import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", authMiddleware, apiLimiter, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.get("/", apiLimiter, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get("/:id", apiLimiter, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(product);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
