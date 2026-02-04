/**
 * This file represents our authentication API requests.
 *
 * It contains all functions responsible for making authentication-related
 * requests to the backend, including:
 * - User login
 * - Auto-login via session cookies
 * - User registration
 * - Legacy account upgrades
 *
 * All functions in this file use the shared Axios apiClient defined in http.ts
 * to perform their HTTP requests. Not every function is implemented yet.
 */

import apiClient from "./http";

/**
 * Authenticates a user by sending login credentials to our backend.
 *
 * Called by authStore.ts, the view-model responsible for authentication
 * state and user information. The backend verifies the credentials and
 * returns the authenticated user's database record (minus the password).
 *
 * @param username - The user's username used for authentication.
 * @param password - The user's plaintext password. Hashing occurs in the backend.
 *
 * @returns A Promise resolving to the authenticated user's database record.
 * @throws Will throw an error if authentication fails or if the network request fails.
 */
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