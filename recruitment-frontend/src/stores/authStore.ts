/**
 * Our authentication store (Pinia).
 *
 * Acts as the view-model for authentication-related states and actions.
 * Responsible for managing the authenticated user, authentication errors,
 * and coordinating with the authentication API layer.
 *
 * This store is used by UI components that need access to authentication state
 * and triggering of authentication actions (like login).
 */


import { defineStore } from "pinia";
import { login, fetchUser,logout } from "@/api/authApi";
import { router } from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({ //actual initial state of the values in our store (MODEL)
    user: null as any,
  }),

  //actions we can perform on the values in our store, as i understand it equivalent to mutations + actions in vuex
  actions: {

    /**
     * Logs in a user using their credentials and updates the user state with the response.
     *
     * Calls the login function in authApi.ts to verify credentials. On success, stores
     * the authenticated user in state. On failure prints the error to the console.
     * The error is also caught separately in the view for now which might have to be changed.
     *
     * @param username - The user's username used for authentication.
     * @param password - The user's plaintext password.
     */
    async login(username: string, password: string) {
      try{
        const response = await login(username, password);
        this.user = response.data.user;
        console.log("Login successful, user data:", this.user);
      } catch(err: any){
        console.log(err);
      }
    }, //end of login

    async fetchUser() {
      try {
        const response = await fetchUser();
        this.user = response.data.user;
      } catch {
        this.user = null;
      }
    },//end of fetchUser. this is called on refresh to autologin using cookie

     async logout() {
      try {
        await logout(); // backend session destroyed
      } catch (e) {
        console.error("Logout failed:", e);
      }
      // frontend cleanup
      this.user = null;
      localStorage.removeItem("token");

      // navigation
      router.push("/login");
    },
  },
  getters:{ //getters accessible to the dom
     isLoggedIn: (state) => !!state.user,
  },
});
