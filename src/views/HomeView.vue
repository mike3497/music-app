<template>
  <div class="container mx-auto p-4 h-svh">
    <BaseCard title="Album of the Week">
      <div v-if="isLoading">Loading...</div>
      <div v-else class="flex flex-col">
        <img
          :src="currentAlbum.artwork_url"
          alt="Album Artwork"
          class="w-full object-cover rounded-lg mb-4"
        />
        <div>
          <h3 class="text-xl font-semibold">{{ currentAlbum.title }}</h3>
          <p>{{ currentAlbum.artist }}</p>
          <ul class="list">
            <li v-for="song in currentAlbum.songs" :key="song.id" class="list-row items-center">
              <span>#{{ song.track_number }}</span>
              <span>{{ song.title }}</span>
              <div class="flex gap-2">
                <BaseButton @click="onRateSong(song.id)" class="">
                  <Star />
                </BaseButton>
                <BaseButton @click="onCommentSong(song.id)" class="">
                  <MessageCircle />
                </BaseButton>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import BaseCard from '@/components/shared/BaseCard.vue';
import { defaultAlbumDTO, type AlbumDTO } from '@/models/albumDTO';
import { Star, MessageCircle } from 'lucide-vue-next';
import BaseButton from '@/components/shared/BaseButton.vue';

const currentAlbum = ref<AlbumDTO>(defaultAlbumDTO);
const isLoading = ref<boolean>(false);

const fetchAlbum = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase.from('albums').select('*, songs(*)').single();

    if (error) {
      console.error('Error fetching weekly album:', error);
      return;
    }

    if (data) {
      console.log('wow');
      currentAlbum.value = {
        artist: data.artist,
        artwork_url: data.artwork_url,
        created_at: data.created_at,
        id: data.id,
        release_date: data.release_date,
        songs: data.songs,
        title: data.title,
      };
    }
  } catch (error) {
    console.error('Network error:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchAlbum();
});

const onRateSong = async (songId: string) => {
  console.log('Rate song:', songId);
};

const onCommentSong = async (songId: string) => {
  console.log('Comment song:', songId);
};
</script>
