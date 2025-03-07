<template>
  <div class="alert" :class="`alert-${alertColor}`" role="alert">
    <CircleX />
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import type { AlertColor } from '@/types/alertColor';
import { CircleX } from 'lucide-vue-next';

defineProps<{
  alertColor: AlertColor;
  message: string;
}>();
</script>
