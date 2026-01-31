<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="500" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis mb-4">{{t.upgradeAccountInfo}}
    </div>

    <form @submit.prevent="handleUpgrade">
      <v-text-field
        v-model="state.email"
        :placeholder="t.emailLabel"
        :label="t.upgradeAccountEmailPlaceholder"
        type="email"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.personNumber"
        :label="t.personalNumberLabel"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.upgradeCode"
        :label="t.upgradeAccountUpgradeCodePlaceholder"
        :placeholder="t.upgradeCodeLabel"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.username"
        :label="t.newUsernameLabel"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.password"
        :label="t.newPasswordLabel"
        :type="visible ? 'text' : 'password'"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="visible = !visible"
        required
      ></v-text-field>

      <v-alert v-if="error" type="error" class="mt-4" dense>
        {{ error }}
      </v-alert>

      <v-btn class="mt-6 mb-4" color="blue" block @click="handleUpgrade">
        {{t.upgradeButtonLabel}}
      </v-btn>
    </form>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useUpgradeStore } from "@/stores/upgradeStore"; // Or create a separate register store
import { inject } from 'vue' //for dictionary

export default defineComponent({
  name: "UpgradeAccountBox",
  setup() {
    const state = reactive({
      email: "",
      personNumber: "",
      upgradeCode: "",
      username: "",
      password: "",
    });

    const t = inject<any>('t') //this is our dictionary
    const visible = ref(false);
    const error = ref<string | null>(null);
    const upgradeStore = useUpgradeStore(); // reuse auth store or create register store

    const handleUpgrade = async () => {
      try {
        // Optionally, add basic validation here
        await upgradeStore.upgrade(state.email, state.personNumber, state.upgradeCode, state.username, state.password); // implement a register action in your store
        error.value = null;
        // optionally redirect after successful registration
      } catch (err: any) {
        error.value = err.response?.data?.message || "Registration failed";
      }
    };

    return {
      t,
      state,
      visible,
      error,
      handleUpgrade,
    };
  },
});
</script>
