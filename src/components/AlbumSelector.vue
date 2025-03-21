<template>
  <div class="flex flex-col gap-2">
    <label for="album">Album</label>
    <div v-if="isLoading" class="flex items-center gap-2">
      <span class="loading loading-spinner loading-sm"></span>
      <span>Loading albums...</span>
    </div>
    <select
      v-else
      class="select w-full"
      id="album"
      :value="selectedAlbumId"
      @change="onSelectedAlbumChanged"
      :disabled="isLoading"
    >
      <option v-for="album in albums" :key="album.id" :value="album.id">
        {{ getFormattedAlbum(album) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient';
import type { AlbumDTO } from '@/models/albumDTO';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  value: string | null;
}>();

const emit = defineEmits<{
  (e: 'change', id: string): void;
}>();

const albums = ref<AlbumDTO[]>([]);
const isLoading = ref<boolean>(false);
const selectedAlbumId = ref<string | null>(props.value);

const onSelectedAlbumChanged = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedAlbumId.value = target.value;
  emit('change', selectedAlbumId.value);
};

const getFormattedAlbum = (album: AlbumDTO) => {
  return `${album.title} by ${album.artist}`;
};

const fetchAlbums = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase.from('albums').select('*').order('title');

    if (error) {
      console.error('Error fetching albums:', error);
      return;
    }

    if (data) {
      albums.value = data;
    }
  } catch (error: unknown) {
    console.error('Network error:', error);
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      selectedAlbumId.value = newValue;
    }
  },
);

onMounted(() => {
  fetchAlbums();
});
</script>
