<template>
  <header class="header">
    <h1 class="title">Recruit Boyz</h1>

    <div class="actions">
      <button class="lang-btn" @click="toggleLanguage">
        {{ currentLanguage.toUpperCase() }}
      </button>

            <!-- Only show if user is logged in -->
       <template v-if="auth.isLoggedIn">
        <span class="user-name">{{ auth.user.username }}</span>
        <button class="logout-btn" @click="onLogout">
          {{ t.logoutButtonLabel }}
        </button>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";

/**
 * Inject global app state / actions
 */
const tRef = inject<any>("t")!;
const currentLanguage = inject<any>("currentLanguage")!;
const setLanguage = inject<(lang: string) => void>("setLanguage")!;
const auth = useAuthStore();
const t = computed(() => tRef.value);

function toggleLanguage() {
  setLanguage(currentLanguage.value === "en" ? "sv" : "en");
}


const onLogout = () => {
  auth.logout();
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: relative;
}

/* Make title stick to the left */
.title {
  font-size: 1.3rem;
  font-weight: 700;
}

/* Actions container (right side) */
.actions {
  display: flex;
  gap: 0.75rem;
}

/* Language button: center of header */
.lang-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 0.4rem 0.8rem;
  border: 1px solid #7e0bdd;
  background: transparent;
  color: #7e0bdd;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.lang-btn:hover {
  background: #7e0bdd;
  color: white;
}

.logout-btn {
  padding: 0.4rem 0.9rem;
  background: #f3f3f3;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.logout-btn:hover {
  background: #e0e0e0;
}

.user-name {
  font-weight: 900;
  font-size: 1.3rem; 
  color: #7e0bdd;
}
</style>

