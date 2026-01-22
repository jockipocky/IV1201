import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";

const routes = [
  { path: "/", component: LoginView },
  { path: "/login", component: LoginView },
  // TODO: add ApplicantView and RecruiterView
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
