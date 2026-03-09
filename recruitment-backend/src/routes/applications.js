/**
 * @file applications.js
 * @description Express routes for managing job applications.
 *
 * Provides endpoints for:
 * - Recruiters to view and update applications
 * - Applicants to submit and manage their applications
 *
 * All routes require authentication and role-based authorization.
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

/**
 * @route GET /applications/all
 * @description Retrieve all submitted applications.
 * @access Recruiter (role: 1)
 * @middleware authenticate, authorizeRoles
 */
router.get(
  "/all",
  authenticate,
  authorizeRoles(1),
  fetchAllApplications
);

/**
 * @route PUT /applications/:personId/status
 * @description Update the status of an application.
 * @param {number} personId - ID of the applicant whose application is being updated
 * @body {string} status - New application status (ACCEPTED | REJECTED)
 * @access Recruiter (role: 1)
 * @middleware authenticate, authorizeRoles, validatePersonIdParam, validateStatusUpdate
 */
router.put(
  "/:personId/status",
  authenticate,
  authorizeRoles(1),
  validatePersonIdParam,
  validateStatusUpdate,
  updateApplicationStatus
);

/**
 * @route POST /applications
 * @description Submit a new job application including competences and availability.
 * @body {object} applicationData - Application submission payload
 * @access Applicant (role: 2)
 * @middleware authenticate, authorizeRoles, validateApplicationSubmission
 */
router.post(
  "/",
  authenticate,
  authorizeRoles(2),
  validateApplicationSubmission,
  applicationSubmission
); //for the full application

/**
 * @route GET /applications/:person_id
 * @description Retrieve the application belonging to a specific applicant.
 * @param {number} person_id - ID of the applicant
 * @access Applicant (role: 2)
 * @middleware authenticate, authorizeRoles, validatePersonIdParam
 */
router.get(
  "/:person_id",
  authenticate,
  authorizeRoles(2),
  validatePersonIdParam,
  fetchApplication
);

/**
 * @route POST /applications/personal-info
 * @description Submit or update personal information for an application.
 * @body {object} personalInfo - Applicant personal details
 * @access Applicant (role: 2)
 * @middleware authenticate, authorizeRoles, validatePersonalInfo
 */
router.post(
  "/personal-info",
  authenticate,
  authorizeRoles(2),
  validatePersonalInfo,
  updatePI
);




module.exports = router;
