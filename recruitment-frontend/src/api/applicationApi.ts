  //this is not yet finished just putting this here so we can work on it later
  //like authApi.ts, this uses the axios object for the api client in http.ts
  //and sends a get or post request for applications. we'll have to figure out
  //the data payload later.

  import apiClient from "./http";


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

  interface SubmitPIPayload{
    firstName: string;
    lastName: string;
    email: string;
    personalNumber: string;
    person_id: string;
  }
  
  /**
   * http anropp till backend som kallar på
   * all info angående application baserat på person_id
   * @param person_id användar info 
   * @returns 
   */
  export const fetchApplication = async (person_id: string) => {
    return apiClient.get(`/applications/${person_id}`);
  };

  export const submitApplication = async (data: SubmitApplicationPayload) => {
    return apiClient.post("/applications", data);
  };

  export const submitPI = async (data: SubmitPIPayload) => {
    return apiClient.post("/applications/personal-info", data)
  }