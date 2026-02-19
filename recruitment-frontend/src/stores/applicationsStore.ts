/**
 * applicationsStore.ts
 *
 * This file defines the Pinia store responsible for managing
 * recruiter-facing job application state.
 *
 * Responsibilities:
 * - Passing on (middleman between component and backend) all job applications from the backend
 * - Storing and exposing application data to the UI
 * - Handling application status updates (accept/decline)
 * - Managing race-condition conflicts (e.g., when another recruiter
 *   has already handled the same application)
 * - Exposing structured error states for the component layer
 *
 * The store acts as the ViewModel in the MVVM architecture:
 * - It communicates with the API layer
 * - Transforms backend responses into ApplicationDTO objects
 * - Provides reactive state to Vue components
 */

import { defineStore } from "pinia";
import { getApplications } from "@/api/applicationsApi";
import { mapApplicationsResponse } from "@/utility/applicationsResponseHandler";
import { type ApplicationDTO } from "@/model/ApplicationDTO";
import { handleApplicationRequest } from "@/api/applicationsApi";
import { ApplicationStatus } from "@/model/ApplicationDTO";


/**
 * Pinia store for managing recruiter application workflows.
 *
 * State:
 * - applicationsResult: List of mapped ApplicationDTO objects
 * - error: General fetch error message
 * - handlingError: Error code for status update operations
 *
 * Actions:
 * - fetchAllApplications()
 * - handleApplication()
 */
export const useApplicationsStore = defineStore("register", {
  state: () => ({ //actual initial state of the values in our store (MODEL)
    applicationsResult: null as ApplicationDTO[] | null,
    error: null as string | null,
  handlingError: null as string | null
  }),

  actions: { //actions we can perform on the values in our store
    
    /**
     * Fetches all job applications from the backend.
     *
     * Calls the applications API and maps the raw response
     * into ApplicationDTO objects using mapApplicationsResponse.
     *
     * On success:
     * - Updates applicationsResult with mapped data.
     *
     * On failure:
     * - Sets the error state with a backend-provided message
     *   or a fallback error message.
     *
     * @returns A Promise that resolves when the fetch operation completes.
     */
    async fetchAllApplications() {
      try{
        const response = await getApplications();
        this.applicationsResult = mapApplicationsResponse(response);
        console.log("applicationResult is now: ", this.applicationsResult);
      } catch(err: any){
        this.error = err.response?.data?.message || "Failed to fetch job applications from DB.";
      }
    }, //end of async login


   /**
   * Handles updating the status of a specific application in the recruiter view.
   * Sends an update request to the backend to either accept or decline
   * an application.
   *
   * Race-condition handling:
   * - If the backend returns 409 (Conflict), then
   *   another recruiter has already handled the application.
   * - The store then updates the local application status to match
   *   the backend's currentStatus value.
   * - handlingError is set to "CONFLICT" so the component can
   *   display an appropriate message.
   *
   * Error handling (these are read by the component ApplicationList.vue): 
   * - 404 → "NOT_FOUND"
   * - 401 → "UNAUTHORIZED"
   * - Other errors → "GENERIC"
   *
   * @param applicationId - The unique identifier of the application. This is the person_id of the applicant.
   * @param action - The action to perform ("accept" or "decline").
   *
   * @returns A Promise that resolves when the update operation completes.
   */
    async handleApplication(applicationId: number, action: "accept" | "decline") {
      this.handlingError = null;
      try {
        await handleApplicationRequest(applicationId, action);
        if (!this.applicationsResult) return;

        const app = this.applicationsResult.find(a => a.applicationId === applicationId);
        if (!app) return;

        app.status =
          action === "accept"
            ? ApplicationStatus.ACCEPTED
            : ApplicationStatus.REJECTED;

      } catch (err: any) {
        const status = err.response?.status;

        if (status === 409) {
          const backendStatus = err.response?.data?.currentStatus;
          if (this.applicationsResult && backendStatus) {
            const app = this.applicationsResult.find(a => a.applicationId === applicationId);
            if (app) app.status = backendStatus;
          }
          this.handlingError = "CONFLICT"; // placeholder, component decides message
          return;
        }

        if (status === 404) this.handlingError = "NOT_FOUND";
        else if (status === 401) this.handlingError = "UNAUTHORIZED";
        else this.handlingError = "GENERIC";
      }
    },
  },
  getters:{ //getters accessible to the dom

  },
});
