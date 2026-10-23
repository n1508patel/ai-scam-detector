import jwt from "jsonwebtoken";
import User from "../models/User.js";

async function getUserFromRequest(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;

  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch {
    return null;
  }
}

// Login required
export async function protect(req, res, next) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: "Not authorized, please log in" });
  }
  req.user = user;
  next();
}

// Login optional: attaches req.user if a valid token exists, otherwise continues as guest
export async function optionalAuth(req, res, next) {
  req.user = await getUserFromRequest(req);
  next();
}