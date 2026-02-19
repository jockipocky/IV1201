/**
 * applicationsController.js
 *
 * Controller layer for application endpoints.
 *
 * Responsibilities:
 * - Extract and validate request data
 * - Invoke service layer operations
 * - Translate service results into HTTP responses
 * - Handle unexpected server errors
 *
 * This layer is HTTP-aware but does not access the database directly
 */
const applicationsService = require("../services/applicationsService");


/**
 * Handle GET /applications/all
 *
 * Response:
 * - 200 gives { ok: true, result: { applications: [....] } }
 * - 500 gives Server error
 */
async function fetchAllApplications(req, res) {
  try {
    const result = await applicationsService.fetchAllApplications(); //fetch the applications

    if (!result) { //if no result, 404
      return res.status(404).json({
        ok: false,
        error: "No applications found"
      });
    }

    return res.status(200).json({ //if result, 200!
      ok: true,
      result
    });

  } catch (err) { //if we threw an error its 500
    console.error("Error fetching applications:", err);
    return res.status(500).json({
      ok: false,
      error: "Server error when fetching applications"
    });
  }
}

/**
 * Handle PUT /applications/:personId/status
 *
 * Validates status and attempts to update the application status column in db.
 *
 * Responses:
 * - 200 means status updated successfully
 * - 400 means invalid status value
 * - 409 means application already handled
 * - 500 means server error
 * - 404 and 401 are yet to be implemented
 */
async function updateApplicationStatus(req, res) {
  try {
    const { personId } = req.params;
    const { status } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(status)) { //invalid parameter if we didnt update with accepted or rejected
      return res.status(400).json({
        ok: false,
        error: "Invalid status"
      });
    }

    //try to update and fetch the result, we inspect result to see if we had a conflict
    const result = await applicationsService.updateApplicationStatus(personId, status);

    if (!result.updated) { //we didnt update the column which means it was handled already by another recruiter
      return res.status(409).json({
        ok: false,
        error: "Application already handled by another recruiter",
        currentStatus: result.currentStatus ?? null
      });
    }

    return res.status(200).json({ //no conflict, it all worked out so 200
      ok: true,
      result: { status }
    });

  } catch (err) {//some other erro occured on our side (server side) so we give 500
    console.error("Error updating application:", err);
    return res.status(500).json({
      ok: false,
      error: "Server error when updating application"
    });
  }
}

module.exports = {
  fetchAllApplications,
  updateApplicationStatus
};
