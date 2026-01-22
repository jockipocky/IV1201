//for registering a new account


import { defineStore } from "pinia";
import { register } from "@/api/authApi";

export const useRegisterStore = defineStore("register", {
  state: () => ({ //actual initial state of the values in our store (MODEL)
    registeringResult: null as string | null,
    error: null,
  }),

  actions: { //actions we can perform on the values in our store
    async register(firstName: string, lastName: string, email: string, personalNumber: string, username: string, password: string) {
      try{
        const response = await register(firstName, lastName, email, personalNumber, username, password);
        this.registeringResult = response.data;
      } catch(err: any){
        this.error = err.response?.data?.message || "Registering failed, sorry";
      }
    }, //end of async login
  },
  getters:{ //getters accessible to the dom

  },
});
