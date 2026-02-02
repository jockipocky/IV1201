/**
 * Auth-related routes
 * Handles authentcation endpoints.
 */

var express = require("express");
var router = express.Router();

const authService = require("../services/authService");
const { requireAuth } = require("../middleware/authMiddleware");

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ ok: false, error: "username and password are required" });
    }

    const result = await authService.login(username, password);
    if (!result) {
      return res.status(401).json({ ok: false, error: "Invalid username or password" });
    }

    // Set JWT in HttpOnly cookie
    res.cookie("auth", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({ ok: true, user: result.user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});


// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("auth");
  return res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  // req.user is the decoded JWT payload
  return res.json({
    ok: true,
    user: { username: req.user.username,  },
  });
});
module.exports = router;
