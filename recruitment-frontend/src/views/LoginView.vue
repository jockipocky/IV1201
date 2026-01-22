<template>
  <div class="login-container">
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <div>
        <label>Username</label>
        <input v-model="username" required />
      </div>

      <div>
        <label>Password</label>
        <input type="password" v-model="password" required />
      </div>

      <button type="submit">Sign In</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAuthStore } from "@/stores/authStore";

export default defineComponent({
  setup() {
    const username = ref("");
    const password = ref("");
    const authStore = useAuthStore();

    const handleLogin = async () => {
      await authStore.login(username.value, password.value);
      if (authStore.user) {
        // redirect based on role
        if (authStore.user.role === "RECRUITER") {
          window.location.href = "/applications";
        } else {
          window.location.href = "/apply";
        }
      }
    };

    return {
      username,
      password,
      handleLogin,
      error: authStore.error,
    };
  },
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
