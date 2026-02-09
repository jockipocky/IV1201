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

      <v-alert v-if="success" type="success" class="mt-4" dense>
        {{ success }}
      </v-alert>

      <v-btn class="mt-6 mb-4" color="blue" block type="submit" :loading="loading" :disabled="loading">
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

    const success = ref<string | null>(null);
    const loading = ref(false);


    const t = inject<any>('t') //this is our dictionary
    const visible = ref(false);
    const error = ref<string | null>(null);
    const upgradeStore = useUpgradeStore(); // reuse auth store or create register store

    const isNonEmpty = function (v: string) {
      return typeof v === "string" && v.trim().length > 0;
    };

    const handleUpgrade = async () => {

      error.value = null;
      success.value = null;
      // Frontend validation (matches your backend "string required" check, but also blocks empty strings)
      if (
        !isNonEmpty(state.email) ||
        !isNonEmpty(state.personNumber) ||
        !isNonEmpty(state.upgradeCode) ||
        !isNonEmpty(state.username) ||
        !isNonEmpty(state.password)
      ) {
        error.value = "All fields are required";
        return;
      }

      try {

        error.value = null;
        loading.value = true;

        await upgradeStore.upgrade(
          state.email.trim(),
          state.personNumber.trim(),
          state.upgradeCode.trim(),
          state.username.trim(),
          state.password // usually don't trim passwords
        );
        success.value = "Account successfully upgraded";
        // optional: clear fields on success
        // state.email = ""; state.personNumber = ""; state.upgradeCode = ""; state.username = ""; state.password = "";
      } catch (err: any) {
        // Your backend returns { ok:false, error:"..." } (not "message"), so handle both
        error.value = err.response?.data?.error || err.response?.data?.message || "Upgrade failed";
        
      } finally {
        loading.value = false;
      }
    };


    return {
      t,
      state,
      visible,
      error,
      handleUpgrade,
      success,
      loading
    };
  },
});
</script>
