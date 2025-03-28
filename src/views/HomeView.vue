<template>
  <div class="container mx-auto p-4 h-svh">
    <BaseCard>
      <div class="flex flex-col gap-4">
        <AlbumSelector :value="selectedAlbumId" @change="onAlbumSelectorChange" />
        <div v-if="isLoading" class="flex items-center gap-2">
          <span class="loading loading-spinner loading-sm"></span>
          <span>Loading album...</span>
        </div>
        <template v-else-if="selectedAlbum">
          <img
            :src="selectedAlbum.artwork_url"
            alt="Album Artwork"
            class="w-full object-cover rounded-lg mb-4"
          />
          <div>
            <h1 class="text-xl font-bold">{{ selectedAlbum.title }}</h1>
            <p class="mb-2">{{ selectedAlbum.artist }}</p>
            <SongList :songs="selectedAlbum.songs" />
          </div>
        </template>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import AlbumSelector from '@/components/AlbumSelector.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import SongList from '@/components/SongList.vue';
import { supabase } from '@/lib/supabaseClient';
import type { AlbumWithUserRatingsDTO } from '@/models/albumWithUserRatingsDTO';
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';

const userStore = useUserStore();

const isLoading = ref<boolean>(false);
const selectedAlbumId = ref<string | null>(null);
const selectedAlbum = ref<AlbumWithUserRatingsDTO | null>(null);

const fetchAlbum = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase.rpc('get_album_with_user_ratings', {
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

const onAlbumSelectorChange = (albumId: string) => {
  selectedAlbumId.value = albumId;
  fetchAlbum();
};
</script>
