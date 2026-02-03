/**
 * Authentication controller.
 * Handles HTTP request related to authentication.
 */
const authService = require("../services/authService");

/**
 * Checks login request then pass it forward
 * @param {*} req 
 * @param {*} res 
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
      maxAge: 60 * 60 * 1000, // 1 hour
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

module.exports = { login };
