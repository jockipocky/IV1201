<template>
    <v-container>
      <ApplicationInfo/>
    </v-container>
    <v-container>

          <v-alert
      v-if="applicationStore.error"
      type="error"
      variant="tonal"
      closable
      class="mb-4"
      @click:close="applicationStore.error = null"
    >
      {{ t[applicationStore.error] }}
    </v-alert>
        <v-alert
      v-if="applicationStore.successMessage"
      type="success"
      variant="tonal"
      closable
      class="mb-4"
      @click:close="applicationStore.successMessage = null"
    >
      {{ t[applicationStore.successMessage] }}
    </v-alert>

      <ProfileApplicationBox v-if="hasCompleteApplication && !isLoading && !applicationStore.isEditingApplication"/>
    <ApplicationBox v-else-if="!isLoading && applicationStore.isEditingApplication"/> 
  </v-container>
</template>

<script setup lang="ts">
import ApplicationBox from "@/components/ApplicationBox.vue";
import ApplicationInfo from "@/components/ApplicationInfo.vue";
import ProfileApplicationBox from "@/components/ProfileApplicationBox.vue";
import { useApplicationStore } from "@/stores/profileStore";
import { onMounted, computed, inject } from "vue";

const applicationStore = useApplicationStore()
const t=inject<any>("t")

onMounted(async () =>{
  
  await applicationStore.fetchUserInfo()
  if(applicationStore.personalInfo.person_id){
    await applicationStore.fetchApplication()
  }
})

const hasCompleteApplication = computed(() => {
  return applicationStore.hasApplication
})

const isLoading = computed(() => {
  return applicationStore.isLoading
})
</script>