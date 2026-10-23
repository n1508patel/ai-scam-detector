import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function userResponse(user) {
  return { id: user._id, name: user.name, email: user.email };
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: "Email is already registered" });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({ token: signToken(user._id), user: userResponse(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  const isMatch = user && (await bcrypt.compare(password, user.password));

  // Same message for both cases so attackers cannot tell which emails exist
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({ token: signToken(user._id), user: userResponse(user) });
}

export async function getMe(req, res) {
  res.json({ user: userResponse(req.user) });
}