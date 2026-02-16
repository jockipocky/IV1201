/**
 * This file represents our application management API requests.
 *
 * It contains all functions responsible for making requests to the backend
 * related to managing job applications, including:
 * - Fetching all applications
 * - Handling application status (accept or decline)
 *
 * All functions in this file use the shared Axios `apiClient` defined in `http.ts`
 * to perform their HTTP requests. Not every function is fully finalized yet.
 */

import apiClient from "./http";

/**
 * Fetches all job applications from the backend.
 * Currently logs the response to the console for debugging purposes.
 * Right now it returns all applications that are UNHANDLED. To change this
 * we can edit the applicationsQuery.js file in the backend where the select
 * statement to the DB is at.
 *
 * @returns A Promise resolving to the HTTP response containing all job applications. Array of a bunch of stuffz.
 * @throws Will throw an error if the network request fails.
 */
export const getApplications = async () => {
  const resp = await apiClient.get("/applications/all");
  console.log("Response for applications fetch: ", resp);
  return resp;
};

/**
 * Updates the status of a specific job application in the backend.
 *
 * Called when a recruiter accepts or declines an application. Sends the
 * new status to the backend to update the database. Handles concurrency!!!
 * Concurrency is handled in the applicationsQuery.js backend file.
 *
 * @param person_id - The unique ID of the applicant whose application is being updated.
 * @param action - The action to perform: "accept" will set status to ACCEPTED, "decline" will set status to REJECTED.
 *
 * @returns A Promise resolving to the HTTP response from the backend after updating the status.
 * @throws Will throw an error if the request fails, if the application does not exist, or if the backend returns a conflict.
 */
export const handleApplicationRequest = async (
  person_id: number,
  action: "accept" | "decline"
) => {
  return apiClient.put(`/applications/${person_id}/status`, {
    status: action === "accept" ? "ACCEPTED" : "REJECTED",
  });
};