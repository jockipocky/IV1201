/**
 * application related routes
 * handles application endpoints
 */

var express = require("express");
var router = express.Router();

const { applicationSubmission, fetchApplication, updatePI } = require("../controllers/applicationController");
const {
  fetchAllApplications,
  updateApplicationStatus
} = require("../controllers/applicationsController");


// POST /auth/login

// backend/routes/applications.js

// Recruiter routes
router.get("/all", fetchAllApplications);
router.put("/:personId/status", updateApplicationStatus);

// Applicant routes
router.post("/", applicationSubmission); // For the full application
router.get("/:person_id", fetchApplication);
router.post("/personal-info", updatePI);




module.exports = router;
