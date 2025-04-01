<template>
  <div>
    <span v-for="n in maxRating" :key="n">
      <span v-if="n <= rating" class="w-6 h-6 mask mask-star" :class="color"></span>
      <span v-else class="w-6 h-6 mask mask-star opacity-20" :class="color"></span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{
  color?: string;
  rating: number;
  maxRating: number;
}>();

const color = computed<string>(() => {
  switch (props.color) {
    case 'primary':
      return 'bg-primary';
    case 'secondary':
      return 'bg-secondary';
    default:
      return 'bg-black';
  }
});
</script>
