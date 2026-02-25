<template>
  <v-card
    class="mx-auto pa-6 mb-6"
    elevation="8"
    max-width="600"
    rounded="lg"
  >
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h5 font-weight-bold">
        {{ t.applicationInfo }}
      </h2>

      <v-btn
        v-if="!isEditing"
        variant="text"
        color="primary"
        prepend-icon="mdi-pencil"
        @click="applicationStore.hasApplication = false"
      >
        {{ t.editButtonLabel || "Edit" }}
      </v-btn>
    </div>

    <div v-if="!isEditing && application">
      
      <h3 class="text-subtitle-1 font-weight-bold mb-2">
        {{ t.competence }}
      </h3>

      <v-list density="compact" class="mb-6 pa-0 text left">
        <v-list-item
          v-for="(competence, index) in application.competences"
          :key="index"
          class="px-0"
        >

          {{ competence.name }}
          <span class="text-medium-emphasis">
            – {{ competence.yearsOfExperience }} {{ t.yearsUnit }}
          </span>
        </v-list-item>
      </v-list>

      <h3 class="text-subtitle-1 font-weight-bold mb-2">
        {{ t.availabilityTitle }}
      </h3>

      <v-list density="compact" class="mb-6 pa-0">
        <v-list-item
          v-for="(period, index) in application.availability"
          :key="index"
          class="px-0"
        >

          {{ period.fromDate }} → {{ period.toDate }}
        </v-list-item>
      </v-list>
    </div>

    <v-alert
      v-if="error"
      type="error"
      class="mt-4"
      variant="tonal"
    >
      {{ error }}
    </v-alert>

    <v-alert
      v-if="applicationStore.successMessage"
      type="success"
      variant="tonal"
      class="mt-4"
      closable
    >
      {{ t.successMessage }}
    </v-alert>

    <v-alert
      v-if="applicationStore.error"
      type="error"
      variant="tonal"
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
const application = computed(() => applicationStore.application)





</script>
