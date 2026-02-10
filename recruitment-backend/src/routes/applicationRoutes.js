/**
 * application related routes
 * handles application endpoints
 */

var express = require("express");
var router = express.Router();

const { login } = require("../controllers/applicationController");

// POST /auth/login
router.post("/application", applicationSubmission);



module.exports = router;
