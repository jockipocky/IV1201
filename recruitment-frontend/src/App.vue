<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
//we use a lifecycle hook here to implemented the automatic fetchUser call
//this asks backend to verify our identity by passing our jwt cookie to it
//, then returns our user object 
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchUser();
});
</script>