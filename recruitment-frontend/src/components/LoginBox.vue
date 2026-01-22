<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis mb-4">Account</div>

    <!-- Username / email field -->
    <v-text-field
      v-model="username"
      density="compact"
      placeholder="Email address"
      :prepend-inner-icon="mdiEmail"
      variant="outlined"
      required
    ></v-text-field>

    <!-- Password field -->
    <v-text-field
      v-model="password"
      :type="visible ? 'text' : 'password'"
      :append-inner-icon="visible ? mdiEyeOff : mdiEye"
      density="compact"
      placeholder="Enter your password"
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
      Log In
    </v-btn>

    <!-- Signup link -->
    <v-card-text class="text-center">
      <RouterLink
      class="text-blue text-decoration-none"
      to="/register"
    >
      Sign up now <v-icon :icon="mdiChevronDoubleRight"></v-icon>
    </RouterLink>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import {
  mdiEmail,
  mdiLock,
  mdiEyeOff,
  mdiEye,
  mdiChevronDoubleRight
} from "@mdi/js";

export default defineComponent({
  name: "LoginBox",
  setup() {
    const username = ref("");
    const password = ref("");
    const visible = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
      await authStore.login(username.value, password.value);
      if (authStore.user) {
        if (authStore.user.role === "RECRUITER") {
          router.push("/applications");
        } else {
          router.push("/apply");
        }
      }
    };

    return {
      username,
      password,
      visible,
      handleLogin,
      error: authStore.error,
      mdiEmail,
      mdiLock,
      mdiEyeOff,
      mdiEye,
      mdiChevronDoubleRight
    };
  },
});
</script>
