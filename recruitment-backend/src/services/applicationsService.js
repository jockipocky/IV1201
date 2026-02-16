/**
 * applicationsService.js
 *
 * Service layer responsible for business logic related to job applications.
 * This layer contains business rules but no HTTP-specific logic.
 */

const jwt = require("jsonwebtoken");
const applicationsFetcher = require("../repository/applicationsQuery")


/**
 * Fetches all applications from the repository layer.
 *
 * @returns {Promise<Object|null>}
 * Returns an object containing the applications list,
 * or null if no applications were found.
 */
async function fetchAllApplications() {
  const applications = await applicationsFetcher.fetchAllApplications();
  if (!applications) return null;
  return {
    applications
  };
}


/**
 * Attempts to update the status of an application.
 *
 * Delegates the update operation to the repository layer.
 *
 * Race Condition Handling:
 * - If the application was already updated by another recruiter,
 *   the repository returns updated: false.
 * - This method translates that into a 409 Conflict response.
 *
 * @param {number|string} personId - ID of the applicant.
 * @param {string} status - New status ("ACCEPTED" or "REJECTED").
 *
 * @returns {Promise<Object>} Structured response:
 * - { ok: true, status: 200, result: { status } }
 * - { ok: false, status: 409, error: string, currentStatus: string }
 */
async function updateApplicationStatus(personId, status) {
  const result = await applicationsFetcher.updateApplicationStatus(personId, status);
  
  if (!result.updated) {
    return {
      ok: false,
      status: 409, //race condition with other recruiter
      error: "Application already handled by another recruiter",
      currentStatus: result.currentStatus
    };
  }

  return {
    ok: true,
    status: 200,
    result: { status }
  };
}

module.exports = { fetchAllApplications, updateApplicationStatus };
