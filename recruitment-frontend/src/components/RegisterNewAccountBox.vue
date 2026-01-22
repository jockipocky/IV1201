<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="500" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis mb-4">Register New Account</div>

    <form @submit.prevent="handleRegister">
      <v-text-field
        v-model="state.firstName"
        label="First Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.lastName"
        label="Last Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.email"
        label="Email Address"
        type="email"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.personNumber"
        label="Person Number"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.username"
        label="Username"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.password"
        label="Password"
        :type="visible ? 'text' : 'password'"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="visible = !visible"
        required
      ></v-text-field>

      <v-alert v-if="error" type="error" class="mt-4" dense>
        {{ error }}
      </v-alert>

      <v-btn class="mt-6 mb-4" color="blue" block @click="handleRegister">
        Register
      </v-btn>
    </form>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useRegisterStore } from "@/stores/registerStore"; // Or create a separate register store

export default defineComponent({
  name: "RegisterNewAccountBox",
  setup() {
    const state = reactive({
      firstName: "",
      lastName: "",
      email: "",
      personNumber: "",
      username: "",
      password: "",
    });

    const visible = ref(false);
    const error = ref<string | null>(null);
    const registerStore = useRegisterStore(); // reuse auth store or create register store

    const handleRegister = async () => {
      try {
        // Optionally, add basic validation here
        await registerStore.register(state.firstName, state.lastName, state.email, state.personNumber, state.username, state.password); // implement a register action in your store
        error.value = null;
        // optionally redirect after successful registration
      } catch (err: any) {
        error.value = err.response?.data?.message || "Registration failed";
      }
    };

    return {
      state,
      visible,
      error,
      handleRegister,
    };
  },
});
</script>
