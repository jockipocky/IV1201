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
      class="my-6"
    />

    <!-- Applications -->
    <v-row justify="center" v-if="applications && applications.length">
      <v-col
        v-for="application in paginatedApplications"
        :key="application.applicationId"
        cols="12"
        md="10"
      >
        <v-expansion-panels variant="accordion">
          <v-expansion-panel>
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
              <p><strong>Person number:</strong> {{ application.applicant.personNumber }}</p>
              <p><strong>Email:</strong> {{ application.applicant.email }}</p>

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
      </v-col>
    </v-row>

    <!-- Pagination -->
    <v-row justify="center" class="mt-6" v-if="applications && applications.length">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        color="primary"
      />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useApplicationsStore } from "@/stores/applicationsStore";
import type { ApplicationDTO } from "@/model/ApplicationDTO";
import { ApplicationStatus } from "@/model/ApplicationDTO";

const store = useApplicationsStore();

// Fetch applications when component mounts
onMounted(() => {
  store.fetchAllApplications();
});

// Reactive state
const applications = computed<ApplicationDTO[] | null>(() => store.applicationsResult);
const error = computed(() => store.error);

// Pagination
const applicationsPerPage = 10;
const currentPage = ref(1);

const totalPages = computed(() => {
  return applications.value ? Math.ceil(applications.value.length / applicationsPerPage) : 1;
});

const paginatedApplications = computed(() => {
  if (!applications.value) return [];
  const start = (currentPage.value - 1) * applicationsPerPage;
  return applications.value.slice(start, start + applicationsPerPage);
});

// Helper for status chip color
function statusColor(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.ACCEPTED: return "green";
    case ApplicationStatus.REJECTED: return "red";
    case ApplicationStatus.UNHANDLED: return "grey";
    default: return "grey";
  }
}
</script>
