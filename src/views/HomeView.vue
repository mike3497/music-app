<template>
  <div class="container mx-auto p-4 h-svh">
    <BaseCard>
      <div v-if="isLoading">Loading...</div>
      <div v-else class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="album">Album</label>
          <select
            class="select"
            id="album"
            :value="selectedAlbumId"
            @change="onSelectedAlbumChanged"
          >
            <option v-for="album in albums" :key="album.id" :value="album.id">
              {{ getFormattedAlbum(album) }}
            </option>
          </select>
        </div>

        <template v-if="selectedAlbum">
          <img
            :src="selectedAlbum.artwork_url"
            alt="Album Artwork"
            class="w-full object-cover rounded-lg mb-4"
          />
          <div>
            <h3 class="text-xl font-semibold">{{ selectedAlbum.title }}</h3>
            <p>{{ selectedAlbum.artist }}</p>
            <SongList :songs="selectedAlbum.songs" />
          </div>
        </template>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/shared/BaseCard.vue';
import SongList from '@/components/SongList.vue';
import { supabase } from '@/lib/supabaseClient';
import { type AlbumDTO } from '@/models/albumDTO';
import type { AlbumWithUserRatingsDTO } from '@/models/albumWithUserRatingsDTO';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();

const albums = ref<AlbumDTO[]>([]);
const isLoading = ref<boolean>(false);
const selectedAlbumId = ref<string | null>(null);
const selectedAlbum = ref<AlbumWithUserRatingsDTO | null>(null);

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

const fetchAlbum = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase.rpc('get_album_with_songs_and_user_ratings', {
      p_album_id: selectedAlbumId.value,
      p_user_id: userStore.session?.user.id,
    });

    if (error) {
      console.error('Error fetching album:', error);
      return;
    }

    if (data) {
      selectedAlbum.value = data;
    }
  } catch (error: unknown) {
    console.error('Network error:', error);
  } finally {
    isLoading.value = false;
  }
};

const onSelectedAlbumChanged = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedAlbumId.value = target.value;
  fetchAlbum();
};

const getFormattedAlbum = (album: AlbumDTO) => {
  return `${album.title} by ${album.artist}`;
};

onMounted(async () => {
  await fetchAlbums();
});
</script>
