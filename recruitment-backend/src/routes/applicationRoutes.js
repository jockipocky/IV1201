/**
 * application related routes
 * handles application endpoints
 */

var express = require("express");
var router = express.Router();

const { login } = require("../controllers/authController");

// POST /auth/login
router.post("/application", login);



module.exports = router;
