<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Job Applications</h1>
      </v-col>
    </v-row>

    <!-- Error -->
    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Loading -->
    <v-progress-circular
      v-if="!applications && !error"
      indeterminate
      color="primary"
    />

    <!-- Applications -->
    <v-expansion-panels
      v-if="applications"
      variant="accordion"
    >
      <v-expansion-panel
        v-for="application in applications"
        :key="application.applicationId"
      >
        <!-- Header -->
        <v-expansion-panel-title class="d-flex justify-space-between align-center">
          <span>
            {{ application.applicant.firstName }}
            {{ application.applicant.lastName }}
          </span>

          <v-chip
            :color="statusColor(application.status)"
            size="small"
            class="ml-4"
          >
            {{ application.status }}
          </v-chip>
        </v-expansion-panel-title>

        <!-- Expanded content -->
        <v-expansion-panel-text>
          <p>
            <strong>Person number:</strong>
            {{ application.applicant.personNumber }}
          </p>
          <p>
            <strong>Email:</strong>
            {{ application.applicant.email }}
          </p>

          <h3 class="mt-4">Competence Profile</h3>
          <v-list density="compact">
            <v-list-item
              v-for="(competence, index) in application.competences"
              :key="index"
            >
              {{ competence.name }} – {{ competence.yearsOfExperience }} years
            </v-list-item>
          </v-list>

          <h3 class="mt-4">Availability</h3>
          <v-list density="compact">
            <v-list-item
              v-for="(period, index) in application.availability"
              :key="index"
            >
              {{ period.fromDate }} → {{ period.toDate }}
            </v-list-item>
          </v-list>

          <!-- Placeholder for Manage Application -->
          <div class="mt-4">
            <em>Status can be updated here</em>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useApplicationsStore } from "@/stores/applicationsStore";
import type { ApplicationDTO } from "@/model/ApplicationDTO";
import { ApplicationStatus } from "@/model/ApplicationDTO";

const store = useApplicationsStore();

onMounted(() => {
  store.fetchAllApplications();
});

const applications = computed<ApplicationDTO[] | null>(
  () => store.applicationsResult
);

const error = computed(() => store.error);

function statusColor(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.ACCEPTED:
      return "green";
    case ApplicationStatus.REJECTED:
      return "red";
    case ApplicationStatus.UNHANDLED:
      return "grey";
    default:
      return "grey";
  }
}
</script>
