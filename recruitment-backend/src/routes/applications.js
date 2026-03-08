/**
 * application related routes
 * handles application endpoints
 */

var express = require("express");
var router = express.Router();
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware"); //to authenticate and authorize
const {
  validatePersonalInfo,
  validateApplicationSubmission,
  validateStatusUpdate,
  validatePersonIdParam
} = require("../middleware/validateApplicationsInputData.js");


const { applicationSubmission, fetchApplication, updatePI } = require("../controllers/profileController");
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
  validatePersonIdParam,
  validateStatusUpdate,
  updateApplicationStatus
);

// Applicant routes
router.post(
  "/",
  authenticate,
  authorizeRoles(2),
  validateApplicationSubmission,
  applicationSubmission
); //for the full application
router.get(
  "/:person_id",
  authenticate,
  authorizeRoles(2),
  validatePersonIdParam,
  fetchApplication
);
router.post(
  "/personal-info",
  authenticate,
  authorizeRoles(2),
  validatePersonalInfo,
  updatePI
);




module.exports = router;
