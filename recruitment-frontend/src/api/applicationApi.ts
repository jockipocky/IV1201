//this is not yet finished just putting this here so we can work on it later
//like authApi.ts, this uses the axios object for the api client in http.ts
//and sends a get or post request for applications. we'll have to figure out
//the data payload later.

import apiClient from "./http";

export const getApplications = async () => {
  const resp = await apiClient.get("/applications/all");
  console.log("Response for applications fetch: ", resp);
  return resp;
};

export const submitApplication = async (data: any) => {
  return apiClient.post("/applications", data);
};