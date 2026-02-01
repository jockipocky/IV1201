//uses axios (https://www.npmjs.com/package/axios)
//to create an object representing our api client and make http requests easier

import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //this tells axios to include cookies in requests
});

export default apiClient;