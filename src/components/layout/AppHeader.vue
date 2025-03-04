<template>
  <header class="bg-base-200 shadow-sm">
    <div class="container mx-auto px-4 navbar">
      <div class="flex-1">
        <RouterLink class="btn btn-ghost text-xl" :to="{ name: 'home' }"
          ><Music />Music App</RouterLink
        >
      </div>
      <div class="flex-none">
        <div v-if="userStore.isLoggedIn" class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost rounded-field">
            <CircleUser />{{ userStore.fullName }}
          </div>
          <ul
            tabindex="0"
            class="menu dropdown-content bg-base-100 rounded-box z-1 mt-4 w-32 p-2 shadow-sm"
          >
            <li><RouterLink :to="{ name: 'profile' }">Profile</RouterLink></li>
            <li><button @click="onSignOutClick">Sign Out</button></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Music } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { CircleUser } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const onSignOutClick = async () => {
  await userStore.signOut();
};
</script>
