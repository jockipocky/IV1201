/**
 * Verifies JWT from cookie and attaches user payload to request
 */

const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies?.auth; // cookie name: auth
  if (!token) return res.status(401).json({ ok: false, error: "Not authenticated" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
