//uses the api client we made (using axios) to make requests for a login using a username
//and password

import apiClient from "./http";

export const login = async (username: string, password: string) => {
  return apiClient.post("/auth/login", {
    username,
    password,
  });
}; //returns user row from db in backend

export const fetchUser = async () => {
  return apiClient.get("/auth/me");
}; //called on page refresh to auto-login if we have cookie

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

export const upgradeAccount = async (email: string, personalNumber: string, upgradeCode: string, username: string, password: string) => {
  return apiClient.post("/auth/upgrade", {
    email,
    personalNumber,
    upgradeCode,
    username,
    password,
  });
};