<template>
  <div class="container mx-auto p-4 h-svh">
    <div class="flex flex-col gap-4">
      <BaseCard title="Album Selector">
        <AlbumSelector :value="selectedAlbumId" @change="onAlbumSelectorChange" />
      </BaseCard>
      <BaseCard v-if="selectedAlbum" title="Album">
        <img
          :src="selectedAlbum.artwork_url"
          alt="Album Artwork"
          class="w-full object-cover rounded-lg mb-4"
        />
        <div class="flex flex-col gap-1">
          <h1 class="text-xl font-bold">{{ selectedAlbum.title }}</h1>
          <p>{{ selectedAlbum.artist }}</p>
          <StarRating :rating="overallRating" :maxRating="5" />
        </div>
      </BaseCard>
      <BaseCard v-if="selectedAlbum" title="Songs">
        <SongList :songs="selectedAlbum.songs" />
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import AlbumSelector from '@/components/AlbumSelector.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import StarRating from '@/components/shared/StarRating.vue';
import SongList from '@/components/SongList.vue';
import { supabase } from '@/lib/supabaseClient';
import type { AlbumWithUserRatingsDTO } from '@/models/albumWithUserRatingsDTO';
import { useUserStore } from '@/stores/userStore';
import { computed, ref } from 'vue';

const userStore = useUserStore();

const isLoading = ref<boolean>(false);
const selectedAlbumId = ref<string | null>(null);
const selectedAlbum = ref<AlbumWithUserRatingsDTO | null>(null);

const overallRating = computed<number>(() => {
  const rating = selectedAlbum.value?.signed_in_user_overall_rating;
  if (!rating) {
    return 0;
  }

  return Math.round(rating);
});

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
