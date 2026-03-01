/**
 * application related routes
 * handles application endpoints
 */

var express = require("express");
var router = express.Router();
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware"); //to authenticate and authorize

const { applicationSubmission, fetchApplication, updatePI } = require("../controllers/applicationController");
const {
  fetchAllApplications,
  updateApplicationStatus
} = require("../controllers/applicationsController");


// POST /auth/login

// backend/routes/applications.js

// Recruiter routes
router.get(
  "/all",
  authenticate,
  authorizeRoles(1),
  fetchAllApplications
);

router.put(
  "/:personId/status",
  authenticate,
  authorizeRoles(1),
  updateApplicationStatus
);

// Applicant routes
router.post(
  "/",
  authenticate,
  authorizeRoles(2),
  applicationSubmission
); //for the full application
router.get(
  "/:person_id",
  authenticate,
  authorizeRoles(2),
  fetchApplication
);
router.post(
  "/personal-info",
  authenticate,
  authorizeRoles(2),
  updatePI
);




module.exports = router;
