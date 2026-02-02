//to use this store we call import { useAuthStore} from "@/stores/authStore.ts" 
//then we can call on values in the store and modify them directly (not recommended i think)
//like:
// const store = useAuthStore();
// store.user = "this guy"
// but we can also call its actions
// store.login(username, password);


import { defineStore } from "pinia";
import { login, fetchUser } from "@/api/authApi";

export const useAuthStore = defineStore("auth", {
  state: () => ({ //actual initial state of the values in our store (MODEL)
    user: null as any,
    error: "",
  }),

  actions: { //actions we can perform on the values in our store
    async login(username: string, password: string) {
      try{
        const response = await login(username, password);
        this.user = response.data.user;
      } catch(err: any){
        this.error = err.response?.data?.message || "Login failed, sorry";
      }
    }, //end of async login

    async fetchUser() {
      try {
        const response = await fetchUser();
        this.user = response.data.user;
      } catch {
        this.user = null;
      }
    },//end of fetchUser. this is called on refresh to autologin using cookie

    logout() {
      this.user = null;
      localStorage.removeItem("token");
    },
  },
  getters:{ //getters accessible to the dom

  },
});
