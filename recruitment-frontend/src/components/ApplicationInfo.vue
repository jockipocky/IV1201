<template>
  <v-card class="mx-auto pa-6 mb-4" elevation="8" max-width="600" rounded="lg">
    
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h5 font-weight-bold">{{ t.personalInfoLabel }}</h2>
      
      <v-btn 
        v-if="!isEditing" 
        variant="text" 
        color="primary" 
        prepend-icon="mdi-pencil"
        @click="isEditing = true"
      >
        {{ t.editButtonLabel || 'Edit' }}
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

    <v-form v-else @submit.prevent="onSubmit">
      <v-text-field
        v-model="applicationStore.personalInfo.firstName"
        :label="t.firstNameLabel"
        variant="outlined"
        density="comfortable"
        class="mb-2"
      />
      <v-text-field
        v-model="applicationStore.personalInfo.lastname"
        :label="t.lastNameLabel"
        variant="outlined"
        density="comfortable"
        class="mb-2"
      />
      <v-text-field
        v-model="applicationStore.personalInfo.email"
        :label="t.emailLabel"
        variant="outlined"
        density="comfortable"
        class="mb-2"
      />
      <v-text-field
        v-model="applicationStore.personalInfo.personalNumber"
        :label="t.personalNumberLabel"
        variant="outlined"
        density="comfortable"
        class="mb-4"
      />

    <div class="d-flex ga-3">
      <v-btn
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
      <v-alert v-if="error" type="error" class="mt-4" variant="tonal">
        {{ error }}
      </v-alert>
    </v-form>
    <v-alert
      v-if="applicationStore.successMessage"
      type="success"
      variant="tonal"
      color="success"
      class="mt-4"
      closable
    >
      {{ t.successMessage }}
    </v-alert>
    <v-alert
      v-if="applicationStore.error"
      type="error"
      variant="tonal"
      color="error"
      class="mt-4"
      closable
    >
      {{ t.profileError }}
    </v-alert>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from "vue";
import { useApplicationStore } from "@/stores/applicationStore";

const applicationStore = useApplicationStore();
const t = inject<any>("t");
const error = ref<string | null>(null);
const isEditing = ref(false); // Controls the view toggle

const originalPersonalInfo = ref<any>(null);

onMounted(async () => {
  await applicationStore.fetchUserInfo();
  saveOriginalState();
});

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
  applicationStore.personalInfo = JSON.parse(JSON.stringify(originalPersonalInfo.value));
  isEditing.value = false;
  error.value = null;
};

const onSubmit = async () => {
  try {
    await applicationStore.submitPersonalInfo();
    saveOriginalState(); // Update the "original" to the new values
    isEditing.value = false; // Switch back to read-only view
  } catch (e) {
    error.value = t.genericError;
  }
};
</script>