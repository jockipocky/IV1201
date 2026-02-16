<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ t.applicationsTitle }}</h1>
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
                {{
                  application.status === ApplicationStatus.UNHANDLED
                    ? t.statusUnhandled
                    : application.status === ApplicationStatus.ACCEPTED
                    ? t.statusAccepted
                    : t.statusRejected
                }}
              </v-chip>
            </v-expansion-panel-title>

            <!-- Expanded content -->
            <v-expansion-panel-text>
              <p><strong>{{ t.personNumberLabel }}:</strong> {{ application.applicant.personNumber }}</p>
              <p><strong>{{ t.emailLabel }}:</strong> {{ application.applicant.email }}</p>

              <h3 class="mt-4">{{ t.competenceProfileTitle }}</h3>
              <v-list density="compact">
                <v-list-item
                  v-for="(competence, index) in application.competences"
                  :key="index"
                >
                  {{ competence.name }} – {{ competence.yearsOfExperience }} {{ t.yearsUnit }}
                </v-list-item>
              </v-list>

              <h3 class="mt-4">{{ t.availabilityTitle }}</h3>
              <v-list density="compact">
                <v-list-item
                  v-for="(period, index) in application.availability"
                  :key="index"
                >
                  {{ period.fromDate }} → {{ period.toDate }}
                </v-list-item>
              </v-list>

              <!-- Manage applications -->
              <div class="mt-4">
                <v-btn
                height="32"
                min-width="164"
                color="green"
                @click="handleApplication(application.applicationId, 'accept')"
                :disabled="application.status !== ApplicationStatus.UNHANDLED"
                >
                {{ t.acceptButtonLabel }}
              </v-btn>
              <v-btn
                height="32"
                min-width="164"
                color="red"
                @click="handleApplication(application.applicationId, 'decline')"
                :disabled="application.status !== ApplicationStatus.UNHANDLED"
                >
                {{ t.declineButtonLabel }}
              </v-btn>
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
  <v-snackbar
  v-model="snackbar"
  :color="snackbarColor"
  timeout="3000"
  top
  right
>
  {{ snackbarMessage }}
  <template #actions>
    <v-btn text @click="snackbar = false">Close</v-btn>
  </template>
</v-snackbar>
</template>

<script setup lang="ts">
/**
 * ApplicationList.vue
 *
 * This component displays all job applications for recruiters.
 *
 * Responsibilities:
 * - Fetch all applications on mount via the applications Pinia store
 * - Display applicant details, competence profiles, and availability periods
 * - Allow recruiters to accept or decline applications
 * - Handle race-condition conflicts (e.g., application already handled)
 * - Provide user feedback through a snackbar notification
 * - Support pagination for improved usability
 *
 * The component relies on:
 * - useApplicationsStore (Pinia store) for state management and API interaction
 * - Injected translation dictionary (`t`) for localized UI labels and messages
 * - Vuetify components for layout and styling
 */


import { inject } from 'vue';
import { ref, computed, onMounted } from "vue";
import { useApplicationsStore } from "@/stores/applicationsStore";
import type { ApplicationDTO } from "@/model/ApplicationDTO";
import { ApplicationStatus } from "@/model/ApplicationDTO";

const store = useApplicationsStore();
const t = inject<any>('t'); //injects the translation dictionary

//snackbar state
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref<"success" | "error">("success");

//fetch applications when component mounts
onMounted(() => {
  store.fetchAllApplications();
});

//for the reactive state
const applications = computed<ApplicationDTO[] | null>(() => store.applicationsResult);
const error = computed(() => store.error);

//for pagination
const applicationsPerPage = 5;
const currentPage = ref(1);

const totalPages = computed(() => {
  return applications.value ? Math.ceil(applications.value.length / applicationsPerPage) : 1;
});

const paginatedApplications = computed(() => {
  if (!applications.value) return [];
  const start = (currentPage.value - 1) * applicationsPerPage;
  return applications.value.slice(start, start + applicationsPerPage);
});

/**
 * Returns a Vuetify color string based on application status.
 *
 * Used to visually distinguish application states in the UI.
 *
 * @param status - The current status of the application.
 * @returns A string representing a Vuetify color ("green", "red", or "grey").
 */
function statusColor(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.ACCEPTED: return "green";
    case ApplicationStatus.REJECTED: return "red";
    case ApplicationStatus.UNHANDLED: return "grey";
    default: return "grey";
  }
}


/**
 * Handles recruiter interaction when accepting or declining an application.
 *
 * Calls the Pinia store to update the application status in the backend.
 * After the request completes, this function:
 * - Shows race-condition conflicts (409 errors handled in the store but generated in backend)
 * - Displays appropriate success or error messages via snackbar
 * - Reflects backend state if another recruiter has already handled the application
 *
 * @param applicationId - The unique ID of the application being updated.
 * @param action - The action to perform ("accept" or "decline").
 *
 * @returns A Promise that resolves once the operation and snackbar handling complete.
 */
async function handleApplication(applicationId: number, action: "accept" | "decline") {
  await store.handleApplication(applicationId, action);
  //check if store detected a backend conflict
  if (store.handlingError === "CONFLICT") {
    snackbarMessage.value = t.value.applicationAlreadyHandledMessage;
    snackbarColor.value = "error";
  } else if (store.handlingError === "NOT_FOUND") {
    snackbarMessage.value = t.value.applicationNotFoundMessage;
    snackbarColor.value = "error";
  } else if (store.handlingError === "UNAUTHORIZED") {
    snackbarMessage.value = t.value.applicationUnauthorizedMessage;
    snackbarColor.value = "error";
  } else {
    //no errors means we show normal success
    snackbarMessage.value =
      action === "accept"
        ? t.value.applicationAcceptedMessage
        : t.value.applicationDeclinedMessage;
    snackbarColor.value = "success";
  }

  snackbar.value = true;
}
</script>
