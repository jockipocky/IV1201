/**
 * Recvies the request and sends it to the correct file.
 * Sends response to the request.
 */

var express = require("express");
var router = express.Router();

const { login, upgradeAccount } = require("../controllers/authController");

router.post("/login", async function (req, res) {
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

router.post("/logout", (req, res) => {
  res.clearCookie("auth", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res.status(200).json({ ok: true });
});

router.post("/upgrade", async function (req, res) {
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

router.post("/me", async function (req, res) {
  try {
    const result = await authController.me(req);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, error: result.error });
    }

    return res.status(200).json({ ok: true, user: result.user });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
})

module.exports = router;
