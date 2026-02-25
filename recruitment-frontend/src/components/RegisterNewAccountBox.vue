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
        @update:modelValue="state.personNumber = formatPersonNumber($event) ?? $event"
        required
        placeholder="YYYYMMDD-XXXX"
        :rules="[personNumberRule]"
      ></v-text-field>

      <v-text-field
        v-model="state.username"
        :label="t.usernameLabel"
        required
      ></v-text-field>

      <v-text-field
      v-model="state.password"
      :type="visible ? 'text' : 'password'"
      :append-inner-icon="visible ? mdiEyeOff : mdiEye"
      :placeholder="t.passwordFieldPlaceholder"
      :prepend-inner-icon="mdiLock"
      @click:append-inner="visible = !visible"
      required
    ></v-text-field>

      <v-alert v-if="error" type="error" class="mt-4" dense>
        {{ error }}
      </v-alert>

      <v-alert v-if="success" type="success" class="mt-4" dense>
        {{ success }}
      </v-alert>

      <v-btn class="mt-6 mb-4" color="blue" block @click="handleRegister">
        {{t.registerButtonLabel}}
      </v-btn>

      <v-btn class="mt-6 mb-4" variant="tonal" block @click="goToLogin">
        {{t.backToLogin}}
      </v-btn>

    </form>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useRegisterStore } from "@/stores/registerStore";
import { inject } from 'vue' //for dictionary
import { router } from "@/router";
import { formatPersonNumber, isValidPersonNumberFormatted } from "@/utility/personNumber";
import {
  mdiLock,
  mdiEyeOff,
  mdiEye,
} from "@mdi/js";
import { genOverlays } from "vuetify/lib/composables/variant.mjs";
import { GoToSymbol } from "vuetify/lib/composables/goto.mjs";



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
    const registerStore = useRegisterStore();
    const success = ref<string | null>(null);

    const goToLogin = () => {
      router.push("/login");
    };  

    const personNumberRule = (v: string) => {
      if (!v || !v.trim()) return t.value?.allFieldsRequired;

      const formatted = formatPersonNumber(v);
      if (!formatted) return t.value?.invalidPersonalNumberFormat;

      return isValidPersonNumberFormatted(formatted) || t.value?.invalidPersonalNumber;
    };

    const handleRegister = async () => {
      
      if (!state.firstName || !state.lastName || !state.email || !state.personNumber || !state.username || !state.password) {
          error.value = t.value?.allFieldsRequired;
          return;
          }

      if (state.password.length < 8) {
          error.value = t.value?.passwordTooShort || "Password must be at least 8 characters.";
          return;
          }

      if (!state.email.includes("@")) {
        error.value = t.value?.invalidEmail || "Email must contain @.";
        return;
      }

      try {
        await registerStore.register(state.firstName, state.lastName, state.email, state.personNumber, state.username, state.password); // implement a register action in your store
        error.value = null;
        success.value = t.value?.registrationSuccess;
        setTimeout(() => router.push("/login"), 2000);
      } catch (err: any) {
        console.error("Error during registration:", err);
        const errorCode = err.response?.data?.error;

        error.value = errorCode
          ? t.value.errors[errorCode]
          : t.value.errors.default
        console.error("Registration error:", error.value);

      }
    };

    return {
      t,
      state,
      visible,
      error,
      success,
      mdiLock,
      mdiEyeOff,
      mdiEye,
      handleRegister,
      goToLogin,
      personNumberRule,
      formatPersonNumber,
    };
  },
});
</script>
