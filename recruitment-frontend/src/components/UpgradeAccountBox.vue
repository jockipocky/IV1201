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
        :rules="[requiredRule]"
      ></v-text-field>
      <v-text-field
        :model-value="state.personNumber"
        @update:modelValue="state.personNumber = formatPersonNumber($event) ?? $event"
        :label="t.personalNumberLabel"
        placeholder="YYYYMMDD-XXXX"
        :rules="[personNumberRule]"
      ></v-text-field>


      <v-text-field
        v-model="state.upgradeCode"
        :label="t.upgradeAccountUpgradeCodePlaceholder"
        :placeholder="t.upgradeCodeLabel"
        :rules="[requiredRule]"
      ></v-text-field>

      <v-text-field
        v-model="state.username"
        :label="t.newUsernameLabel"
        :rules="[requiredRule]"
      ></v-text-field>

      <v-text-field
        v-model="state.password"
        :label="t.newPasswordLabel"
        :type="visible ? 'text' : 'password'"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="visible = !visible"
        :rules="[requiredRule]"
      ></v-text-field>

      <v-alert v-if="error" type="error" class="mt-4" dense>
        {{ error }}
      </v-alert>

      <v-alert v-if="success" type="success" class="mt-4" dense>
        {{ success }}
      </v-alert>

      <v-btn class="mt-3" variant="tonal" block type="button" @click="goToLogin">
        {{ t.backToLogin}}
      </v-btn>


      <v-btn class="mt-6 mb-4" color="blue" block type="submit" :loading="loading" :disabled="loading">
        {{t.upgradeButtonLabel}}
      </v-btn>
    </v-form>
  </v-card>
</template>

<script lang="ts">
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
      router.push("/login"); // change if needed
    };

    //const t = inject<any>('t') //this is our dictionary
    

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


    const handleUpgrade = async () => {
      errorKey.value = null;
      successKey.value = null;

      const result = await formRef.value?.validate();
      if (!result?.valid) {
        errorKey.value = "allFieldsRequired";
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
        // If backend later returns messageKey, use it:
        const backendKey = err.response?.data?.error?.messageKey;

        // Otherwise fallback to a known key:
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
    };
  },
});
</script>
