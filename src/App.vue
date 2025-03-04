<template>
  <AppHeader />
  <RouterView />
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
import { useUserStore } from './stores/userStore';
import { onMounted } from 'vue';

const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchSession();
});
</script>
