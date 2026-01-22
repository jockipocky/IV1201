//uses the api client we made (using axios) to make requests for a login using a username
//and password

import apiClient from "./http";

export const login = async (username: string, password: string) => {
  return apiClient.post("/auth/login", {
    username,
    password,
  });
};

export const register = async (firstName: string, lastName: string, email: string, personalNumber: string, username: string, password: string) => {
  return apiClient.post("/auth/register", {
    firstName,
    lastName,
    email,
    personalNumber,
    username,
    password,
  });
};