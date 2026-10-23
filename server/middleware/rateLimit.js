import rateLimit from "express-rate-limit";

export const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: { error: "Too many requests. Please try again later." },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: "Too many login attempts. Please try again later." },
});
export const reportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: "Too many reports submitted. Please try again later." },
});