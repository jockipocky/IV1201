<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6" md="4">
        <!-- Logo -->
        <v-img
          class="mx-auto my-6"
          max-width="228"
          :src="Logo"
        ></v-img>

        <!-- Login box component -->
        <LoginBox />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoginBox from "@/components/LoginBox.vue";
import Logo from "@/assets/recruitboys.png";

export default defineComponent({
  name: "LoginView",
  components: {
    LoginBox,
  },
  setup() {
    return {
      Logo,
    };
  },
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
