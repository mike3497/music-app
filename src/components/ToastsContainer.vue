<template>
  <Teleport to="#toast">
    <div class="toast toast-end toast-bottom">
      <BaseToast v-for="toast in toastsStore.toasts" :key="toast.id" :toast="toast" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import BaseToast from '@/components/shared/BaseToast.vue';
import { useToastsStore } from '@/stores/toastsStore';

const toastsStore = useToastsStore();
</script>
