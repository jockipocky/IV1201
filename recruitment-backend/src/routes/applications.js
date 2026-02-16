/**
 * applications.js (Route Layer)
 *
 * This file defines the Express routes for job application operations.
 *
 * Responsibilities:
 * - Receiving HTTP requests related to recruiter management of applications
 * - Formatting and returning standardized JSON responses
 * - Handling unexpected server errors
 *
 * This file acts as the communication layer in the backend architecture:
 * Client (Frontend) --> Communications --> Controller --> Service --> Repository
 *
 * All responses contain the structure:
 * {
 *   ok: boolean,
 *   result?: any,
 *   error?: string,
 * }
 */

var express = require("express");
var router = express.Router();

const {
  fetchAllApplications,
  updateApplicationStatus
} = require("../controllers/applicationsController");


/**
 * GET /applications/all
 *
 * Retrieves all job applications that are available for recruiter review. (UNHANDLED)
 *
 * Delegates request handling to the applicationsController.
 *
 * Success (200):
 * {
 *   ok: true,
 *   result: { applications: [...] }
 * }
 *
 * Failure:
 * - 4xx → Controller-defined validation/business error
 * - 500 → Unexpected server error
 */
router.get("/all", async function (req, res) {
  try {
    const body = req.body ?? {};
    const result = await fetchAllApplications();

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, error: result.error });
    }

    return res.status(200).json({ ok: true, result: result.result });

  } catch (err) {
    console.error("Error fetching all applications:", err);
    return res.status(500).json({ ok: false, error: "Server error when fetching applications" });
  }
});

/**
 * PUT /applications/:personId/status
 *
 * Updates the status of a specific application.
 *
 * Path parameters:
 * - personId: The unique identifier of the applicant.
 *
 * Request Body:
 * {
 *   status: "ACCEPTED" | "REJECTED"
 * }
 *
 * Success (200):
 * {
 *   ok: true,
 *   result: { status: "ACCEPTED" | "REJECTED" }
 * }
 *
 * Error Responses:
 * - 400 Invalid status
 * - 409 Application already handled
 * - 500 Internal server error
 */
router.put("/:personId/status", async function (req, res) {
  try {
    const { personId } = req.params;
    const { status } = req.body; // ACCEPTED or REJECTED

    const result = await updateApplicationStatus(personId, status);

    if (!result.ok) {
      return res.status(result.status).json({
        ok: false,
        error: result.error,
        currentStatus: result.currentStatus ?? null
      });
    }

    return res.status(200).json({
      ok: true,
      result: result.result
    });

  } catch (err) {
    console.error("Error updating application:", err);
    return res.status(500).json({
      ok: false,
      error: "Server error when updating application"
    });
  }
});


module.exports = router;
