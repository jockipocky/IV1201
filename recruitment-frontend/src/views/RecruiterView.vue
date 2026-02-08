<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="10">
        <!-- Application list component -->
        <ApplicationList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/**
 * RecruiterView actual view and component container.
 *
 * View which displays the list of applicants fetched from the DB.
 *
 * Does:
 * - Shows all applicants fetched from DB
 * - Lets recruiter manage applications
 * - Lets recruiter expand applicaitons
 *
 * Dependencies:
 * - 
 * - 
 */


import { defineComponent } from "vue";
import Logo from "@/assets/recruitboys.png";
import ApplicationList from "@/components/ApplicationList.vue";

export default defineComponent({
  name: "LoginView",
  components: {
    ApplicationList,
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
