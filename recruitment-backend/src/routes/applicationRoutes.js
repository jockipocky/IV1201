/**
 * application related routes
 * handles application endpoints
 */

var express = require("express");
var router = express.Router();

const { applicationSubmission } = require("../controllers/applicationController");

// POST /auth/login
router.post("/", applicationSubmission);




module.exports = router;
