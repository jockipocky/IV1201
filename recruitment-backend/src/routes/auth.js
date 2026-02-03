/**
 * Auth-related routes
 * Handles authentcation endpoints.
 */

var express = require("express");
var router = express.Router();

const { login } = require("../controllers/authController");

// POST /auth/login
router.post("/login", login);



module.exports = router;
