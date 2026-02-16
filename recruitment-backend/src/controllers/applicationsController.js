/**
 * applicationsController.js
 *
 * Controller layer for application-related operations. NOT COMPLETE!!
 * Will in the future need to check JWT and identity.
 *
 * Responsibilities:
 * - Validating incoming request parameters
 * - Delegating business logic to the service layer
 * - Structuring standardized responses for the route layer
 *
 * This layer does NOT directly interact with the database.
 */

const applicationsFetcher = require("../services/applicationsService");


/**
 * Retrieves all applications through the service layer.
 *
 * Calls applicationsService.fetchAllApplications() and
 * wraps the result in a standardized response object.
 *
 * @returns {Promise<Object>} Structured response:
 * {
 *   ok: boolean,
 *   status: number,
 *   result?: Object,
 *   error?: string
 * }
 */
async function fetchAllApplications() {

  const result = await applicationsFetcher.fetchAllApplications();
  if (!result) {
    return { ok: false, status: 401, error: "An error occurred or something, soz" };
  }

  return {
    ok: true,
    status: 200,
    result: result,
  };
}

/**
 * Updates the status of a specific application.
 *
 * Validates that the provided status is either "ACCEPTED" or "REJECTED"
 * before delegating to the service layer.
 *
 * @param {number|string} personId - ID of the applicant.
 * @param {string} status - New status ("ACCEPTED" or "REJECTED").
 *
 * @returns {Promise<Object>} Structured response from the service layer.
 *
 * Possible responses:
 * - 400 invalid status
 * - 409 Conflict (race condition)
 * - 200 Successful update
 */
async function updateApplicationStatus(personId, status) {

  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return {
      ok: false,
      status: 400,
      error: "Invalid status"
    };
  }

  return await applicationsFetcher.updateApplicationStatus(personId, status);
}

module.exports = {
  fetchAllApplications,
  updateApplicationStatus
};
