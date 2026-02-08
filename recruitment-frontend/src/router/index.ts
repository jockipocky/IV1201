import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterAccount from "@/views/RegisterAccount.vue";
import UpgradeAccount from "@/views/UpgradeAccount.vue";
import RecruiterView from "@/views/RecruiterView.vue";

const routes = [
  { path: "/", component: LoginView },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterAccount },
  { path: "/upgrade", component: UpgradeAccount },
  { path: "/applications", component: RecruiterView },
  // TODO: add ApplicantView and RecruiterView
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
