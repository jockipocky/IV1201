<template>
  <div id="app">
    <Header></Header>
    <main>
      <router-view />
    </main>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
//we use a lifecycle hook here to implemented the automatic fetchUser call
//this asks backend to verify our identity by passing our jwt cookie to it
//, then returns our user object 
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import Footer from "@/components/Footer.vue";
import Header from "./components/Header.vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await authStore.fetchUser();

  // after fetching, redirect if currently on a guest-only page
  if (authStore.isLoggedIn) {
    if (router.currentRoute.value.meta.guestOnly) {
      if (authStore.user.role_id === 1) {
        router.replace("/recruiter");
      } else if (authStore.user.role_id === 2) {
        router.replace("/applicationform");
      }
    }
  }
});
</script>

<style>
/* Make the app container fill viewport height and use flex layout */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* full viewport height */
}

/* Main content takes remaining space, pushing footer down */
main {
  flex: 1;
  padding-bottom: 4rem; /* space for sticky footer */
}
</style>