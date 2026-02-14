  //this is not yet finished just putting this here so we can work on it later
  //like authApi.ts, this uses the axios object for the api client in http.ts
  //and sends a get or post request for applications. we'll have to figure out
  //the data payload later.

  import apiClient from "./http";

  const handlingState ={
      UNHANDLED: "unhandled",
      REJECTED: "rejected",
      ACCEPTED: "accepted"
      
  }

  interface personalInfo{
      firstName: string;
      lastname: string;
      email:string;
      personalNumber: string;
  }
  interface competence{
      competenceType: string;
      competenceTime: string;
  }

  interface availability{
      from: string | null;
      to: string | null;
  }

  interface SubmitApplicationPayload{
    competences: competence[];
    availability: availability[];
    handlingState: string;
    person_id: string
  }

  export const getApplications = async () => {
    return apiClient.get("/applications");
  };

  export const submitApplication = async (data: SubmitApplicationPayload) => {
    return apiClient.post("/applications", data);
  };