<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="500" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis mb-4">{{t.personalInfoLabel}}</div>

    <form @submit.prevent>
    <div>
        
        <v-text-field
            :label="t.firstNameLabel"
            v-model="applicationStore.personalInfo.firstName"
            class="mb-2"/>
        
        <v-text-field
            :label="t.lastNameLabel"
            v-model="applicationStore.personalInfo.lastname"
            class="mb-2"/>
        
            
        <v-text-field
            :label="t.emailLabel"
            v-model="applicationStore.personalInfo.email"
            class="mb-2"/>

        <v-text-field
            :label="t.personalNumberLabel"
            v-model="applicationStore.personalInfo.personalNumber"
            class="mb-2"/>
        
        
    
    
     </div> 
      








      <v-alert v-if="error" type="error" class="mt-4" dense>
        {{ error }}
      </v-alert>


    </form>
  </v-card>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import { useApplicationStore } from "@/stores/applicationStore"; // Or create a separate register store
import { inject } from 'vue' //for dictionary
import { onMounted } from "vue";

onMounted(async () => {
  await applicationStore.fetchUserInfo();
});


    const error = ref<string | null>(null);
    const t = inject<any>("t");

    const applicationStore = useApplicationStore()




    if(applicationStore.availability.length === 0) {
        applicationStore.addEmptyAvailability()
    }
/**
 * 
 * asså vet inte ifall vi ens ska ha den här component box?
 * 
 * 
 */



</script>
