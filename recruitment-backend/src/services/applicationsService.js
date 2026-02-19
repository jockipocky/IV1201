/**
 * applicationsService.js
 *
 * Service layer containing business logic for applications.
 *
 * Responsibilities:
 * - Business logic (not a lot of it yet)
 * - Delegate persistence to the repository layer
 *
 * Importantly, this layer has no knowledge of HTTP or Express!!
 */

const jwt = require("jsonwebtoken");
const applicationsFetcher = require("../repository/applicationsQuery")


/**
 * Fetch all unhandled applications.
 *
 * @returns {Promise<{ applications: Array }>}
 */
async function fetchAllApplications() {
  const applications = await applicationsFetcher.fetchAllApplications();
  return { applications };
}


/**
 * Update the status of an application.
 *
 * @param {number|string} personId - Applicant identifier
 * @param {"ACCEPTED"|"REJECTED"} status - New status value
 *
 * @returns {Promise<{ updated: boolean, currentStatus?: string }>}
 *
 * Notes:
 * - If updated is false, the application was already handled.
 * - Race-condition protection is enforced in the repository layer, not here
 */
async function updateApplicationStatus(personId, status) {
  const result = await applicationsFetcher.updateApplicationStatus(personId, status);
  return result;
}

module.exports = { fetchAllApplications, updateApplicationStatus };
