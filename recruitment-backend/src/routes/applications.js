/**
 * applications.js (Route Layer)
 *
 * Defines Express routes for application-related endpoints.
 *
 * Responsibilities:
 * - Map HTTP routes to controller handlers
 * - Now without business logic
 * - And no response formatting, controller handles all that
 *
 * Flow:
 * Frontend -> Router -> Controller -> Service -> Repository
 */

var express = require("express");
var router = express.Router();

const {
  fetchAllApplications,
  updateApplicationStatus
} = require("../controllers/applicationsController");


/**
 * GET /applications/all
 * Returns all unhandled job applications.
 * Handled entirely by the controller.
 */
router.get("/all", fetchAllApplications);

/**
 * PUT /applications/:personId/status
 * Updates the status of a specific application.
 * Body: { status: "ACCEPTED" | "REJECTED" }
 */
router.put("/:personId/status", updateApplicationStatus);


module.exports = router;
