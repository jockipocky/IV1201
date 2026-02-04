/**
 * This file defines the central apiClient used as the main connection to the backend.
 * It uses Axios (https://www.npmjs.com/package/axios) to create a pre-configured
 * HTTP client instance.
 *
 * All API service files (like authApi.ts, applicationApi.ts) import and use this
 * client to perform HTTP requests.
 *
 * How to use:
 * import apiClient from "./http";
 *
 * const exampleRequest = async (param1: val1, param2: val2) => {
 *   return apiClient.post("/some/endpoint", { param1, param2 });
 * };
 */

import axios from "axios";


/**
 * Our configured Axios instance for backend communication, used for all requests.
 *
 * @property baseURL - Base URL of the backend API.
 * @property headers - Default headers applied to all requests.
 * @property withCredentials - Enables sending cookies for authenticated requests.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //this tells axios to include cookies in requests
});

export default apiClient;