import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "foody-prototype-change-me";

export const signToken = (user) =>
  jwt.sign(
    { sub: user.id, role: user.role, name: user.name, email: user.email },
    secret,
    { expiresIn: "7d" },
  );

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "Authentication required." });
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Admin access required." });
  next();
}
