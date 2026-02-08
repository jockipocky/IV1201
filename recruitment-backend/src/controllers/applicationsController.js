/**
 * Auth controller, checks so the request have the neccary params and also sends the request down the layers
 * It also structure the response.
 */

const applicationsFetcher = require("../services/applicationsService");

/**
 * 
 * @returns - returns the applications
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

module.exports = { fetchAllApplications };
