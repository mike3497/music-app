<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <h1 class="card-title">{{ title }}</h1>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
