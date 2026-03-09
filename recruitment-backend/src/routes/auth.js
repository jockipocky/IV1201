/**
 * @file auth.js
 * @description Express routes for authentication and account management.
 *
 * Provides endpoints for:
 * - User login and logout
 * - Account registration
 * - Account upgrade
 * - Retrieving the currently authenticated user
 */

var express = require("express");
var router = express.Router();

const { login, upgradeAccount, registerAccount, me, } = require("../controllers/authController");

const {
  validateLogin,
  validateRegister,
  validateUpgrade
} = require("../middleware/validateAuthInputData.js");

/**
 * @route POST /auth/login
 * @description Authenticate a user and set an authentication cookie.
 * @body {string} username - User's username
 * @body {string} password - User's password
 * @access Public
 * @middleware validateLogin
 */
router.post("/login", validateLogin, async function (req, res) {
  try {
    const body = req.body ?? {};
    const result = await login(body.username, body.password);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, error: result.error });
    }

    res.cookie(result.cookie.name, result.cookie.value, result.cookie.options);
    
    return res.status(200).json({ ok: true, user: result.user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});


/**
 * @route POST /auth/logout
 * @description Log out the current user by clearing the authentication cookie.
 * @access Authenticated
 */
router.post("/logout", (req, res) => {
  res.clearCookie("auth", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res.status(200).json({ ok: true });
});


/**
 * @route POST /auth/upgrade
 * @description Upgrade an existing applicant account using an upgrade code.
 * @body {object} upgradeData - Account upgrade information
 * @access Public
 * @middleware validateUpgrade
 */
router.post("/upgrade", validateUpgrade, async function (req, res) {
  try {
    const result = await upgradeAccount(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, error: result.error });
    }


    return res.status(result.status).json(result.user);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
})


/**
 * @route GET /auth/me
 * @description Retrieve the currently authenticated user based on the auth cookie.
 * @access Authenticated
 */
router.get("/me", async function (req, res) {
  try {
    const result = await me(req);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, error: result.error });
    }

    return res.status(200).json({ ok: true, user: result.user });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
})

/**
 * @route POST /auth/register
 * @description Register a new user account.
 * @body {object} userData - Registration information
 * @access Public
 * @middleware validateRegister
 */
router.post("/register", validateRegister, async (req, res) => {
  
    const result = await registerAccount(req.body);

    if (!result.ok) {
      console.error("[ROUTES]: REGISTER ERROR:", result);
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(result.status).json(result.user);
});

module.exports = router;
