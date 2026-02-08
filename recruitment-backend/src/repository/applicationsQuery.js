/**
 * Makes the actuall query to the database
 */

const db = require("../db/db");

/**
 * Fetches all applicant applications with competences and availabilities included.
 * the query looks small but we have made a non-materialized view in the database called
 * application_overview, inspectable with: application_overview
 * which fetches and aggregates all the relevant data (competencies, app status, personal data)
 * for us. 
 * 
 * @returns {Promise<Array>} list of applications
 */
async function fetchAllApplications() {
  const result = await db.query(
    "SELECT * FROM application_overview"
  );
  return result.rows;
}

module.exports = { fetchAllApplications };