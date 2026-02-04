<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="500" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis mb-4">{{t.competenceProfile}}</div>

    <form @submit.prevent>
    <div 
        v-for="(competence ,index) in applicationStore.competences"
        :key="index">
        
        <v-text-field
            :model-value="competence"
            @update:model-value="applicationStore.updateCompetence(index, $event)"
            :label="t.competence"

            :append-inner-icon=" 
            index === applicationStore.competences.length-1
            ? 'mdi-plus' : 'mdi-delete'"
            @click:append-inner="handleCompIconClick(index)"
            class="mb-2"/>
    
    
     </div>




      <v-alert v-if="error" type="error" class="mt-4" dense>
        {{ error }}
      </v-alert>


    </form>
  </v-card>
</template>

<script setup lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useApplicationStore } from "@/stores/applicationStore"; // Or create a separate register store
import { inject } from 'vue' //for dictionary


import { submitApplication } from "@/api/applicationApi"; //måste skapas


    const error = ref<string | null>(null);
    const t = inject<any>("t");

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
    //överväg lägg till funktionallitet så att vi skapar en ny competence ifall vi trycker på enter
    const handleRegister = async () => {
        await applicationStore.submitApplication()
    }



</script>
