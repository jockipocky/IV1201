/**
 * application related routes
 * handles application endpoints
 */

var express = require("express");
var router = express.Router();

const { applicationSubmission, fetchApplication } = require("../controllers/applicationController");

// POST /auth/login
router.post("/", applicationSubmission);
router.get("/:person_id", fetchApplication )




module.exports = router;
