<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis mb-4">{{ t.loginBoxTitle }}</div>

    <!-- Username / email field -->
    <v-text-field
      v-model="username"
      density="compact"
      :placeholder="t.usernameLabel"
      :prepend-inner-icon="mdiAccount"
      variant="outlined"
      required
    ></v-text-field>

    <!-- Password field -->
    <v-text-field
      v-model="password"
      :type="visible ? 'text' : 'password'"
      :append-inner-icon="visible ? mdiEyeOff : mdiEye"
      density="compact"
      :placeholder="t.passwordFieldPlaceholder"
      :prepend-inner-icon="mdiLock"
      variant="outlined"
      @click:append-inner="visible = !visible"
      required
    ></v-text-field>

    <!-- Error alert -->
    <v-alert v-if="error" type="error" class="mt-4" dense>
      {{ error }}
    </v-alert>

    <!-- Login button -->
    <v-btn
      class="mb-8"
      color="blue"
      size="large"
      variant="tonal"
      block
      @click="handleLogin"
    >
      {{ t.loginButtonLabel}}
    </v-btn>

    <!-- Upgrade account link -->
    <v-card-text class="text-center">
      <RouterLink
      class="text-blue text-decoration-none"
      to="/upgrade"
    >
      {{t.upgradeAccountLink}} <v-icon :icon="mdiChevronDoubleRight"></v-icon>
    </RouterLink>
    </v-card-text>

    <!-- Signup link -->
    <v-card-text class="text-center">
      <RouterLink
      class="text-blue text-decoration-none"
      to="/register"
    >
      {{t.signUpNowLink}} <v-icon :icon="mdiChevronDoubleRight"></v-icon>
    </RouterLink>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
/**
 * LoginBox component
 *
 * Displays a login form with username and password fields.
 * Sends user authentication to the authStore and redirects
 * the user based on role after successful login.
 *
 * Includes:
 * - Username and password input fields
 * - Show/hide password functionality
 * - Error display for failed login attempts
 * - Login button triggering authentication
 * - Links for account upgrade and registration
 *
 * Dependencies:
 * - Uses the authStore Pinia store for authentication actions
 * - Uses vue-router for redirection
 * - Injects a translation dictionary 't' for UI strings
 */

import { defineComponent, ref } from "vue";
import { inject } from 'vue' //for dictionary
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import {
  mdiEmail,
  mdiLock,
  mdiEyeOff,
  mdiEye,
  mdiChevronDoubleRight,
  mdiAccount
} from "@mdi/js";


export default defineComponent({
  name: "LoginBox",
  setup() {
    const username = ref("");
    const password = ref("");
    const visible = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();
    const t = inject<any>('t') //this is our dictionary
    const error = ref<string | null>(null);

    /**
    * Handles the login process when the user clicks the login button.
    *
    * Does:
    * 1. Clears any previous local error message
    * 2. Calls the authStore.login action with the entered credentials
    * 3. Checks if login was successful and redirects the user based on role
    * 4. Displays an error if login failed or an unexpected error occurs
    *
    * @async
    * @returns {Promise<void>} which resolves once login flow completes
    */
    const handleLogin = async () => {
      error.value = null;
      try{
        await authStore.login(username.value, password.value);
        if (!authStore.user) {
          // login failed
          error.value = t.value.loginError;
          return;
      }

      if (authStore.user) {
        if (authStore.user.role_id === 1) {
          router.push("/recruiter");
        } else if(authStore.user.role_id === 2){
          router.push("/profile");
        } else{
          error.value = t.value.loginError;
        return;
        }
      }
      }catch(err){
        //to handle unexpected errors
        error.value = t.value.loginError;
      }
    }; //end of handleLogin

    return {
      t,
      username,
      password,
      visible,
      handleLogin,
      error,
      mdiEmail,
      mdiLock,
      mdiEyeOff,
      mdiEye,
      mdiChevronDoubleRight,
      mdiAccount
    };
  },
});
</script>
