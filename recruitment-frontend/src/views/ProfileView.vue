<template>
    <v-container>
      <ApplicationInfo/>
    </v-container>
    <v-container>
      <ProfileApplicationBox v-if="hasCompleteApplication && !isLoading"/>
    <ApplicationBox v-else-if="!isLoading"/> 
  </v-container>
</template>

<script setup lang="ts">
import ApplicationBox from "@/components/ApplicationBox.vue";
import ApplicationInfo from "@/components/ApplicationInfo.vue";
import ProfileApplicationBox from "@/components/ProfileApplicationBox.vue";
import { useApplicationStore } from "@/stores/applicationStore";
import { onMounted, computed } from "vue";

const applicationStore = useApplicationStore()

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