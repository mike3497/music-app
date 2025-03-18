<template>
  <div class="toast">
    <div class="alert alert-success">
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Toast } from '@/models/toast';
import { type PropType } from 'vue';

defineProps({
  toast: {
    type: Object as PropType<Toast>,
    required: true,
  },
});
</script>
