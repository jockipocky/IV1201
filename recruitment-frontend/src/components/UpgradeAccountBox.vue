<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="500" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis mb-4">{{t.upgradeAccountInfo}}
    </div>

    <v-form ref="formRef" @submit.prevent="handleUpgrade" novalidate>
      <v-text-field
        v-model="state.email"
        :placeholder="t.emailLabel"
        :label="t.upgradeAccountEmailPlaceholder"
        type="email"
        :rules="[requiredRule, emailRule]"
        data-cy="upgrade-email"
      ></v-text-field>
      <v-text-field
        :model-value="state.personNumber"
        @update:modelValue="state.personNumber = formatPersonNumber($event) ?? $event"
        :label="t.personalNumberLabel"
        placeholder="YYYYMMDD-XXXX"
        :rules="[personNumberRule]"
        data-cy="upgrade-personnumber"
      ></v-text-field>


      <v-text-field
        v-model="state.upgradeCode"
        :label="t.upgradeAccountUpgradeCodePlaceholder"
        :placeholder="t.upgradeCodeLabel"
        :rules="[requiredRule]"
        data-cy="upgrade-code"
      ></v-text-field>

      <v-text-field
        v-model="state.username"
        :label="t.newUsernameLabel"
        :rules="[requiredRule]"
        data-cy="upgrade-username"
      ></v-text-field>

      <v-text-field
        v-model="state.password"
        :label="t.newPasswordLabel"
        :type="visible ? 'text' : 'password'"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="visible = !visible"
        :rules="[requiredRule, passwordMinRule]"
        data-cy="upgrade-password"
      ></v-text-field>

      <v-alert v-if="error" type="error" class="mt-4" dense data-cy="upgrade-error">
        {{ error }}
      </v-alert>

      <v-alert v-if="success" type="success" class="mt-4" dense data-cy="upgrade-success">
        {{ success }}
      </v-alert>

      <v-btn class="mt-3" variant="tonal" block type="button" @click="goToLogin" data-cy="upgrade-back">
        {{ t.backToLogin}}
      </v-btn>


      <v-btn class="mt-6 mb-4" color="blue" block type="submit" :loading="loading" :disabled="loading" data-cy="upgrade-submit">
        {{t.upgradeButtonLabel}}
      </v-btn>
    </v-form>
  </v-card>
</template>

<script lang="ts">
/**
 * UpgradeAccountBox.vue
 *
 * This component renders a form that allows users to upgrade their account. 
 * It includes fields for email, personal number, upgrade code, new username, and new password. 
 * The component handles form validation, displays error messages, and shows a success message upon successful upgrade.
 * It also provides a button to navigate back to the login page.
 */
import { defineComponent, ref, reactive } from "vue";
import { useUpgradeStore } from "@/stores/upgradeStore"; // Or create a separate register store
import { inject } from 'vue' //for dictionary
import { useRouter } from "vue-router";
import { computed } from "vue";
import { formatPersonNumber, isValidPersonNumberFormatted } from "@/utility/personNumber";
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
    const formRef = ref<any>(null);

    //const success = ref<string | null>(null);
    const loading = ref(false);

    const errorKey = ref<string | null>(null);
    const successKey = ref<string | null>(null);

    const error = computed(() =>
      errorKey.value ? (t.value?.[errorKey.value] ?? errorKey.value) : null
    );

    const success = computed(() =>
      successKey.value ? (t.value?.[successKey.value] ?? successKey.value) : null
    );


    const router = useRouter();

    const goToLogin = () => {
      router.push("/login");
    };
    

    const tRef = inject<any>("t")!;
    const t = computed(() => tRef.value);

    const personNumberRule = (v: string) => {
      if (!v || !v.trim()) return t.value?.allFieldsRequired;

      const formatted = formatPersonNumber(v);
      if (!formatted) return t.value?.invalidPersonalNumberFormat;

      return isValidPersonNumberFormatted(formatted) || t.value?.invalidPersonalNumber;
    };


    const visible = ref(false);
    //const error = ref<string | null>(null);
    const upgradeStore = useUpgradeStore(); // reuse auth store or create register store



    const requiredRule = (v: string) =>
        (typeof v === "string" && v.trim().length > 0) ||
        (t.value?.allFieldsRequired ?? "All fields are required");

      const emailRule = (v: string | null | undefined) =>
        (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ||
        (t.value?.invalidEmail ?? "Enter a valid email");

      const passwordMinRule = (v: string | null | undefined) =>
        (!!v && v.length >= 8) ||
        (t.value?.passwordTooShort ?? "Password must be at least 8 characters");

      const handleUpgrade = async () => {
      errorKey.value = null;
      successKey.value = null;

      const result = await formRef.value?.validate();

      if (!result?.valid) {
        const firstErrorMessage =
          result?.errors?.[0]?.errorMessages?.[0];

        errorKey.value = firstErrorMessage ?? "allFieldsRequired";
        return;
      }

      try {
        loading.value = true;

        const formattedPersonNumber = formatPersonNumber(state.personNumber);
        if (!formattedPersonNumber) {
          errorKey.value = "invalidPersonalNumberFormat";
          return;
        }

        await upgradeStore.upgrade(
          state.email.trim(),
          formattedPersonNumber,
          state.upgradeCode.trim(),
          state.username.trim(),
          state.password
        );

        successKey.value = "upgradeSuccess";
      } catch (err: any) {
        const backendKey = err.response?.data?.error?.messageKey;
        errorKey.value = backendKey ?? "upgradeFailed";
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
      loading,
      goToLogin,
      requiredRule,
      formRef,
      personNumberRule,
      formatPersonNumber,
      emailRule,
      passwordMinRule
    };
  },
});
</script>
