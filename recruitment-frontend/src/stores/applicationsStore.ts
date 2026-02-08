//for registering a new account


import { defineStore } from "pinia";
import { getApplications } from "@/api/applicationApi";
import { mapApplicationsResponse } from "@/utility/applicationsResponseHandler";
import { type ApplicationDTO } from "@/model/ApplicationDTO";

export const useApplicationsStore = defineStore("register", {
  state: () => ({ //actual initial state of the values in our store (MODEL)
    applicationsResult: null as ApplicationDTO[] | null,
    error: null,
  }),

  actions: { //actions we can perform on the values in our store
    async fetchAllApplications() {
      try{
        const response = await getApplications();
        this.applicationsResult = mapApplicationsResponse(response);
        console.log("applicationResult is now: ", this.applicationsResult);
      } catch(err: any){
        this.error = err.response?.data?.message || "Failed to fetch job applications from DB.";
      }
    }, //end of async login
  },
  getters:{ //getters accessible to the dom

  },
});
