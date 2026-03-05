import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterAccount from "@/views/RegisterAccount.vue";
import UpgradeAccount from "@/views/UpgradeAccount.vue";
import RecruiterView from "@/views/RecruiterView.vue";
import ApplicationFormView from "@/views/ApplicationFormView.vue";
import ApplicantView from "@/views/ApplicantView.vue";
import { useAuthStore } from "@/stores/authStore";
import ProfileView from "@/views/ProfileView.vue";


//new routes structure, we declare meta: guestOnly if you can only access the page
//while not being logged in (meaning there is no user attribute in the authStore)
//and we declare requiresAuth if its the opposite (user attribute is required)
//we then check at role 1 or role 2 to see where to redirect to.
const routes = [
  { path: "/", component: LoginView, meta: { guestOnly: true } },
  { path: "/login", component: LoginView, meta: { guestOnly: true } },
  { path: "/register", component: RegisterAccount, meta: { guestOnly: true } },
  { path: "/upgrade", component: UpgradeAccount, meta: { guestOnly: true } },

  { path: "/recruiter", component: RecruiterView, meta: { requiresAuth: true, role: 1 } },
  { path: "/applicant", component: ApplicantView, meta: { requiresAuth: true, role: 2 } },
  { path: "/applicationform", component: ApplicationFormView, meta: { requiresAuth: true, role: 2 } },
  { path: "/profile", component: ProfileView, meta: { requiresAuth: true, role: 2} },
];



// ...imports + routes

export function authGuard(to: any, from: any, next: any) {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;
  const user = authStore.user;

  if (to.meta.requiresAuth && !isLoggedIn) return next("/login");

  if (to.meta.guestOnly && isLoggedIn) {
    if (user?.role_id === 1) return next("/recruiter");
    if (user?.role_id === 2) return next("/profile");
  }

  if (to.meta.role && user?.role_id !== to.meta.role) return next("/login");

  return next();
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);