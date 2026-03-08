<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="500" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis mb-4">{{t.competenceProfile}}</div>

    <v-form @submit.prevent="onApply" ref="formRef">
      <div v-for="(competence ,index) in applicationStore.competences" :key="index">
        <v-select
        data-cy="competence-select"
          :label="t.competence"
          :items="getAvailableCompetences(index)"
          :model-value="competence.competenceType"
          @update:model-value="applicationStore.updateCompetence(index, {competenceType: $event})"
          variant="outlined"
          density="compact"
          class="mb-6"
          :rules="[requiredRule]"
        />     

        <v-text-field
        data-cy="experience-input"
          @keydown.prevent
          type="number"
          step="0.1"
          @update:model-value="applicationStore.updateCompetence(index, {competenceTime: $event})"
          :label="t.yearsOfExperienceLabel"
          :model-value="competence.competenceTime"
          variant="outlined"
          density="compact"
          class="mb-2"
          :rules="[requiredRule, experienceRule]"
        />

        <v-btn icon 
          @click="handleCompIconClick(index)"
          class="mb-6">
          <v-icon>
            {{ index === applicationStore.competences.length - 1 && canAddCompetence ? mdiPlus : mdiDelete }}
          </v-icon>
        </v-btn>
      </div> 
      
      <div v-for="(availability, index) in applicationStore.availability" :key="index" class="mb-4">
        <v-date-picker
          data-cy="availability-picker"
          multiple="range"
          :model-value="applicationStore.getAvailabilityRange(index)"
          @update:model-value="applicationStore.setAvailabilityRange(index, $event)"
          :title="t.availabilityRange"
        ></v-date-picker> 
        
        <v-btn icon @click="handleAvailabilityIconClick(index)">
          <v-icon>{{ index === applicationStore.availability.length-1 && canAddAvailability ? mdiPlus : mdiDelete }}</v-icon>
        </v-btn>
      </div>

      <div class="d-flex ga-3">
        <v-btn
        data-cy="apply-button"
          color="primary"
          class="flex-grow-1"
          :disabled="!isValid"
          @click="onApply"
        >
          {{ t.apply }}
        </v-btn>
        
        <v-btn
          v-if="applicationStore.hasApplication"
          v-show="applicationStore.hasApplication"
          variant="outlined"
          data-cy="cancel-button"
          color="red"
          class="flex-grow-1"
          @click="cancelForm"
        >
          {{ t.cancelLabel || 'Cancel' }}
        </v-btn>
      </div>

    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useApplicationStore } from "@/stores/profileStore"; // Or create a separate register store
import { inject,computed } from 'vue' //for dictionary
import { mdiPlus, mdiDelete } from "@mdi/js"





    const t = inject<any>("t")!;
    const maxAvComp = 3

    const applicationStore = useApplicationStore()
    const formRef = ref()

    const canAddCompetence = computed(() => {
      return applicationStore.competences.length < maxAvComp
    })

    const allCompetences = computed(() => [
      t.value.ticketSalesLabel,
      t.value.rollerCoasterOperatorLabel,
      t.value.lotteriesLabel
    ])


    const getAvailableCompetences = (index: number) => {
      const selected = applicationStore.competences
        .map(c => c.competenceType)

      return allCompetences.value.filter(c =>
        !selected.includes(c) || c === applicationStore.competences[index]?.competenceType
      )
    }

    const canAddAvailability = computed(() => {
      return applicationStore.availability.length < maxAvComp
    })

    const availabilityRule = (range: any[]) => {
      if (!range || range.length !== 2) {
        return t.value?.selectDateRange || "Please select a start and end date"
      }

      const from =range [0]
      const to = range[1]
    
      if(from && to && from.getTime() === to.getTime()){
        return "availabilityDifferentDates"
      }
      return true
    }

    const requiredRule = (v: any) =>
      !!v || t.value?.allFieldsRequired || "Required";

    const experienceRule = (v: any) => {
      if (!v) return t.value?.allFieldsRequired;

      const num = Number(v);
      if (isNaN(num)) return t.value?.numberCheck;

      if (num < 0) return t.value?.numberCheck;


      return true;
    };


    if(applicationStore.competences.length === 0){
        applicationStore.addEmptyCompetence()
    }

    const handleCompIconClick = (index: number) => {
        const isLast = index === applicationStore.competences.length -1;
        if(isLast && canAddCompetence.value){
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

        if(isLast && canAddAvailability){
            applicationStore.addEmptyAvailability()
        } else{
            applicationStore.removeAvailability(index);
        }
    };

    const isValid = computed(() => {
      if (applicationStore.competences.length === 0) return false;
      if (applicationStore.availability.length === 0) return false;

      const competencesValid = applicationStore.competences.every(c =>
        c.competenceType && c.competenceTime
      );

      const availabilityValid = applicationStore.availability.every(a =>
        a.from !== null && a.to !==null
      );

      return competencesValid && availabilityValid;
    });


    const onApply = async() =>{
      const {valid} = await formRef.value.validate()

      if(!valid) return
      if(!isValid.value){
        applicationStore.error = "selectDateRange"
        return
      }

      for(let i = 0; i < applicationStore.availability.length; i++){
        const range = applicationStore.getAvailabilityRange(i)

        const ruleResult = availabilityRule(range)

        if(ruleResult !== true){
          applicationStore.error = ruleResult
          return
        }
      }

  
        try {
            await applicationStore.submitApplicationForm();

            await applicationStore.fetchApplication()

            applicationStore.isEditingApplication = false

          } catch (e) {
          applicationStore.error="genericError"
        }
    };


    const cancelForm = () => {
      applicationStore.isEditingApplication = false
    
      applicationStore.error = null;
};




</script>