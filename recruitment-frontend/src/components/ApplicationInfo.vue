<template>
  <v-card class="mx-auto pa-6 mb-4" elevation="8" max-width="600" rounded="lg">
    
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h5 font-weight-bold">{{ t.personalInfoLabel }}</h2>
      
      <v-btn 
        v-if="!isEditing" 
        data-cy="edit-profile"
        variant="text" 
        color="primary" 
        prepend-icon="mdi-pencil"
        @click="startEdit"
      >
        {{ t.editLabel || 'Edit' }}
      </v-btn>
    </div>

    <div v-if="!isEditing">
      <v-row dense>
        <v-col cols="12" sm="6">
          <p class="text-caption text-medium-emphasis mb-0">{{ t.firstNameLabel }}</p>
          <p class="text-body-1 mb-4">{{ applicationStore.personalInfo.firstName }}</p>
        </v-col>
        <v-col cols="12" sm="6">
          <p class="text-caption text-medium-emphasis mb-0">{{ t.lastNameLabel }}</p>
          <p class="text-body-1 mb-4">{{ applicationStore.personalInfo.lastname }}</p>
        </v-col>
        <v-col cols="12">
          <p class="text-caption text-medium-emphasis mb-0">{{ t.emailLabel }}</p>
          <p class="text-body-1 mb-4">{{ applicationStore.personalInfo.email }}</p>
        </v-col>
        <v-col cols="12">
          <p class="text-caption text-medium-emphasis mb-0">{{ t.personalNumberLabel }}</p>
          <p class="text-body-1 mb-4">{{ applicationStore.personalInfo.personalNumber }}</p>
        </v-col>
      </v-row>
    </div>

    <v-form ref="formRef" v-else @submit.prevent="onSubmit">
      <v-text-field
      data-cy="firstname-input"
        v-model="applicationStore.personalInfo.firstName"
        :label="t.firstNameLabel"
        variant="outlined"
        density="comfortable"
        class="mb-2"
          :rules="[requiredRule, nameRule]"
      />
      <v-text-field
        v-model="applicationStore.personalInfo.lastname"
        :label="t.lastNameLabel"
        variant="outlined"
        density="comfortable"
        class="mb-2"
          :rules="[requiredRule, nameRule]"
      />
      <v-text-field
        v-model="applicationStore.personalInfo.email"
        :label="t.emailLabel"
          :rules="[requiredRule, emailRule]"
        variant="outlined"
        density="comfortable"
        class="mb-2"
      />
      <v-text-field
        v-model="applicationStore.personalInfo.personalNumber"
        :label="t.personalNumberLabel"
        :rules="[personNumberRule]"
         @update:modelValue="
        applicationStore.personalInfo.personalNumber =
        formatPersonNumber($event) ?? $event"
        variant="outlined"
        density="comfortable"
        class="mb-4"
      />

    <div class="d-flex ga-3">
      <v-btn
      data-cy="save-profile"
        color="primary"
        class="flex-grow-1"
        :disabled="!isDirty"
        type="submit"
      >
        {{ t.changePersonalInfo }}
      </v-btn>
      
      <v-btn
        variant="outlined"
        color="red"
        class="flex-grow-1"
        @click="cancelEdit"
      >
        {{ t.cancelLabel  }}
      </v-btn>
    </div>

    </v-form>


  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from "vue";
import { useApplicationStore } from "@/stores/profileStore";
import { formatPersonNumber, isValidPersonNumberFormatted } from "@/utility/personNumber";

const applicationStore = useApplicationStore();
const t = inject<any>("t");
const isEditing = ref(false); 
const originalPersonalInfo = ref<any>(null);
  const formRef = ref();

  const startEdit = () => {
    saveOriginalState()
    isEditing.value = true
  }

  const requiredRule = (v: string) =>
  !!v?.trim() || t.value?.allFieldsRequired;
  
  const nameRule = (v: string) => {
  if (!v?.trim()) return t.value?.allFieldsRequired;

  const nameRegex = /^[A-Za-zÅÄÖåäö\s-]+$/;
  return (
    nameRegex.test(v) ||
    t.value?.invalidName || "Name cannot contain numbers."
  );
};

const emailRule = (v: string) => {
  if (!v?.trim()) return t.value?.allFieldsRequired;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    emailRegex.test(v) ||
    t.value?.invalidEmail || "Invalid email format."
  );
};

const personNumberRule = (v: string) => {
  if (!v || !v.trim()) return t.value?.allFieldsRequired;

  const formatted = formatPersonNumber(v);
  if (!formatted) return t.value?.invalidPersonalNumberFormat;

  return (
    isValidPersonNumberFormatted(formatted) ||
    t.value?.invalidPersonalNumber
  );
};

const saveOriginalState = () => {
  originalPersonalInfo.value = JSON.parse(
    JSON.stringify(applicationStore.personalInfo)
  );
};

const isDirty = computed(() => {
  if (!originalPersonalInfo.value) return false;
  return JSON.stringify(originalPersonalInfo.value) !==
         JSON.stringify(applicationStore.personalInfo);
});

const cancelEdit = () => {
  // Restore original data and exit edit mode
  console.log("originalState: ", originalPersonalInfo)
  applicationStore.personalInfo = JSON.parse(JSON.stringify(originalPersonalInfo.value));
  isEditing.value = false;
  applicationStore.error = null;
};

const onSubmit = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) return;
  try {
    await applicationStore.submitPersonalInfo();
    saveOriginalState(); // Update the "original" to the new values
    isEditing.value = false; // Switch back to read-only view
  } catch (e) {
    applicationStore.error ="genericError";
  }
};
</script>