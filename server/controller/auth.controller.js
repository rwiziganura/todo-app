import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authService from "../services/auth.services.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const existing = await authService.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await authService.createUser(name, email, hashedPassword);

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await authService.findUserByEmail(email);
    console.log("User found:", user ? "Yes" : "No");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("Token generated successfully");

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login Error:", error);
    next(error);
  }
};

