<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6" md="4">
        <!-- Logo -->
        <v-img
          class="mx-auto my-6"
          max-width="228"
          :src="Logo"
        ></v-img>

        <!-- Login box component -->
        <LoginBox />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/**
 * LoginView actual view and component container.
 *
 * View which displays the login screen for the application.
 *
 * Does:
 * - Centers content vertically and horizontally using Vuetify grid system
 * - Displays the epic logo at the top
 * - Renders the LoginBox component for user authentication
 *
 * Dependencies:
 * - LoginBox component for the actual login form
 * - Logo image asset for branding (really cool)
 */


import { defineComponent } from "vue";
import LoginBox from "@/components/LoginBox.vue";
import Logo from "@/assets/recruitboys.png";

export default defineComponent({
  name: "LoginView",
  components: {
    LoginBox,
  },
  setup() {
    return {
      Logo,
    };
  },
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
