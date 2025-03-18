<template>
  <AppHeader />
  <RouterView />
  <ToastsContainer />
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
import ToastsContainer from './components/ToastsContainer.vue';
</script>
