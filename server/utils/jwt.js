import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "passupeaks-travels-secret-key-2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function decodeToken(token) {
  return jwt.decode(token);
}
