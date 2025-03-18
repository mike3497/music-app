<template>
  <ul class="list">
    <SongListItem v-for="song in songs" :key="song.id" :song="song" />
  </ul>
</template>

<script setup lang="ts">
import SongListItem from '@/components/SongListItem.vue';
import type { SongDTO } from '@/models/songDTO';

defineProps<{
  songs: Array<SongDTO>;
}>();
</script>
