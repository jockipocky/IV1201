/**
 * applicationsQuery.js
 *
 * Repository layer responsible for direct database interaction.
 *
 * Responsibilities:
 * - Executing SQL queries
 * - Returning raw database results
 * - Enforcing race-condition safety at the SQL level
 *
 * This layer is the only layer that communicates directly with the database.
 */

const db = require("../db/db");

/**
 * Fetches all applicant applications with competences and availabilities included.
 * the query looks small but we have made a non-materialized view in the database called
 * application_overview, inspectable with: application_overview
 * which fetches and aggregates all the relevant data (competencies, app status, personal data)
 * for us. We just add the WHERE status = 'UNHANDLED' to make sure we only look at 
 * unhandled applicants.
 * 
 * @returns {Promise<Array>} list of applications
 */
async function fetchAllApplications() {
  const result = await db.query(
    "SELECT * FROM application_overview WHERE status = 'UNHANDLED'"
  );
  return result.rows;
}

/**
 * Updates an application's status in a race-condition-safe manner.
 *
 * The update only succeeds if the current status is 'UNHANDLED'.
 * This prevents multiple recruiters from handling the same application.
 *
 * SQL:
 * - UPDATE ... WHERE person_id = $2 AND status = 'UNHANDLED'
 * - If rowCount === 0 it means no update occurred, the current status is then fetched and returned
 *
 * @param {number|string} personId - ID of the applicant.
 * @param {string} status - New status ("ACCEPTED" or "REJECTED").
 *
 * @returns {Promise<Object>}
 * - { updated: true } if successful
 * - { updated: false, currentStatus: string|null } if conflict occurred
 */
async function updateApplicationStatus(personId, status) {

  //this query is race condition safe since it checks to see that status is Unhandled
  const result = await db.query(
    `
    UPDATE person_application_status
    SET status = $1
    WHERE person_id = $2
    AND status = 'UNHANDLED'
    RETURNING status
    `,
    [status, personId]
  );

  //if rowCount = 0 then nothing updated
  if (result.rowCount === 0) {
    //fetch current status to send back
    const current = await db.query(
      `SELECT status FROM person_application_status WHERE person_id = $1`,
      [personId]
    );

    return { //return the new status if we failed to update it due to race conditions
      updated: false,
      currentStatus: current.rows[0]?.status ?? null
    };
  }
  return { updated: true };
}

module.exports = { fetchAllApplications, updateApplicationStatus };