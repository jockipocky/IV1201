<template>
    <v-container>
      <ApplicationInfo/>
    </v-container>
    <v-container>
    <ApplicationBox />
  </v-container>
</template>

<script setup lang="ts">
import ApplicationBox from "@/components/ApplicationBox.vue";
import ApplicationInfo from "@/components/ApplicationInfo.vue";
</script>