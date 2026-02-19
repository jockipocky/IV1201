<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="500" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis mb-4">{{t.registerBoxTitle}}</div>

    <form @submit.prevent="handleRegister">
      <v-text-field
        v-model="state.firstName"
        :label="t.firstNameLabel"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.lastName"
        :label="t.lastNameLabel"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.email"
        :label="t.emailLabel"
        type="email"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.personNumber"
        :label="t.personalNumberLabel"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.username"
        :label="t.usernameLabel"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.password"
        :label="t.passwordLabel"
        :type="visible ? 'text' : 'password'"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="visible = !visible"
        required
      ></v-text-field>

      <v-alert v-if="error" type="error" class="mt-4" dense>
        {{ error }}
      </v-alert>

      <v-btn class="mt-6 mb-4" color="blue" block @click="handleRegister">
        {{t.registerButtonLabel}}
      </v-btn>
    </form>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useRegisterStore } from "@/stores/registerStore";
import { inject } from 'vue' //for dictionary
import { router } from "@/router";

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

    const t = inject<any>('t') //this is our dictionary
    const visible = ref(false);
    const error = ref<string | null>(null);
    const registerStore = useRegisterStore(); // reuse auth store or create register store

    const handleRegister = async () => {
      
      if (!state.firstName || !state.lastName || !state.email || !state.personNumber || !state.username || !state.password) {
          error.value = "Please fill in all required fields.";
          return;
          }

      try {
        await registerStore.register(state.firstName, state.lastName, state.email, state.personNumber, state.username, state.password); // implement a register action in your store
        error.value = null;
        alert("Registration successful! Please log in.");
        router.push("/login"); //redirect to login page after successful registration
      } catch (err: any) {
        error.value = err.response?.data?.error || "Registration failed";
      }
    };

    return {
      t,
      state,
      visible,
      error,
      handleRegister,
    };
  },
});
</script>
