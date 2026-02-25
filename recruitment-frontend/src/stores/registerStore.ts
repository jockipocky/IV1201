//for registering a new account


import { defineStore } from "pinia";
import { register} from "@/api/authApi";

export const useRegisterStore = defineStore("register", {

  state: () => ({ //actual initial state of the values in our store (MODEL)
    registeringResult: null as string | null,
    error: null,
  }),

  actions: { //actions we can perform on the values in our store

    async register(
      firstName: string,
      lastName: string,
      email: string,
      personalNumber: string,
      username: string, 
      password: string,
      ) {
        const response = await register(firstName, lastName, email, personalNumber, username, password);
        console.log("[RegisterStore] Registration successful, response data:", response);
        this.registeringResult = response.data;
    },
  },  
  getters:{ //getters accessible to the dom

  },
});
