import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterAccount from "@/views/RegisterAccount.vue";
import UpgradeAccount from "@/views/UpgradeAccount.vue";
import ApplicationFormView from "@/views/ApplicationFormView.vue";

const routes = [
  { path: "/", component: LoginView },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterAccount },
  { path: "/upgrade", component: UpgradeAccount },
  // TODO: add ApplicantView and RecruiterView
  {path: "/applicationform", component: ApplicationFormView}
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
