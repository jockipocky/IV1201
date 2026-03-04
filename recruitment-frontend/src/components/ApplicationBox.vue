<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="500" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis mb-4">{{t.competenceProfile}}</div>

    <form @submit.prevent>
      <div v-for="(competence ,index) in applicationStore.competences" :key="index">
        <v-select
          :label="t.competence"
          :items="[t.ticketSalesLabel, t.rollerCoasterOperatorLabel, t.lotteriesLabel]"
          :model-value="competence.competenceType"
          @update:model-value="applicationStore.updateCompetence(index, {competenceType: $event})"
          variant="outlined"
          density="compact"
          class="mb-6"
        />     

        <v-text-field
          @keydown.prevent
          type="number"
          step="0.1"
          @update:model-value="applicationStore.updateCompetence(index, {competenceTime: $event})"
          :label="t.yearsOfExperienceLabel"
          :model-value="competence.competenceTime"
          variant="outlined"
          density="compact"
          class="mb-2"
        />

        <v-btn icon 
          @click="handleCompIconClick(index)"
          class="mb-6">
          <v-icon>
            {{ index === applicationStore.competences.length - 1 ? mdiPlus : mdiDelete }}
          </v-icon>
        </v-btn>
      </div> 
      
      <div v-for="(availability, index) in applicationStore.availability" :key="index" class="mb-4">
        <v-date-picker
          multiple="range"
          :model-value="applicationStore.getAvailabilityRange(index)"
          @update:model-value="applicationStore.setAvailabilityRange(index, $event)"
          :title="t.availabilityRange"
        ></v-date-picker> 
        
        <v-btn icon @click="handleAvailabilityIconClick(index)">
          <v-icon>{{ index === applicationStore.availability.length-1 ? mdiPlus : mdiDelete }}</v-icon>
        </v-btn>
      </div>

      <div class="d-flex ga-3">
        <v-btn
          color="primary"
          class="flex-grow-1"
          @click="onApply"
        >
          {{ t.apply }}
        </v-btn>
        
        <v-btn
          v-if="applicationStore.hasApplication"
          v-show="applicationStore.hasApplication"
          variant="outlined"
          color="red"
          class="flex-grow-1"
          @click="cancelForm"
        >
          {{ t.cancelLabel || 'Cancel' }}
        </v-btn>
      </div>

      <v-alert v-if="error" type="error" class="mt-4" dense>
        {{ error }}
      </v-alert>
    </form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useApplicationStore } from "@/stores/applicationStore"; // Or create a separate register store
import { inject } from 'vue' //for dictionary
import { mdiPlus, mdiDelete } from "@mdi/js"





    const error = ref<string | null>(null);
    const t = inject<any>("t");

    const availability = ref<string[]>([])

    const applicationStore = useApplicationStore()

    if(applicationStore.competences.length === 0){
        applicationStore.addEmptyCompetence()
    }

    const handleCompIconClick = (index: number) => {
        const isLast = index === applicationStore.competences.length -1;
        if(isLast){
            applicationStore.addEmptyCompetence();
        } else {
            applicationStore.removeCompetence(index);
        }
    };

    if(applicationStore.availability.length === 0) {
        applicationStore.addEmptyAvailability()
    }
    const handleAvailabilityIconClick = (index: number) => {
        const isLast = index === applicationStore.availability.length-1;

        if(isLast){
            applicationStore.addEmptyAvailability()
        } else{
            applicationStore.removeAvailability(index);
        }
    };


    const onApply = async() =>{
        try {
            await applicationStore.submitApplicationForm();
            window.location.reload()
        } catch (e) {
            error.value = t.genericError
        }
    };


    const cancelForm = () => {
      applicationStore.isEditingApplication = false
    
    error.value = null;
};




</script>