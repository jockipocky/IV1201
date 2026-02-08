/**
 * Authentication service.
 * Create a JWT with person_id and also send a json with the token with all information of the user, password excluded. 
 */
const jwt = require("jsonwebtoken");
const applicationsFetcher = require("../repository/applicationsQuery")
/**
 * Attempts to fetch all applications for the user.
 * 
 * @returns - returns the JWT and also json with person information.
 */
async function fetchAllApplications() {


  const applications = await applicationsFetcher.fetchAllApplications();
  if (!applications) return null;

  return {
    applications
  };
}

module.exports = { fetchAllApplications };
