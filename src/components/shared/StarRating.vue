<template>
  <div v-for="n in maxRating" :key="n">
    <span v-if="n <= rating" class="w-6 h-6 mask mask-star bg-secondary"></span>
    <span v-else class="w-6 h-6 mask mask-star bg-secondary opacity-20"></span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  rating: number;
  maxRating: number;
}>();
</script>
