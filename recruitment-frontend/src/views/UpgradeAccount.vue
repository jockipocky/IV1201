<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6" md="5">
        <!-- Optional logo -->
        <v-img
          class="mx-auto my-6"
          max-width="228"
          :src="Logo"
        ></v-img>

        <!-- Registration form component -->
        <UpgradeAccountBox />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UpgradeAccountBox from "@/components/UpgradeAccountBox.vue";
import Logo from "@/assets/recruitboys.png";

export default defineComponent({
  name: "UpgradeAccount",
  components: {
    UpgradeAccountBox,
  },
  setup() {
    return { Logo };
  },
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
