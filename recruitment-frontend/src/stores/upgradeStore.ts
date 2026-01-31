//for registering a new account


import { defineStore } from "pinia";
import { upgradeAccount } from "@/api/authApi";

export const useUpgradeStore = defineStore("upgrade", {
  state: () => ({ //actual initial state of the values in our store (MODEL)
    upgradeResult: null as string | null,
    error: null,
  }),

  actions: { //actions we can perform on the values in our store
    async upgrade(email: string, personalNumber: string, upgradeCode: string, username: string, password: string) {
      try{
        const response = await upgradeAccount(email, personalNumber, upgradeCode, username, password);
        this.upgradeResult = response.data;
      } catch(err: any){
        this.error = err.response?.data?.message || "Registering failed, sorry";
      }
    }, //end of async login
  },
  getters:{ //getters accessible to the dom

  },
});
