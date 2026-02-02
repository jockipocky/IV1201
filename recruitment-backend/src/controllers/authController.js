/**
 * Authentication controller.
 * Handles HTTP request related to authentication and sessions.
 */
const authService = require("../services/authService");

/**
 * Logs in a user using username and password.
 * If creds are valid, sets a JWT in a cookie
 * 
 * @param {import("express").Request} req - Epress request object 
 * @param {import("express").Response} res - Express response object 
 * @returns 
 */

async function login(req, res) {
  try {
    const { username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({
        ok: false,
        error: "username and password are required",
      });
    }

    const result = await authService.login(username, password);
    if (!result) {
      return res.status(401).json({
        ok: false,
        error: "Invalid username or password",
      });
    }

    // Set JWT cookie
    res.cookie("auth", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.json({
      ok: true,
      user: result.user,
    });
  } catch (err) {
    console.error("AUTH LOGIN ERROR:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Returns the currently authenticated user.
 * Requires a valid JWT cookie to procced. (handled by authMiddleware)
 * 
 * @param {import("express").Request} req 
 * @param {import {"express"}.Response} res 
 * @returns 
 */
function me(req, res) {
  // req.user comes from requireAuth middleware
  return res.json({
    ok: true,
    user: { username: req.user.username },
  });
}

/**
 * Logs out the current user by clearing the auth cookie.
 * 
 * @param {import("express").Request} req 
 * @param {import {"express"}.Response} res 
 * @returns 
 */
function logout(req, res) {
  res.clearCookie("auth");
  return res.json({ ok: true });
}

module.exports = { login, me, logout };
